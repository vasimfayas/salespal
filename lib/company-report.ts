import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagerSalesmanIds, getManagerSalesmanIdsForOrg } from "@/lib/scoping";
import { getTargetAchievements, parseDateOnly, targetState, todayUtc } from "@/lib/salesman-targets";
import { isLostReason, lostReasonLabels, lostReasons } from "@/types/enquiry";
import { placeCountry } from "@/lib/agents";
import { reportParts, type ReportPart } from "@/lib/report-parts";
import { getLocations } from "@/lib/locations-db";
import { VOID_ORDER_STATUSES } from "@/types/order";

/**
 * Company report for a date range (read-only; feeds the PDF). All dates are inclusive calendar days (UTC).
 *   orders              orders under the company created in the range; value / profit exclude cancelled and sent-back orders
 *   provisional profit  the provisional profit of the enquiry each counted order came from (orders without an enquiry add 0)
 *   actual profit       actual profit accounts entered on the company's orders INVOICED in the range (by invoice date), excl. void orders
 *   enquiries           enquiries under the company dated in the range, at their current stage
 *   lost                enquiries under the company marked lost in the range, incl. lost orders (a cancelled order loses its enquiry)
 *   staff               owner: everyone selling for the company; manager: their own team for it
 */

/** Rows per detail table; a longer range is cut with a note so the PDF stays printable. */
export const DETAIL_LIMIT = 500;

type Num = number | string | bigint | null;
const n = (v: Num) => Number(v ?? 0);

export function parseRange(fromValue: unknown, toValue: unknown) {
  const from = parseDateOnly(fromValue);
  const to = parseDateOnly(toValue);
  if (!from || !to || from > to) return null;
  return { from, to, end: new Date(to.getTime() + 86_400_000) };
}

export { reportParts, reportPartLabels, type ReportPart } from "@/lib/report-parts";
const DEFAULT_PARTS: ReportPart[] = ["orders", "enquiries", "lost"];

/** Narrowing for a report; the defaults (everyone, every mode and country, the three usual tables) are the unfiltered report. */
export type ReportFilters = { staff: number[]; mode: string | null; fromCountry: string | null; toCountry: string | null; parts: ReportPart[] };

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : null);

/** Filters from a request body or a stored job's params; anything unrecognised falls back to "no filter". */
export function parseFilters(body: Record<string, unknown>): ReportFilters {
  const staff = Array.isArray(body.staff) ? [...new Set(body.staff.map(Number).filter((x) => Number.isInteger(x) && x > 0))].slice(0, 200) : [];
  const parts = reportParts.filter((x) => Array.isArray(body.parts) && body.parts.includes(x));
  return {
    staff,
    mode: ["sea", "air", "land"].includes(body.mode as string) ? (body.mode as string) : null,
    fromCountry: text(body.from_country),
    toCountry: text(body.to_country),
    parts: parts.length ? parts : DEFAULT_PARTS,
  };
}

/** The filters as stored in the job's params (only what differs from the default). */
export function filterParams(f: ReportFilters) {
  return {
    ...(f.staff.length ? { staff: f.staff } : {}),
    ...(f.mode ? { mode: f.mode } : {}),
    ...(f.fromCountry ? { from_country: f.fromCountry } : {}),
    ...(f.toCountry ? { to_country: f.toCountry } : {}),
    parts: f.parts,
  };
}

/** Every distinct From / To text this company's enquiries and orders use that belongs to `country`, per the locations list. */
async function placesIn(country: string, orgId: number) {
  const [rows, places] = await Promise.all([
    prisma.$queryRaw<{ v: string }[]>(Prisma.sql`
      SELECT "from" AS v FROM enquiries WHERE org_id = ${orgId} UNION SELECT "to" FROM enquiries WHERE org_id = ${orgId}
      UNION SELECT "from" FROM orders WHERE org_id = ${orgId} UNION SELECT "to" FROM orders WHERE org_id = ${orgId}`),
    getLocations(),
  ]);
  const want = country.toLowerCase();
  return rows.map((r) => r.v).filter((v) => placeCountry(v, places) === want);
}

export type CompanyReport = NonNullable<Awaited<ReturnType<typeof getCompanyReport>>>;

