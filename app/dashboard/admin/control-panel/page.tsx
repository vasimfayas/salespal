import { redirect } from "next/navigation";
import { AlertTriangle, FileUp, Rocket } from "lucide-react";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SUPER_ADMIN_ROLE } from "@/lib/roles";
import { pageParam, param, type SearchParams } from "@/lib/list-params";
import { cn, formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeploymentNote, ErrorActions, ErrorStatusFilter, PanelPager, PanelTabs, ResolveAllButton, ReverseImportButton, type PanelTab } from "@/components/control-panel/PanelControls";

const PAGE_SIZE = 20;

/** Super admin only: bulk imports (with reverse), the deployment log and the error log. */
export default async function ControlPanelPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getSalesPalSession();
  if (session?.user.role_id !== SUPER_ADMIN_ROLE) redirect("/dashboard/admin");

  const params = await searchParams;
  const tab: PanelTab = (["imports", "deployments", "errors"] as const).find((t) => t === param(params, "tab")) ?? "imports";
  const page = pageParam(params);
  const openErrors = await prisma.errorLog.count({ where: { status: "open" } });

  return (
    <>
      <PageHeader title="Control Panel" subtitle="Bulk imports, deployments and errors across the whole system." />
      <div className="space-y-4">
        <PanelTabs tab={tab} counts={{ errors: openErrors }} />
        {tab === "imports" && <ImportsTab page={page} />}
        {tab === "deployments" && <DeploymentsTab page={page} />}
        {tab === "errors" && <ErrorsTab page={page} status={param(params, "status") === "resolved" ? "resolved" : param(params, "status") === "all" ? "all" : "open"} openCount={openErrors} />}
      </div>
    </>
  );
}

const th = "px-4 py-3 text-left text-[13px] font-medium text-muted-foreground";
const td = "px-4 py-3 align-top";
const tableWrap = "overflow-x-auto rounded-card border border-border bg-card shadow-card";

const BATCH_STATUS: Record<string, { label: string; className: string }> = {
  importing: { label: "Importing", className: "bg-info-soft text-info-foreground ring-info/25" },
  completed: { label: "Completed", className: "bg-success-soft text-success-foreground ring-success/25" },
  reversed: { label: "Reversed", className: "bg-muted text-muted-foreground ring-border-strong" },
  partially_reversed: { label: "Partly reversed", className: "bg-warning-soft text-warning-foreground ring-warning/25" },
};

