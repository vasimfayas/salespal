import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { VOID_ORDER_STATUSES } from "@/types/order";

/**
 * Salesman performance — what a salesman brings in during a period:
 *   orders      orders they created (cancelled / sent-back-for-revision excluded)
 *   value       total amount of those orders
 *   newClients  their clients whose FIRST (non-void) order falls in the period
 * Leaderboards rank by value, then orders. Tasks are tracked separately as work activity.
 */
export type Performance = { orders: number; value: number; newClients: number };

export const EMPTY_PERFORMANCE: Performance = { orders: 0, value: 0, newClients: 0 };

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
 * With `orgId`, only orders from that company's clients count.
 */
export async function getPerformance(salesmanIds: number[], { from, to }: Period, { orgId }: { orgId?: number | null } = {}): Promise<Map<number, Performance>> {
  const result = new Map<number, Performance>(salesmanIds.map((id) => [id, { ...EMPTY_PERFORMANCE }]));
  if (salesmanIds.length === 0) return result;
  const ids = Prisma.join(salesmanIds);
  const voided = Prisma.join([...VOID_ORDER_STATUSES]);
  const inOrg = orgId ? Prisma.sql`AND c.org_id = ${orgId}` : Prisma.empty;

  const rows = await prisma.$queryRaw<{ id: number; orders: number; value: number; new_clients: number }[]>(Prisma.sql`
    WITH placed AS (
      SELECT o.created_by_id AS id, COUNT(*)::int AS orders, COALESCE(SUM(o.amount), 0)::float8 AS value
      FROM orders o JOIN clients c ON c.id = o.client_id
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
    SELECT s.id, COALESCE(p.orders, 0) AS orders, COALESCE(p.value, 0) AS value, COALESCE(f.new_clients, 0) AS new_clients
    FROM unnest(ARRAY[${ids}]::int[]) AS s(id)
    LEFT JOIN placed p ON p.id = s.id
    LEFT JOIN fresh f ON f.id = s.id`);

  for (const r of rows) result.set(r.id, { orders: Number(r.orders), value: Number(r.value), newClients: Number(r.new_clients) });
  return result;
}

/** Totals across salesmen (team / company). */
export function sumPerformance(items: Iterable<Performance>): Performance {
  const total = { ...EMPTY_PERFORMANCE };
  for (const p of items) {
    total.orders += p.orders;
    total.value += p.value;
    total.newClients += p.newClients;
  }
  return total;
}

/** Leaderboard order: value, then orders, then new clients. */
export function byPerformance<T extends { perf: Performance }>(a: T, b: T) {
  return b.perf.value - a.perf.value || b.perf.orders - a.perf.orders || b.perf.newClients - a.perf.newClients;
}