export async function getCompanyReport(orgId: number, range: NonNullable<ReturnType<typeof parseRange>>, viewer: { id: number; role_id: number }, f: ReportFilters = parseFilters({})) {
  const { from, end } = range;
  // Compare as plain dates: date columns vs. JS Date params would be shifted by the DB session time zone.
  const day = (d: Date) => Prisma.sql`${d.toISOString().slice(0, 10)}::date`;
  const [S, E] = [day(from), day(end)];
  const voided = Prisma.join([...VOID_ORDER_STATUSES]);
  const [fromPlaces, toPlaces] = await Promise.all([f.fromCountry ? placesIn(f.fromCountry, orgId) : null, f.toCountry ? placesIn(f.toCountry, orgId) : null]);
  const inList = (col: string, list: string[] | null) => (list ? (list.length ? Prisma.sql`AND ${Prisma.raw(col)} IN (${Prisma.join(list)})` : Prisma.sql`AND FALSE`) : Prisma.empty);
  /** The report's staff / mode / country filters for rows aliased `a` (orders or enquiries). */
  const fo = (a: "o" | "e") => Prisma.sql`${f.staff.length ? Prisma.sql`AND ${Prisma.raw(a)}.created_by_id IN (${Prisma.join(f.staff)})` : Prisma.empty} ${f.mode ? Prisma.sql`AND ${Prisma.raw(a)}.mode = ${f.mode}` : Prisma.empty} ${inList(`${a}."from"`, fromPlaces)} ${inList(`${a}."to"`, toPlaces)}`;

  const [org, orderAgg, actualAgg, enquiryAgg, lostAgg, orders, enquiries, lostItems, sellers, confirmedItems] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { name: true, prefix: true, logo_path: true, address: true, phone: true, email: true } }),

    prisma.$queryRaw<{ by: number; count: Num; value: Num; profit: Num; voided: Num }[]>(Prisma.sql`
      SELECT o.created_by_id AS by,
             COUNT(*) FILTER (WHERE o.status NOT IN (${voided}))::int AS count,
             COALESCE(SUM(o.amount) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS value,
             COALESCE(SUM(e.provisional_profit) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS profit,
             COUNT(*) FILTER (WHERE o.status IN (${voided}))::int AS voided
      FROM orders o LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E} ${fo("o")}
      GROUP BY 1`),

    prisma.$queryRaw<{ by: number; count: Num; cost: Num; profit: Num }[]>(Prisma.sql`
      SELECT o.created_by_id AS by, COUNT(*)::int AS count,
             COALESCE(SUM(e.actual_cost), 0)::float8 AS cost, COALESCE(SUM(e.actual_profit), 0)::float8 AS profit
      FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.status NOT IN (${voided}) AND e.actual_profit IS NOT NULL
        AND o.invoice_date >= ${S} AND o.invoice_date < ${E} ${fo("o")}
      GROUP BY 1`),

    prisma.$queryRaw<{ by: number; total: Num; confirmed: Num; lost: Num; quoted: Num }[]>(Prisma.sql`
      SELECT e.created_by_id AS by, COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE e.status = 'confirmed')::int AS confirmed,
             COUNT(*) FILTER (WHERE e.status = 'lost')::int AS lost,
             COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS quoted
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E} ${fo("e")}
      GROUP BY 1`),

    // A lost enquiry whose order was cancelled counts as a lost order.
    prisma.$queryRaw<{ by: number; reason: string; is_order: boolean; count: Num; value: Num }[]>(Prisma.sql`
      SELECT e.created_by_id AS by, COALESCE(e.lost_reason, '') AS reason,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             COUNT(*)::int AS count, COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS value
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E} ${fo("e")}
      GROUP BY 1, 2, 3`),

    prisma.$queryRaw<{ id: number; job_no: string | null; enquiry_id: number | null; created_at: Date; client: string; by: string; mode: string; from: string; to: string; status: string; amount: Num; profit: Num; actual_profit: Num }[]>(Prisma.sql`
      SELECT o.id, o.job_no, COALESCE(o.enquiry_id, o.origin_enquiry_id) AS enquiry_id, o.created_at, c.name AS client, u.name AS by,
             o.mode, o."from", o."to", o.status, o.amount::float8 AS amount, e.provisional_profit::float8 AS profit,
             e.actual_profit::float8 AS actual_profit
      FROM orders o
      JOIN clients c ON c.id = o.client_id
      JOIN users u ON u.id = o.created_by_id
      LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E} ${fo("o")}
      ORDER BY o.created_at, o.id LIMIT ${DETAIL_LIMIT + 1}`),

    prisma.$queryRaw<{ id: number; enquiry_date: Date; client: string; by: string; mode: string; from: string; to: string; status: string; quoted: Num; profit: Num }[]>(Prisma.sql`
      SELECT e.id, e.enquiry_date, c.name AS client, u.name AS by, e.mode, e."from", e."to", e.status,
             (e.provisional_cost + e.provisional_profit)::float8 AS quoted, e.provisional_profit::float8 AS profit
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E} ${fo("e")}
      ORDER BY e.enquiry_date, e.id LIMIT ${DETAIL_LIMIT + 1}`),

    prisma.$queryRaw<{ id: number; client: string; by: string; from: string; to: string; reason: string | null; text: string | null; is_order: boolean; lost_at: Date; value: Num }[]>(Prisma.sql`
      SELECT e.id, c.name AS client, u.name AS by, e."from", e."to", e.lost_reason AS reason, e.cancel_reason AS text,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             e.cancelled_at AS lost_at, (e.provisional_cost + e.provisional_profit)::float8 AS value
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E} ${fo("e")}
      ORDER BY e.cancelled_at, e.id LIMIT ${DETAIL_LIMIT + 1}`),

    prisma.managerSalesman.findMany({ where: { org_id: orgId }, select: { salesman_id: true }, distinct: ["salesman_id"] }),

    prisma.$queryRaw<{ id: number; enquiry_date: Date; client: string; by: string; mode: string; from: string; to: string; status: string; quoted: Num; profit: Num }[]>(Prisma.sql`
      SELECT e.id, e.enquiry_date, c.name AS client, u.name AS by, e.mode, e."from", e."to", e.status,
             (e.provisional_cost + e.provisional_profit)::float8 AS quoted, e.provisional_profit::float8 AS profit
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.status = 'confirmed' AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E} ${fo("e")}
      ORDER BY e.enquiry_date, e.id LIMIT ${DETAIL_LIMIT + 1}`),
  ]);
  if (!org) return null;

  /* Staff: the company's salesmen plus anyone who sold for it in the range; a manager sees only their team. */
  let staffIds = [...new Set([...sellers.map((x) => x.salesman_id), ...orderAgg.map((r) => r.by), ...actualAgg.map((r) => r.by), ...enquiryAgg.map((r) => r.by), ...lostAgg.map((r) => r.by)])];
  if (f.staff.length) staffIds = staffIds.filter((id) => f.staff.includes(id));
  if (viewer.role_id === 2) {
    const team = new Set([...(await getManagerSalesmanIdsForOrg(viewer.id, orgId)), ...(await getManagerSalesmanIds(viewer.id))]);
    staffIds = staffIds.filter((id) => team.has(id));
  }

  const [users, targets, achieved] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: staffIds } }, select: { id: true, name: true, role_id: true } }),
    // The target running during the range: the latest one overlapping it that wasn't replaced.
    prisma.salesmanTarget.findMany({
      where: { salesman_id: { in: staffIds }, closed_at: null, period_start: { lt: end }, period_end: { gte: from } },
      orderBy: [{ period_start: "desc" }, { id: "desc" }],
    }),
    getTargetAchievements(staffIds),
  ]);

  const today = todayUtc();
  const staff = users
    .map((u) => {
      const o = orderAgg.find((r) => r.by === u.id);
      const a = actualAgg.find((r) => r.by === u.id);
      const e = enquiryAgg.find((r) => r.by === u.id);
      const t = targets.find((x) => x.salesman_id === u.id);
      const target = t
        ? (() => {
            const amount = Number(t.amount);
            const done = achieved.get(t.id) ?? 0;
            return { amount, achieved: done, percent: amount > 0 ? (done / amount) * 100 : 0, start: t.period_start, end: t.period_end, state: targetState(t, done, amount, today) };
          })()
        : null;
      return {
        id: u.id,
        name: u.name,
        isSalesman: u.role_id === 3,
        orders: n(o?.count ?? 0),
        value: n(o?.value ?? 0),
        profit: n(o?.profit ?? 0),
        actualProfit: n(a?.profit ?? 0),
        enquiries: n(e?.total ?? 0),
        confirmed: n(e?.confirmed ?? 0),
        lost: lostAgg.filter((r) => r.by === u.id).reduce((a, r) => a + n(r.count), 0),
        target,
      };
    })
    .sort((a, b) => b.profit - a.profit || b.value - a.value || a.name.localeCompare(b.name));

  /* Company totals (everyone, not only the staff listed). */
  const sum = <T>(rows: T[], f: (r: T) => Num) => rows.reduce((a, r) => a + n(f(r)), 0);
  const lostCount = sum(lostAgg, (r) => r.count);
  const reasonKey = (r: string) => (isLostReason(r) ? r : "");
  const reasons = [...lostReasons, ""]
    .map((key) => {
      const rows = lostAgg.filter((r) => reasonKey(r.reason) === key);
      return {
        reason: key ? lostReasonLabels[key as keyof typeof lostReasonLabels] : "Not categorised",
        enquiries: sum(rows.filter((r) => !r.is_order), (r) => r.count),
        orders: sum(rows.filter((r) => r.is_order), (r) => r.count),
        count: sum(rows, (r) => r.count),
        value: sum(rows, (r) => r.value),
      };
    })
    .filter((r) => r.count > 0 || r.reason !== "Not categorised")
    .sort((a, b) => b.count - a.count);

  const enquiryTotal = sum(enquiryAgg, (r) => r.total);
  const confirmed = sum(enquiryAgg, (r) => r.confirmed);
  const cut = <T>(rows: T[]) => ({ rows: rows.slice(0, DETAIL_LIMIT), truncated: rows.length > DETAIL_LIMIT });

  return {
    org,
    from: range.from,
    to: range.to,
    generatedAt: new Date(),
    summary: {
      orders: sum(orderAgg, (r) => r.count),
      orderValue: sum(orderAgg, (r) => r.value),
      profit: sum(orderAgg, (r) => r.profit),
      actualProfit: sum(actualAgg, (r) => r.profit),
      actualCost: sum(actualAgg, (r) => r.cost),
      invoiced: sum(actualAgg, (r) => r.count),
      voidedOrders: sum(orderAgg, (r) => r.voided),
      enquiries: enquiryTotal,
      confirmed,
      quoted: sum(enquiryAgg, (r) => r.quoted),
      conversion: enquiryTotal > 0 ? (confirmed / enquiryTotal) * 100 : null,
      lost: lostCount,
      lostEnquiries: sum(lostAgg.filter((r) => !r.is_order), (r) => r.count),
      lostOrders: sum(lostAgg.filter((r) => r.is_order), (r) => r.count),
      lostValue: sum(lostAgg, (r) => r.value),
      reasons,
    },
    filters: f,
    // What the report was narrowed to, in words (shown under the title); empty for an unfiltered report.
    filterNotes: [
      f.staff.length ? `Staff: ${users.filter((u) => f.staff.includes(u.id)).map((u) => u.name).join(", ") || "none found"}` : null,
      f.mode ? `Mode: ${f.mode}` : null,
      f.fromCountry ? `From: ${f.fromCountry}` : null,
      f.toCountry ? `To: ${f.toCountry}` : null,
    ].filter((x): x is string => !!x),
    staff,
    details: {
      confirmed: cut(confirmedItems.map((r) => ({ ...r, quoted: r.quoted === null ? null : n(r.quoted), profit: r.profit === null ? null : n(r.profit) }))),
      orders: cut(
        orders.map((r) => ({ ...r, amount: n(r.amount), profit: r.profit === null ? null : n(r.profit), actual_profit: r.actual_profit === null ? null : n(r.actual_profit) })),
      ),
      enquiries: cut(enquiries.map((r) => ({ ...r, quoted: r.quoted === null ? null : n(r.quoted), profit: r.profit === null ? null : n(r.profit) }))),
      lost: cut(lostItems.map((r) => ({ ...r, value: r.value === null ? null : n(r.value) }))),
    },
  };
}

/** People the staff filter offers: the salesmen working for each company (a manager's own team only), with the companies they work for. */
export async function getReportStaff(viewer: { id: number; role_id: number }, orgIds: number[]) {
  const links = await prisma.managerSalesman.findMany({
    where: { org_id: { in: orgIds }, ...(viewer.role_id === 2 ? { manager_id: viewer.id } : {}) },
    select: { org_id: true, salesman: { select: { id: true, name: true } } },
  });
  const byId = new Map<number, { id: number; name: string; orgIds: number[] }>();
  for (const l of links) {
    const row = byId.get(l.salesman.id) ?? { id: l.salesman.id, name: l.salesman.name, orgIds: [] };
    if (!row.orgIds.includes(l.org_id)) row.orgIds.push(l.org_id);
    byId.set(l.salesman.id, row);
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}
