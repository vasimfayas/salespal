import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagerSalesmanIds, getManagerSalesmanIdsForOrg } from "@/lib/scoping";
import { getTargetAchievements, parseDateOnly, targetState, todayUtc } from "@/lib/salesman-targets";
import { isLostReason, lostReasonLabels, lostReasons } from "@/types/enquiry";
import { VOID_ORDER_STATUSES } from "@/types/order";

/**
 * Company report for a date range (read-only; feeds the PDF). All dates are inclusive calendar days (UTC).
 *   orders              orders under the company created in the range; value / profit exclude cancelled and sent-back orders
 *   provisional profit  the provisional profit of the enquiry each counted order came from (orders without an enquiry add 0)
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

export type CompanyReport = NonNullable<Awaited<ReturnType<typeof getCompanyReport>>>;

export async function getCompanyReport(orgId: number, range: NonNullable<ReturnType<typeof parseRange>>, viewer: { id: number; role_id: number }) {
  const { from, end } = range;
  // Compare as plain dates: date columns vs. JS Date params would be shifted by the DB session time zone.
  const day = (d: Date) => Prisma.sql`${d.toISOString().slice(0, 10)}::date`;
  const [S, E] = [day(from), day(end)];
  const voided = Prisma.join([...VOID_ORDER_STATUSES]);

  const [org, orderAgg, enquiryAgg, lostAgg, orders, enquiries, lostItems, sellers] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { name: true, prefix: true, logo_path: true, address: true, phone: true, email: true } }),

    prisma.$queryRaw<{ by: number; count: Num; value: Num; profit: Num; voided: Num }[]>(Prisma.sql`
      SELECT o.created_by_id AS by,
             COUNT(*) FILTER (WHERE o.status NOT IN (${voided}))::int AS count,
             COALESCE(SUM(o.amount) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS value,
             COALESCE(SUM(e.provisional_profit) FILTER (WHERE o.status NOT IN (${voided})), 0)::float8 AS profit,
             COUNT(*) FILTER (WHERE o.status IN (${voided}))::int AS voided
      FROM orders o LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E}
      GROUP BY 1`),

    prisma.$queryRaw<{ by: number; total: Num; confirmed: Num; lost: Num; quoted: Num }[]>(Prisma.sql`
      SELECT e.created_by_id AS by, COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE e.status = 'confirmed')::int AS confirmed,
             COUNT(*) FILTER (WHERE e.status = 'lost')::int AS lost,
             COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS quoted
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E}
      GROUP BY 1`),

    // A lost enquiry whose order was cancelled counts as a lost order.
    prisma.$queryRaw<{ by: number; reason: string; is_order: boolean; count: Num; value: Num }[]>(Prisma.sql`
      SELECT e.created_by_id AS by, COALESCE(e.lost_reason, '') AS reason,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             COUNT(*)::int AS count, COALESCE(SUM(e.provisional_cost + e.provisional_profit), 0)::float8 AS value
      FROM enquiries e
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E}
      GROUP BY 1, 2, 3`),

    prisma.$queryRaw<{ id: number; job_no: string | null; enquiry_id: number | null; created_at: Date; client: string; by: string; mode: string; from: string; to: string; status: string; amount: Num; profit: Num }[]>(Prisma.sql`
      SELECT o.id, o.job_no, COALESCE(o.enquiry_id, o.origin_enquiry_id) AS enquiry_id, o.created_at, c.name AS client, u.name AS by,
             o.mode, o."from", o."to", o.status, o.amount::float8 AS amount, e.provisional_profit::float8 AS profit
      FROM orders o
      JOIN clients c ON c.id = o.client_id
      JOIN users u ON u.id = o.created_by_id
      LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.org_id = ${orgId} AND o.created_at >= ${S} AND o.created_at < ${E}
      ORDER BY o.created_at, o.id LIMIT ${DETAIL_LIMIT + 1}`),

    prisma.$queryRaw<{ id: number; enquiry_date: Date; client: string; by: string; mode: string; from: string; to: string; status: string; quoted: Num; profit: Num }[]>(Prisma.sql`
      SELECT e.id, e.enquiry_date, c.name AS client, u.name AS by, e.mode, e."from", e."to", e.status,
             (e.provisional_cost + e.provisional_profit)::float8 AS quoted, e.provisional_profit::float8 AS profit
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.enquiry_date >= ${S} AND e.enquiry_date < ${E}
      ORDER BY e.enquiry_date, e.id LIMIT ${DETAIL_LIMIT + 1}`),

    prisma.$queryRaw<{ id: number; client: string; by: string; from: string; to: string; reason: string | null; text: string | null; is_order: boolean; lost_at: Date; value: Num }[]>(Prisma.sql`
      SELECT e.id, c.name AS client, u.name AS by, e."from", e."to", e.lost_reason AS reason, e.cancel_reason AS text,
             EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'cancelled') AS is_order,
             e.cancelled_at AS lost_at, (e.provisional_cost + e.provisional_profit)::float8 AS value
      FROM enquiries e
      JOIN clients c ON c.id = e.client_id
      JOIN users u ON u.id = e.created_by_id
      WHERE e.org_id = ${orgId} AND e.status = 'lost' AND e.cancelled_at >= ${S} AND e.cancelled_at < ${E}
      ORDER BY e.cancelled_at, e.id LIMIT ${DETAIL_LIMIT + 1}`),

    prisma.managerSalesman.findMany({ where: { org_id: orgId }, select: { salesman_id: true }, distinct: ["salesman_id"] }),
  ]);
  if (!org) return null;

  /* Staff: the company's salesmen plus anyone who sold for it in the range; a manager sees only their team. */
  let staffIds = [...new Set([...sellers.map((x) => x.salesman_id), ...orderAgg.map((r) => r.by), ...enquiryAgg.map((r) => r.by), ...lostAgg.map((r) => r.by)])];
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
    staff,
    details: {
      orders: cut(orders.map((r) => ({ ...r, amount: n(r.amount), profit: r.profit === null ? null : n(r.profit) }))),
      enquiries: cut(enquiries.map((r) => ({ ...r, quoted: r.quoted === null ? null : n(r.quoted), profit: r.profit === null ? null : n(r.profit) }))),
      lost: cut(lostItems.map((r) => ({ ...r, value: r.value === null ? null : n(r.value) }))),
    },
  };
}
