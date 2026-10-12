import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cohortFunnel, likeForLike, statusEntries } from "@/lib/pipeline-metrics";

import { byPerformance, getPerformance, monthPeriod } from "@/lib/performance";
import { VOID_ORDER_STATUSES } from "@/types/order";
/**
 * Owner dashboard aggregates. Everything is counted in Postgres and returns a few hundred bytes,
 * so results fit the Next data cache (the old load-everything queries were over its 2 MB limit).
 * Dates are passed as ISO strings so they work as cache keys.
 */

// Also refreshed whenever clients change (those mutations revalidate "admin-clients").
const CACHE = { revalidate: 30, tags: ["admin-dashboard", "admin-clients"] };

type Counts = Record<string, number>;

function range(sinceIso: string, untilIso?: string): Prisma.DateTimeFilter {
  return untilIso ? { gte: new Date(sinceIso), lte: new Date(untilIso) } : { gte: new Date(sinceIso) };
}

async function statusCounts(where: Prisma.ClientWhereInput): Promise<Counts> {
  const rows = await prisma.client.groupBy({ by: ["status"], where, _count: { _all: true } });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all]));
}

/**
 * KPI cards: client status counts, clients onboarded / lost in the period vs the previous one (cut to the same
 * length, so a period in progress compares like for like), and the 90-day cohort conversion. From status events.
 */
export const getAdminKpiCounts = unstable_cache(
  async (orgId: number | null, start: string, end: string | null, prevStart: string, prevEnd: string) => {
    const org = orgId ? { org_id: orgId } : {};
    const scope = { orgId };
    const current = { from: new Date(start), to: end ? new Date(new Date(end).getTime() + 1) : new Date() };
    const previous = likeForLike(current, new Date(prevStart), new Date(new Date(prevEnd).getTime() + 1));
    const [counts, entered, enteredBefore, funnel] = await Promise.all([
      statusCounts(org),
      statusEntries(scope, current),
      statusEntries(scope, previous),
      cohortFunnel(scope),
    ]);
    return {
      counts,
      onboardedThis: entered.onboarded ?? 0,
      onboardedPrev: enteredBefore.onboarded ?? 0,
      lostThis: entered.lost ?? 0,
      lostPrev: enteredBefore.lost ?? 0,
      funnel,
    };
  },
  ["admin-kpi-counts"],
  CACHE
);

/** Company scorecards: per-company status counts, the company's (first) manager and that manager's team KPI. */
export const getAdminCompanyScorecards = unstable_cache(
  async () => {
    const [byOrg, orgs, managers] = await Promise.all([
      prisma.client.groupBy({ by: ["org_id", "status"], _count: { _all: true } }),
      prisma.organization.findMany({ select: { id: true, name: true } }),
      prisma.user.findMany({
        where: { role_id: 2 },
        select: { name: true, managerOrgs: { select: { org_id: true } }, managerSalesmen: { select: { salesman_id: true, org_id: true } } },
        orderBy: { id: "asc" },
      }),
    ]);

    const orgCounts = new Map<number, Counts>();
    for (const r of byOrg) {
      const c = orgCounts.get(r.org_id) ?? {};
      c[r.status] = r._count._all;
      orgCounts.set(r.org_id, c);
    }

    // Companies that have clients, lowest id first (as before).
    const orgIds = [...orgCounts.keys()].sort((x, y) => x - y);
    // Order value this month per company: every non-void order under that company, whoever raised it.
    const { from, to } = monthPeriod(0);
    const valueRows = await prisma.order.groupBy({
      by: ["org_id"],
      where: { status: { notIn: [...VOID_ORDER_STATUSES] }, created_at: { gte: from, lt: to }, org_id: { in: orgIds } },
      _sum: { amount: true },
    });
    const valueByOrg = new Map(valueRows.map((r) => [r.org_id, r._sum.amount?.toNumber() ?? 0]));
    const teamValues = orgIds.map((oid) => valueByOrg.get(oid) ?? 0);
    return orgIds.map((oid, i) => {
      const counts = orgCounts.get(oid)!;
      const mgr = managers.find((m) => m.managerOrgs.some((mo) => mo.org_id === oid));
      return {
        oid,
        orgName: orgs.find((o) => o.id === oid)?.name ?? `Org ${oid}`,
        counts,
        managerName: mgr?.name ?? "Unassigned",
        teamValue: teamValues[i],
        total: Object.values(counts).reduce((x, y) => x + y, 0),
      };
    });
  },
  ["admin-company-scorecards"],
  CACHE
);

