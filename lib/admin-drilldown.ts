import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPeriodRange, getPreviousPeriodRange, type PeriodKey } from "@/lib/dashboard-period";
import { likeForLike } from "@/lib/pipeline-metrics";
import { enquiryRef, isLostReason, lostReasonLabels } from "@/types/enquiry";

/**
 * The records behind the owner dashboard's tiles. Each query uses the same window and the same "distinct client" rule
 * as the tile's number (lib/admin-dashboard.ts, lib/pipeline-metrics.ts), so the list always adds up to the figure.
 */

export const PAGE_SIZES = [20, 50] as const;
export type Paging = { skip: number; take: number };

export function parsePaging(page?: string, size?: string) {
  const pageSize = Number(size) === 50 ? 50 : 20;
  const n = Math.max(1, Math.floor(Number(page)) || 1);
  return { page: n, pageSize, paging: { skip: (n - 1) * pageSize, take: pageSize } };
}

/** The current period as the tiles count it: from its start to its end (or now). */
export function drillWindow(period: PeriodKey) {
  const { start, end } = getPeriodRange(period);
  return { from: start, to: end ? new Date(end.getTime() + 1) : new Date(), end };
}

/** Same-length previous window (a period in progress compares like for like). */
export function drillPreviousWindow(period: PeriodKey) {
  const cur = drillWindow(period);
  const prev = getPreviousPeriodRange(period);
  return likeForLike({ from: cur.from, to: cur.to }, prev.start, new Date(prev.end.getTime() + 1));
}

export type DrillClient = { id: number; name: string; company: string; salesman: string | null; at: Date; note: string | null };

const orgFilter = (orgId: number | null, col: string) => (orgId ? Prisma.sql`AND ${Prisma.raw(col)} = ${orgId}` : Prisma.empty);

/** Clients that moved into `status` in the window, once each (their latest move), newest first. Lost clients carry the reason from their history. */
export async function clientsEntering(status: "onboarded" | "lost", orgId: number | null, window: { from: Date; to: Date }, paging: Paging) {
  const rows = await prisma.$queryRaw<{ id: number; name: string; company: string; salesman: string | null; at: Date; from_status: string | null; action: string | null; total: number }[]>(Prisma.sql`
    SELECT x.*, COUNT(*) OVER()::int AS total FROM (
      SELECT DISTINCT ON (e.client_id) e.client_id AS id, c.name, o.name AS company, u.name AS salesman, e.created_at AS at, e.from_status,
             (SELECT l.action FROM client_logs l WHERE l.client_id = e.client_id AND l.action LIKE 'Status changed to lost%' AND l.created_at <= e.created_at + interval '1 minute' ORDER BY l.created_at DESC LIMIT 1) AS action
      FROM client_status_events e
      JOIN clients c ON c.id = e.client_id
      JOIN organizations o ON o.id = e.org_id
      LEFT JOIN users u ON u.id = e.owner_id
      WHERE e.to_status = ${status} AND e.created_at >= ${window.from} AND e.created_at < ${window.to} ${orgFilter(orgId, "e.org_id")}
      ORDER BY e.client_id, e.created_at DESC
    ) x ORDER BY x.at DESC, x.id OFFSET ${paging.skip} LIMIT ${paging.take}`);
  const rowsOut: DrillClient[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    company: r.company,
    salesman: r.salesman,
    at: r.at,
    note: status === "lost" ? (r.action?.match(/\((.*)\)\s*$/)?.[1] ?? null) : r.from_status ? `From ${r.from_status.replace("_", " ")}` : "Added as onboarded",
  }));
  return { total: rows[0]?.total ?? 0, rows: rowsOut };
}

/** Clients in the active pipeline now (lead or follow-up), longest waiting first. */
export async function pipelineClients(orgId: number | null, paging: Paging) {
  const rows = await prisma.$queryRaw<{ id: number; name: string; company: string; salesman: string | null; status: string; since: Date; total: number }[]>(Prisma.sql`
    SELECT c.id, c.name, o.name AS company, u.name AS salesman, c.status, c.status_changed_at AS since, COUNT(*) OVER()::int AS total
    FROM clients c
    JOIN organizations o ON o.id = c.org_id
    LEFT JOIN users u ON u.id = c.assigned_salesman_id
    WHERE c.status IN ('lead', 'follow_up') ${orgFilter(orgId, "c.org_id")}
    ORDER BY c.status_changed_at ASC, c.id OFFSET ${paging.skip} LIMIT ${paging.take}`);
  return { total: rows[0]?.total ?? 0, rows };
}

/** The filter behind both the tile's count and its list, so they cannot drift apart. */
const lostEnquiryWhere = (orgId: number | null, window: { from: Date; to: Date }): Prisma.EnquiryWhereInput => ({
  status: "lost",
  cancelled_at: { gte: window.from, lt: window.to },
  ...(orgId ? { org_id: orgId } : {}),
});

/** Enquiries lost in the window (lost date inside it), newest first. */
export async function lostEnquiries(orgId: number | null, window: { from: Date; to: Date }, paging: Paging) {
  const where = lostEnquiryWhere(orgId, window);
  const [total, rows] = await Promise.all([
    prisma.enquiry.count({ where }),
    prisma.enquiry.findMany({
      where,
      orderBy: [{ cancelled_at: "desc" }, { id: "asc" }],
      ...paging,
      select: {
        id: true, from: true, to: true, lost_reason: true, cancel_reason: true, cancelled_at: true, provisional_cost: true, provisional_profit: true,
        organization: { select: { name: true, prefix: true } },
        client: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    }),
  ]);
  return {
    total,
    rows: rows.map((r) => ({
      id: r.id,
      ref: enquiryRef(r.id, r.organization.prefix),
      client: r.client.name,
      company: r.organization.name,
      salesman: r.createdBy.name,
      from: r.from,
      to: r.to,
      reason: isLostReason(r.lost_reason) ? lostReasonLabels[r.lost_reason] : "Not categorised",
      text: r.cancel_reason,
      at: r.cancelled_at!,
      value: Number(r.provisional_cost ?? 0) + Number(r.provisional_profit ?? 0),
    })),
  };
}

/** How many enquiries were lost in the window (the tile's figure). */
export function countLostEnquiries(orgId: number | null, window: { from: Date; to: Date }) {
  return prisma.enquiry.count({ where: lostEnquiryWhere(orgId, window) });
}
