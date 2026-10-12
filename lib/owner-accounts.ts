import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { receivablesCte } from "@/lib/accountant-dashboard";
import { VOID_ORDER_STATUSES } from "@/types/order";

/**
 * Owner's company-wise accounts.
 *   orders / value        non-void orders raised (created) in the period (same rule as the dashboards)
 *   cost / actual profit  actual cost and profit of non-void orders INVOICED in the period (accounts enter both with the invoice date)
 *   receivables           unpaid balance today on every non-void order, same rules as the accountant dashboard
 */
export async function getOwnerAccounts(range: { start: Date; end?: Date }) {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = range.end ?? now;
  // invoice_date is a date column: compare as plain local calendar days, not timestamps shifted by time zone.
  const day = (d: Date) => Prisma.sql`${`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`}::date`;
  const voided = Prisma.join([...VOID_ORDER_STATUSES]);
  const orgs = await prisma.organization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  if (orgs.length === 0) return [];

  const [orderRows, invoicedRows, receivableRows] = await Promise.all([
    prisma.$queryRaw<{ org_id: number; orders: number; value: number; not_invoiced: number }[]>(Prisma.sql`
      SELECT o.org_id, COUNT(*)::int AS orders, COALESCE(SUM(o.amount), 0)::float8 AS value,
             COUNT(*) FILTER (WHERE o.invoice_date IS NULL)::int AS not_invoiced
      FROM orders o
      WHERE o.status NOT IN (${voided}) AND o.created_at >= ${range.start} AND o.created_at <= ${end}
      GROUP BY 1`),
    prisma.$queryRaw<{ org_id: number; invoiced: number; cost: number; profit: number }[]>(Prisma.sql`
      SELECT o.org_id, COUNT(*)::int AS invoiced,
             COALESCE(SUM(e.actual_cost), 0)::float8 AS cost, COALESCE(SUM(e.actual_profit), 0)::float8 AS profit
      FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.status NOT IN (${voided}) AND e.actual_profit IS NOT NULL
        AND o.invoice_date >= ${day(range.start)} AND o.invoice_date <= ${day(end)}
      GROUP BY 1`),
    prisma.$queryRaw<{ org_id: number; receivable: number; past_due: number; count: number }[]>(Prisma.sql`
      ${receivablesCte(orgs.map((o) => o.id))}
      SELECT org_id, COALESCE(SUM(balance), 0)::float8 AS receivable,
             COALESCE(SUM(balance) FILTER (WHERE due < ${today}::date), 0)::float8 AS past_due, COUNT(*)::int AS count
      FROM r GROUP BY 1`),
  ]);

  const byOrg = <T extends { org_id: number }>(rows: T[]) => new Map(rows.map((r) => [Number(r.org_id), r]));
  const [ordersBy, invBy, recBy] = [byOrg(orderRows), byOrg(invoicedRows), byOrg(receivableRows)];
  return orgs.map((o) => {
    const ord = ordersBy.get(o.id);
    const inv = invBy.get(o.id);
    const rec = recBy.get(o.id);
    return {
      id: o.id,
      name: o.name,
      orders: Number(ord?.orders ?? 0),
      value: Number(ord?.value ?? 0),
      notInvoiced: Number(ord?.not_invoiced ?? 0),
      invoiced: Number(inv?.invoiced ?? 0),
      cost: Number(inv?.cost ?? 0),
      profit: Number(inv?.profit ?? 0),
      receivable: Number(rec?.receivable ?? 0),
      receivableCount: Number(rec?.count ?? 0),
      pastDue: Number(rec?.past_due ?? 0),
    };
  });
}

export type OwnerAccountsRow = Awaited<ReturnType<typeof getOwnerAccounts>>[number];

/**
 * Monthly profit for the last `months` months (this one included), optionally one company:
 *   provisional  provisional profit of non-void orders by the month they were raised (as in the company report)
 *   actual       actual profit of non-void orders by the month they were invoiced (as on the accounts page)
 */
export async function getProfitTrend(orgId: number | undefined, months = 12) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const startDay = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-01`;
  const voided = Prisma.join([...VOID_ORDER_STATUSES]);
  const org = orgId ? Prisma.sql`AND o.org_id = ${orgId}` : Prisma.empty;

  const rows = await prisma.$queryRaw<{ kind: "provisional" | "actual"; month: string; profit: number }[]>(Prisma.sql`
    SELECT 'provisional' AS kind, to_char(o.created_at, 'YYYY-MM') AS month, COALESCE(SUM(e.provisional_profit), 0)::float8 AS profit
    FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
    WHERE o.status NOT IN (${voided}) AND o.created_at >= ${startDay}::date ${org}
    GROUP BY 2
    UNION ALL
    SELECT 'actual', to_char(o.invoice_date, 'YYYY-MM'), COALESCE(SUM(e.actual_profit), 0)::float8
    FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
    WHERE o.status NOT IN (${voided}) AND e.actual_profit IS NOT NULL AND o.invoice_date >= ${startDay}::date ${org}
    GROUP BY 2`);

  return Array.from({ length: months }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const pick = (kind: string) => Number(rows.find((r) => r.kind === kind && r.month === key)?.profit ?? 0);
    return { month: d.toLocaleDateString("en", { month: "short", year: "2-digit" }), provisional: pick("provisional"), actual: pick("actual") };
  });
}