async function ImportsTab({ page }: { page: number }) {
  const [batches, total] = await Promise.all([
    prisma.importBatch.findMany({ orderBy: { id: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { _count: { select: { clients: true } } } }),
    prisma.importBatch.count(),
  ]);
  if (total === 0) return <EmptyState icon={FileUp} title="No imports yet" message="Every bulk client import is logged here, with who ran it, how many rows went in, and a way to reverse it." />;
  return (
    <>
      <div className={tableWrap}>
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className={th}>When</th>
              <th className={th}>Imported by</th>
              <th className={th}>File</th>
              <th className={th}>Company</th>
              <th className={cn(th, "text-right")}>Rows</th>
              <th className={cn(th, "text-right")}>Imported</th>
              <th className={cn(th, "text-right")}>Failed</th>
              <th className={th}>Status</th>
              <th className={th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {batches.map((b) => {
              const status = BATCH_STATUS[b.status] ?? BATCH_STATUS.completed;
              const canReverse = b.status === "completed" || b.status === "partially_reversed";
              return (
                <tr key={b.id} className="hover:bg-subtle">
                  <td className={cn(td, "whitespace-nowrap")}>{formatDateTime(b.created_at)}</td>
                  <td className={td}>{b.created_by_name}</td>
                  <td className={cn(td, "max-w-56 truncate")} title={b.file_name ?? undefined}>{b.file_name ?? "—"}</td>
                  <td className={td}>{b.org_name ?? "—"}</td>
                  <td className={cn(td, "text-right tabular-nums")}>{b.total_rows}</td>
                  <td className={cn(td, "text-right tabular-nums")}>
                    {b._count.clients}
                    {b.reversed_count > 0 && <span className="block text-xs text-muted-foreground">{b.reversed_count} removed</span>}
                  </td>
                  <td className={cn(td, "text-right tabular-nums")}>{b.failed_rows}</td>
                  <td className={td}>
                    <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", status.className)}>{status.label}</span>
                    {b.reversed_at && <span className="mt-1 block text-xs text-muted-foreground">{b.reversed_by} · {formatDateTime(b.reversed_at)}</span>}
                  </td>
                  <td className={cn(td, "text-right")}>
                    {canReverse && <ReverseImportButton id={b.id} imported={b._count.clients} label={`${b.file_name ?? "Import"} · ${formatDateTime(b.created_at)} · ${b.created_by_name}`} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PanelPager page={page} pageSize={PAGE_SIZE} total={total} noun="imports" />
    </>
  );
}

async function DeploymentsTab({ page }: { page: number }) {
  const [rows, total] = await Promise.all([
    prisma.deployment.findMany({ orderBy: { id: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.deployment.count(),
  ]);
  if (total === 0) return <EmptyState icon={Rocket} title="No deployments logged yet" message="The server notes each new version or commit the first time it starts. The next deploy will show up here." />;
  const runningCommit = process.env.NEXT_PUBLIC_COMMIT || null;
  return (
    <>
      <div className={tableWrap}>
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className={th}>Deployed</th>
              <th className={th}>Version</th>
              <th className={th}>Commit</th>
              <th className={cn(th, "w-full")}>Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((d, i) => {
              const live = page === 1 && i === 0 && d.version === process.env.NEXT_PUBLIC_APP_VERSION && d.commit === runningCommit;
              return (
                <tr key={d.id} className="hover:bg-subtle">
                  <td className={cn(td, "whitespace-nowrap")}>{formatDateTime(d.deployed_at)}</td>
                  <td className={cn(td, "whitespace-nowrap font-medium")}>
                    v{d.version}
                    {live && <span className="ml-2 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success-foreground">Running</span>}
                  </td>
                  <td className={cn(td, "font-mono text-xs")}>{d.commit ?? "—"}</td>
                  <td className="px-2 py-2.5 align-top">
                    <DeploymentNote id={d.id} note={d.note} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PanelPager page={page} pageSize={PAGE_SIZE} total={total} noun="deployments" />
    </>
  );
}

async function ErrorsTab({ page, status, openCount }: { page: number; status: "open" | "resolved" | "all"; openCount: number }) {
  const where = status === "all" ? {} : { status };
  const [rows, total] = await Promise.all([
    prisma.errorLog.findMany({ where, orderBy: { last_seen: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.errorLog.count({ where }),
  ]);
  const userIds = [...new Set(rows.map((r) => r.user_id).filter((id): id is number => id !== null))];
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } }) : [];
  const userName = new Map(users.map((u) => [u.id, u.name]));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ErrorStatusFilter status={status} />
        <ResolveAllButton open={openCount} />
      </div>
      {total === 0 ? (
        <EmptyState icon={AlertTriangle} title={status === "open" ? "No open errors" : "Nothing here"} message="Server errors and screens that failed to load are caught automatically and listed here, grouped when they repeat." />
      ) : (
        <>
          <ul className="space-y-2">
            {rows.map((e) => (
              <li key={e.id} className={cn("rounded-card border bg-card p-4 shadow-card", e.status === "open" ? "border-border" : "border-border opacity-70")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
                      <span className={cn("rounded-full px-2 py-0.5", e.source === "server" ? "bg-danger-soft text-danger-foreground" : "bg-warning-soft text-warning-foreground")}>{e.source === "server" ? "Server" : "Browser"}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 tabular-nums text-foreground">{e.count}×</span>
                      {e.version && <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">v{e.version}</span>}
                      {e.status === "resolved" && <span className="rounded-full bg-success-soft px-2 py-0.5 text-success-foreground">Resolved</span>}
                    </div>
                    <p className="break-words text-sm font-semibold text-foreground">{e.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.method && <span className="mr-1 font-medium">{e.method}</span>}
                      {e.path ?? "—"}
                      {e.user_id && <span> · {userName.get(e.user_id) ?? `user ${e.user_id}`}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      First {formatDateTime(e.first_seen)} · Last {formatDateTime(e.last_seen)}
                      {e.digest && <span> · digest {e.digest}</span>}
                    </p>
                  </div>
                  <ErrorActions id={e.id} status={e.status} />
                </div>
                {e.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer select-none text-xs font-medium text-primary">Stack trace</summary>
                    <pre className="mt-2 max-h-64 overflow-auto rounded-control bg-muted p-3 text-[11px] leading-relaxed text-foreground/85">{e.stack}</pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
          <PanelPager page={page} pageSize={PAGE_SIZE} total={total} noun="errors" />
        </>
      )}
    </>
  );
}
