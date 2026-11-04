import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { DrilldownPager } from "@/components/dashboard/DrilldownPager";
import { DashboardPending, DashboardTransitionProvider } from "@/components/dashboard/DashboardTransition";
import { PIPELINE_STAGE_COLORS } from "@/components/dashboard/CompanyComparisonCard";
import { parsePaging } from "@/lib/admin-drilldown";
import { prisma } from "@/lib/prisma";
import { clientStatuses, clientStatusLabel } from "@/types/client";
import { cn, formatDateTime } from "@/lib/utils";

const SOURCE_LABELS: Record<string, string> = {
  manual: "Changed by hand",
  lead_outcome: "Lead outcome",
  enquiry: "Enquiry raised",
  order: "Order",
  dormant_sweep: "Automatic (dormant)",
  create: "Client added",
};

const th = "px-4 py-2.5 font-semibold";
const td = "px-4 py-3";

/** One company from the owner dashboard: its clients by status right now, and every client status change, newest first. */
export default async function CompanyOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; size?: string }>;
}) {
  const orgId = Number((await params).id);
  if (!Number.isInteger(orgId)) notFound();
  const sp = await searchParams;
  const { page, pageSize, paging } = parsePaging(sp.page, sp.size);

  const [org, byStatus, total, events] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { id: true, name: true } }),
    prisma.client.groupBy({ by: ["status"], where: { org_id: orgId }, _count: { _all: true } }),
    prisma.clientStatusEvent.count({ where: { org_id: orgId } }),
    prisma.clientStatusEvent.findMany({
      where: { org_id: orgId },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      select: { id: true, from_status: true, to_status: true, source: true, created_at: true, owner_id: true, actor_id: true, client: { select: { id: true, name: true } } },
      ...paging,
    }),
  ]);
  if (!org) notFound();
  if (page > 1 && events.length === 0) redirect(`/dashboard/admin/overview/company/${orgId}?size=${pageSize}`);

  const userIds = [...new Set(events.flatMap((e) => [e.owner_id, e.actor_id]).filter((x): x is number => x != null))];
  const users = new Map((await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })).map((u) => [u.id, u.name]));

  const counts = new Map(byStatus.map((g) => [g.status, g._count._all]));
  const totalClients = byStatus.reduce((n, g) => n + g._count._all, 0);
  // Known statuses in pipeline order, then anything else on file.
  const statuses = [...clientStatuses.filter((s) => counts.has(s)), ...[...counts.keys()].filter((s) => !(clientStatuses as readonly string[]).includes(s))];

  return (
    <>
      <Link href="/dashboard/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft size={14} aria-hidden /> Back to overview
      </Link>
      <PageHeader title={org.name} subtitle={`${totalClients.toLocaleString()} clients right now · ${total.toLocaleString()} status changes on record`} />

      <Card className="mb-4 p-5">
        <p className="mb-3 text-sm font-medium text-foreground">Clients by status</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-control border border-border bg-subtle px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{totalClients.toLocaleString()}</p>
          </div>
          {statuses.map((s) => (
            <div key={s} className="rounded-control border border-border bg-subtle px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("size-2 rounded-full", PIPELINE_STAGE_COLORS[s] ?? "bg-muted-foreground")} aria-hidden />
                {clientStatusLabel(s)}
              </p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{(counts.get(s) ?? 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>

      <DashboardTransitionProvider>
        <DashboardPending>
          <Card className="overflow-hidden p-0">
            <p className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">Client history</p>
            {events.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No status changes yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-[13px] text-muted-foreground">
                    <tr>
                      <th className={th}>Date</th>
                      <th className={th}>Client</th>
                      <th className={th}>Change</th>
                      <th className={th}>Salesman</th>
                      <th className={th}>By</th>
                      <th className={th}>How</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {events.map((e) => (
                      <tr key={e.id} className="hover:bg-subtle/50">
                        <td className={`${td} whitespace-nowrap text-xs text-muted-foreground`}>{formatDateTime(e.created_at)}</td>
                        <td className={`${td} font-medium`}>
                          <Link href={`/dashboard/admin/clients/${e.client.id}`} className="transition hover:text-primary">{e.client.name}</Link>
                        </td>
                        <td className={`${td} whitespace-nowrap`}>
                          {e.from_status ? <span className="text-muted-foreground">{clientStatusLabel(e.from_status)}</span> : <span className="text-muted-foreground">New</span>}
                          <ArrowRight size={12} className="mx-1 inline text-muted-foreground" aria-label="to" />
                          <span className="font-medium text-foreground">{clientStatusLabel(e.to_status)}</span>
                        </td>
                        <td className={`${td} text-foreground/70`}>{users.get(e.owner_id) ?? "—"}</td>
                        <td className={`${td} text-foreground/70`}>{e.actor_id ? users.get(e.actor_id) ?? "—" : "Automatic"}</td>
                        <td className={`${td} text-xs text-muted-foreground`}>{SOURCE_LABELS[e.source] ?? e.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          <DrilldownPager page={page} pageSize={pageSize} total={total} />
        </DashboardPending>
      </DashboardTransitionProvider>
    </>
  );
}
