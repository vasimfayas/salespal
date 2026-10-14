import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { VOID_ORDER_STATUSES } from "@/types/order";

/**
 * Salesman performance — what a salesman brings in during a period:
 *   orders      orders they created (cancelled / sent-back-for-revision excluded)
 *   value       total amount of those orders
 *   profit      their provisional profit (actual profit is accounted separately, by invoice date)
 *   newClients  their clients whose FIRST (non-void) order falls in the period
 * Leaderboards rank by value, then orders. Tasks are tracked separately as work activity.
 */
export type Performance = { orders: number; value: number; newClients: number; profit: number };

export const EMPTY_PERFORMANCE: Performance = { orders: 0, value: 0, newClients: 0, profit: 0 };

export type Period = { from: Date; to: Date };

/** Calendar month containing `date`, offset by `offset` months (0 = this month, -1 = last month). */
export function monthPeriod(offset = 0, date = new Date()): Period {
  return {
    from: new Date(date.getFullYear(), date.getMonth() + offset, 1),
    to: new Date(date.getFullYear(), date.getMonth() + offset + 1, 1),
  };
}

/**
 * Performance per salesman for [from, to). Salesmen with nothing in the period get zeros.
 * With `orgId`, only that company's orders count.
 */
export async function getPerformance(salesmanIds: number[], { from, to }: Period, { orgId }: { orgId?: number | null } = {}): Promise<Map<number, Performance>> {
  const result = new Map<number, Performance>(salesmanIds.map((id) => [id, { ...EMPTY_PERFORMANCE }]));
  if (salesmanIds.length === 0) return result;
  const ids = Prisma.join(salesmanIds);
  const voided = Prisma.join([...VOID_ORDER_STATUSES]);
  const inOrg = orgId ? Prisma.sql`AND o.org_id = ${orgId}` : Prisma.empty;

  const rows = await prisma.$queryRaw<{ id: number; orders: number; value: number; profit: number; new_clients: number }[]>(Prisma.sql`
    WITH placed AS (
      SELECT o.created_by_id AS id, COUNT(*)::int AS orders, COALESCE(SUM(o.amount), 0)::float8 AS value,
             COALESCE(SUM(e.provisional_profit), 0)::float8 AS profit
      FROM orders o JOIN clients c ON c.id = o.client_id LEFT JOIN enquiries e ON e.id = o.enquiry_id
      WHERE o.created_by_id IN (${ids}) AND o.status NOT IN (${voided}) AND o.created_at >= ${from} AND o.created_at < ${to} ${inOrg}
      GROUP BY o.created_by_id
    ),
    firsts AS (
      SELECT c.assigned_salesman_id AS id, c.id AS client_id, MIN(o.created_at) AS first_order
      FROM clients c JOIN orders o ON o.client_id = c.id
      WHERE c.assigned_salesman_id IN (${ids}) AND o.status NOT IN (${voided}) ${inOrg}
      GROUP BY c.assigned_salesman_id, c.id
    ),
    fresh AS (
      SELECT id, COUNT(*)::int AS new_clients FROM firsts WHERE first_order >= ${from} AND first_order < ${to} GROUP BY id
    )
    SELECT s.id, COALESCE(p.orders, 0) AS orders, COALESCE(p.value, 0) AS value, COALESCE(p.profit, 0) AS profit, COALESCE(f.new_clients, 0) AS new_clients
    FROM unnest(ARRAY[${ids}]::int[]) AS s(id)
    LEFT JOIN placed p ON p.id = s.id
    LEFT JOIN fresh f ON f.id = s.id`);

  for (const r of rows) result.set(r.id, { orders: Number(r.orders), value: Number(r.value), profit: Number(r.profit), newClients: Number(r.new_clients) });
  return result;
}

/** Totals across salesmen (team / company). */
export function sumPerformance(items: Iterable<Performance>): Performance {
  const total = { ...EMPTY_PERFORMANCE };
  for (const p of items) {
    total.orders += p.orders;
    total.value += p.value;
    total.profit += p.profit;
    total.newClients += p.newClients;
  }
  return total;
}

/** Leaderboard order: value, then orders, then new clients. */
export function byPerformance<T extends { perf: Performance }>(a: T, b: T) {
  return b.perf.value - a.perf.value || b.perf.orders - a.perf.orders || b.perf.newClients - a.perf.newClients;
}

/** invoice_date is a date column: compare as plain local calendar days. */
const day = (d: Date) => Prisma.sql`${`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`}::date`;

/**
 * Actual profit accounts entered on the salesman's orders invoiced in each range (by invoice date, as on the
 * owner's Accounts page and the reports), leaving out cancelled and sent-back orders.
 */
export async function actualProfit(userId: number, current: { from: Date; to: Date }, previous: { from: Date; to: Date }) {
  const [row] = await prisma.$queryRaw<{ current: number; previous: number }[]>(Prisma.sql`
    SELECT COALESCE(SUM(e.actual_profit) FILTER (WHERE o.invoice_date >= ${day(current.from)}), 0)::float8 AS current,
           COALESCE(SUM(e.actual_profit) FILTER (WHERE o.invoice_date <= ${day(previous.to)}), 0)::float8 AS previous
    FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
    WHERE o.created_by_id = ${userId} AND o.status NOT IN ('cancelled', 'revision_requested') AND e.actual_profit IS NOT NULL
      AND o.invoice_date >= ${day(previous.from)} AND o.invoice_date <= ${day(current.to)}
      AND (o.invoice_date >= ${day(current.from)} OR o.invoice_date <= ${day(previous.to)})`);
  return row ?? { current: 0, previous: 0 };
}
