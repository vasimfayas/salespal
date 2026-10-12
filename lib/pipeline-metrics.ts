import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Client pipeline metrics, all from client_status_events (one row per status change, credited to the client's
 * salesman at the time) plus current client status. Shared by the salesman, manager and owner dashboards so the
 * same question always gets the same number.
 */

/** Whose clients: salesmen (by owner) and/or one company. Empty = everyone. */
export type PipelineScope = { ownerIds?: number[]; orgId?: number | null };
export type Range = { from: Date; to: Date };

/** A client is "stuck" when it has sat in an early stage this long. */
export const STUCK_AFTER_DAYS = 14;

/**
 * The previous period cut to the same length as the current one, so a month in progress is compared with the same
 * days of last month (not the whole month). `previousStart` is where the previous period begins.
 */
export function likeForLike(current: Range, previousStart: Date, previousEnd: Date): Range {
  const to = new Date(Math.min(previousStart.getTime() + (current.to.getTime() - current.from.getTime()), previousEnd.getTime()));
  return { from: previousStart, to };
}

/** "+12%" when the base is big enough to mean something, otherwise the plain difference ("+3"). */
export function changeLabel(current: number, previous: number) {
  const diff = current - previous;
  if (previous >= 5) {
    const pct = Math.round((diff / previous) * 100);
    return { diff, label: `${pct > 0 ? "+" : ""}${pct}%` };
  }
  return { diff, label: `${diff > 0 ? "+" : ""}${diff}` };
}

function eventScope(scope: PipelineScope) {
  const parts: Prisma.Sql[] = [];
  if (scope.ownerIds) parts.push(scope.ownerIds.length ? Prisma.sql`e.owner_id IN (${Prisma.join(scope.ownerIds)})` : Prisma.sql`FALSE`);
  if (scope.orgId) parts.push(Prisma.sql`e.org_id = ${scope.orgId}`);
  return parts.length ? Prisma.sql`AND ${Prisma.join(parts, " AND ")}` : Prisma.empty;
}

function clientScope(scope: PipelineScope): Prisma.ClientWhereInput {
  return {
    ...(scope.ownerIds ? { assigned_salesman_id: { in: scope.ownerIds } } : {}),
    ...(scope.orgId ? { org_id: scope.orgId } : {}),
  };
}

const toRecord = (rows: { status: string; n: number }[]) => Object.fromEntries(rows.map((r) => [r.status, Number(r.n)])) as Record<string, number>;

/** Clients by current status. */
export async function currentStatusCounts(scope: PipelineScope) {
  const rows = await prisma.client.groupBy({ by: ["status"], where: clientScope(scope), _count: { _all: true } });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Record<string, number>;
}

/** Distinct clients that moved INTO each status in the range (creation counts as moving into the first status). */
export async function statusEntries(scope: PipelineScope, range: Range) {
  return toRecord(
    await prisma.$queryRaw<{ status: string; n: number }[]>(Prisma.sql`
      SELECT e.to_status AS status, COUNT(DISTINCT e.client_id)::int AS n
      FROM client_status_events e
      WHERE e.created_at >= ${range.from} AND e.created_at < ${range.to} ${eventScope(scope)}
      GROUP BY 1`),
  );
}

/** Distinct clients that moved OUT of each status in the range. */
export async function statusExits(scope: PipelineScope, range: Range) {
  return toRecord(
    await prisma.$queryRaw<{ status: string; n: number }[]>(Prisma.sql`
      SELECT e.from_status AS status, COUNT(DISTINCT e.client_id)::int AS n
      FROM client_status_events e
      WHERE e.from_status IS NOT NULL AND e.created_at >= ${range.from} AND e.created_at < ${range.to} ${eventScope(scope)}
      GROUP BY 1`),
  );
}

/** Clients that have been in each of these statuses longer than STUCK_AFTER_DAYS. */
export async function stuckCounts(scope: PipelineScope, statuses: string[], now = new Date()) {
  const before = new Date(now.getTime() - STUCK_AFTER_DAYS * 86_400_000);
  const rows = await prisma.client.groupBy({
    by: ["status"],
    where: { ...clientScope(scope), status: { in: statuses }, status_changed_at: { lt: before } },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Record<string, number>;
}

/** Newest clients that moved into a status in the range (detail lists). */
export function recentEntries(scope: PipelineScope, status: string, range: Range, take: number) {
  return prisma.clientStatusEvent.findMany({
    where: {
      to_status: status,
      created_at: { gte: range.from, lt: range.to },
      ...(scope.ownerIds ? { owner_id: { in: scope.ownerIds } } : {}),
      ...(scope.orgId ? { org_id: scope.orgId } : {}),
    },
    orderBy: { created_at: "desc" },
    take,
    select: { id: true, created_at: true, client: { select: { id: true, name: true, assignedSalesman: { select: { name: true } } } } },
  });
}

/** Clients that moved into a status, per calendar month, from `from` on. Keys are "YYYY-MM". */
export async function monthlyEntries(scope: PipelineScope, status: string, from: Date) {
  const rows = await prisma.$queryRaw<{ month: string; n: number }[]>(Prisma.sql`
    SELECT to_char(date_trunc('month', e.created_at), 'YYYY-MM') AS month, COUNT(DISTINCT e.client_id)::int AS n
    FROM client_status_events e
    WHERE e.to_status = ${status} AND e.created_at >= ${from} ${eventScope(scope)}
    GROUP BY 1`);
  return Object.fromEntries(rows.map((r) => [r.month, Number(r.n)])) as Record<string, number>;
}

export const COHORT_DAYS = 90;

/**
 * Cohort funnel: of the clients added in the last COHORT_DAYS, how many ever reached follow-up and onboarded,
 * and the median days from being added to onboarded. Unlike "current onboarded ÷ current leads", it follows the
 * same clients through the pipeline.
 */
export async function cohortFunnel(scope: PipelineScope, now = new Date()) {
  const from = new Date(now.getTime() - COHORT_DAYS * 86_400_000);
  const [row] = await prisma.$queryRaw<{ added: number; follow_up: number; onboarded: number; median_days: number | null }[]>(Prisma.sql`
    WITH cohort AS (
      SELECT DISTINCT ON (e.client_id) e.client_id, e.created_at AS added_at
      FROM client_status_events e
      WHERE e.source = 'create' AND e.created_at >= ${from} ${eventScope(scope)}
      ORDER BY e.client_id, e.created_at
    ),
    reached AS (
      SELECT c.client_id, c.added_at,
             BOOL_OR(x.to_status IN ('follow_up', 'enquiry', 'onboarded')) AS followed_up,
             MIN(x.created_at) FILTER (WHERE x.to_status = 'onboarded') AS onboarded_at
      FROM cohort c
      JOIN client_status_events x ON x.client_id = c.client_id
      GROUP BY c.client_id, c.added_at
    )
    SELECT COUNT(*)::int AS added,
           COUNT(*) FILTER (WHERE followed_up)::int AS follow_up,
           COUNT(onboarded_at)::int AS onboarded,
           (percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (onboarded_at - added_at)) / 86400)
              FILTER (WHERE onboarded_at IS NOT NULL))::float8 AS median_days
    FROM reached`);
  const added = Number(row?.added ?? 0);
  const onboarded = Number(row?.onboarded ?? 0);
  return {
    added,
    followUp: Number(row?.follow_up ?? 0),
    onboarded,
    rate: added > 0 ? Math.round((onboarded / added) * 100) : null,
    medianDays: row?.median_days === null || row?.median_days === undefined ? null : Math.round(Number(row.median_days)),
  };
}