/** Leaderboard: every salesman's orders, order value and new clients this month (optionally one company), by value. */
export const getAdminLeaderboard = unstable_cache(
  async (orgId: number | null) => {
    const salesmen = await prisma.user.findMany({
      where: { role_id: 3 },
      select: {
        id: true,
        name: true,
        salesmanManager: { select: { managerOrg: { select: { org: { select: { name: true } } } } } },
      },
    });
    const perf = await getPerformance(salesmen.map((s) => s.id), monthPeriod(0), { orgId });
    return salesmen
      .map((s) => ({
        id: s.id,
        name: s.name,
        perf: perf.get(s.id)!,
        company: [...new Set(s.salesmanManager.map((l) => l.managerOrg.org.name))].join(", ") || "—",
      }))
      .sort(byPerformance);
  },
  ["admin-leaderboard"],
  CACHE
);

/** Task health: task counts by status (all tasks) + client funnel counts (optionally one company). */
export const getAdminTaskHealth = unstable_cache(
  async (orgId: number | null) => {
    const [tasks, clients] = await Promise.all([
      prisma.task.groupBy({ by: ["status"], _count: { _all: true } }),
      statusCounts(orgId ? { org_id: orgId } : {}),
    ]);
    const taskCounts: Counts = Object.fromEntries(tasks.map((t) => [t.status, t._count._all]));
    return { taskCounts, taskTotal: tasks.reduce((sum, t) => sum + t._count._all, 0), clientCounts: clients };
  },
  ["admin-task-health"],
  CACHE
);

const LOST_LIST_LIMIT = 100;

/** Clients lost in the period (status events): total + the newest rows for the table, with the client's salesman. */
export const getAdminLostClients = unstable_cache(
  async (orgId: number | null, start: string, end: string | null) => {
    const where: Prisma.ClientStatusEventWhereInput = {
      to_status: "lost",
      created_at: range(start, end ?? undefined),
      ...(orgId ? { org_id: orgId } : {}),
    };
    const [total, events] = await Promise.all([
      prisma.clientStatusEvent.count({ where }),
      prisma.clientStatusEvent.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: LOST_LIST_LIMIT,
        select: {
          id: true,
          created_at: true,
          client: { select: { name: true, organization: { select: { name: true } }, assignedSalesman: { select: { name: true } } } },
        },
      }),
    ]);
    const rows = events.map((e) => ({ id: e.id, created_at: e.created_at, client: e.client, author: e.client.assignedSalesman }));
    return { total, rows };
  },
  ["admin-lost-clients"],
  CACHE
);

/** Clients onboarded per month (in `timeZone`) and company since `sinceIso`, from status events. */
export const getAdminOnboardingTrend = unstable_cache(
  async (sinceIso: string, timeZone: string) => {
    const rows = await prisma.$queryRaw<{ y: number; m: number; org_id: number; n: number }[]>(Prisma.sql`
      SELECT EXTRACT(YEAR FROM local_ts)::int AS y, EXTRACT(MONTH FROM local_ts)::int AS m, x.org_id, COUNT(DISTINCT x.client_id)::int AS n
      FROM (
        SELECT e.client_id, e.org_id, (e.created_at AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone} AS local_ts
        FROM client_status_events e
        WHERE e.to_status = 'onboarded' AND e.created_at >= ${new Date(sinceIso)}
      ) x
      GROUP BY 1, 2, 3`);
    return rows.map((r) => ({ year: Number(r.y), month: Number(r.m), orgId: r.org_id, count: Number(r.n) }));
  },
  ["admin-onboarding-trend"],
  { revalidate: 300, tags: ["admin-dashboard", "admin-clients"] }
);
