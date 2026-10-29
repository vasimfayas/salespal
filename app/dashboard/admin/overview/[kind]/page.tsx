import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { DrilldownPager } from "@/components/dashboard/DrilldownPager";
import { clientsEntering, drillWindow, lostEnquiries, parsePaging, pipelineClients } from "@/lib/admin-drilldown";
import { isPeriodKey, periodLabels } from "@/lib/dashboard-period";
import { formatAmount, formatDate, titleCase } from "@/lib/utils";

const KINDS = ["onboarded", "pipeline", "lost-clients", "lost-enquiries"] as const;
type Kind = (typeof KINDS)[number];

const copy: Record<Kind, { title: string; rule: string }> = {
  onboarded: { title: "Onboarded clients", rule: "Clients that became onboarded in the period. A client counts once, on its latest move to onboarded." },
  pipeline: { title: "Active pipeline", rule: "Clients that are a lead or in follow-up right now, longest waiting first. Not limited to the period." },
  "lost-clients": { title: "Lost clients", rule: "Clients marked lost in the period. A client counts once." },
  "lost-enquiries": { title: "Lost enquiries", rule: "Enquiries marked lost in the period, with the reason the salesman gave." },
};

const th = "px-4 py-2.5 font-semibold";
const td = "px-4 py-3";

/** The records behind an owner-dashboard tile, so the number can be checked line by line. */
export default async function OverviewDrilldownPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ period?: string; org?: string; page?: string; size?: string }>;
}) {
  const { kind } = await params;
  if (!(KINDS as readonly string[]).includes(kind)) notFound();
  const sp = await searchParams;
  const period = isPeriodKey(sp.period) ? sp.period : "this_month";
  const orgId = Number(sp.org) || null;
  const window = drillWindow(period);
  const k = kind as Kind;
  const { page, pageSize, paging } = parsePaging(sp.page, sp.size);

  const data =
    k === "pipeline" ? await pipelineClients(orgId, paging)
    : k === "lost-enquiries" ? await lostEnquiries(orgId, window, paging)
    : await clientsEntering(k === "onboarded" ? "onboarded" : "lost", orgId, window, paging);

  if (page > 1 && data.rows.length === 0) redirect(`/dashboard/admin/overview/${k}?period=${period}${orgId ? `&org=${orgId}` : ""}&size=${pageSize}`);

  const back = `/dashboard/admin?period=${period}${orgId ? `&org=${orgId}` : ""}`;
  const subtitle = k === "pipeline" ? "Right now" : `${periodLabels[period]} · ${formatDate(window.from)} to ${formatDate(new Date(window.to.getTime() - 1))}`;

  return (
    <>
      <Link href={back} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft size={14} aria-hidden /> Back to overview
      </Link>
      <PageHeader title={`${copy[k].title} · ${data.total.toLocaleString()}`} subtitle={`${subtitle}. ${copy[k].rule}`} />
      <Card className="overflow-hidden p-0">
        {data.rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Nothing in this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-[13px] text-muted-foreground">
                {k === "lost-enquiries" ? (
                  <tr><th className={th}>Enquiry</th><th className={th}>Client</th><th className={th}>Company</th><th className={th}>Route</th><th className={th}>Salesman</th><th className={th}>Reason</th><th className={`${th} text-right`}>Quoted</th><th className={th}>Lost on</th></tr>
                ) : k === "pipeline" ? (
                  <tr><th className={th}>Client</th><th className={th}>Company</th><th className={th}>Salesman</th><th className={th}>Stage</th><th className={th}>In stage since</th></tr>
                ) : (
                  <tr><th className={th}>Client</th><th className={th}>Company</th><th className={th}>Salesman</th><th className={th}>{k === "lost-clients" ? "Reason" : "Came from"}</th><th className={th}>Date</th></tr>
                )}
              </thead>
              <tbody className="divide-y divide-border">
                {k === "lost-enquiries" && "ref" in (data.rows[0] ?? {}) &&
                  (data as Awaited<ReturnType<typeof lostEnquiries>>).rows.map((r) => (
                    <tr key={r.id} className="hover:bg-subtle/50">
                      <td className={`${td} font-medium`}>{r.ref}</td>
                      <td className={td}>{r.client}</td>
                      <td className={`${td} text-foreground/70`}>{r.company}</td>
                      <td className={`${td} text-foreground/70`}>{r.from} → {r.to}</td>
                      <td className={`${td} text-foreground/70`}>{r.salesman}</td>
                      <td className={td} title={r.text ?? undefined}>{r.reason}</td>
                      <td className={`${td} text-right tabular-nums`}>{formatAmount(r.value)}</td>
                      <td className={`${td} whitespace-nowrap text-xs text-muted-foreground`}>{formatDate(r.at)}</td>
                    </tr>
                  ))}
                {k === "pipeline" &&
                  (data as Awaited<ReturnType<typeof pipelineClients>>).rows.map((r) => (
                    <tr key={r.id} className="hover:bg-subtle/50">
                      <td className={`${td} font-medium`}><ClientLink id={r.id} name={r.name} /></td>
                      <td className={`${td} text-foreground/70`}>{r.company}</td>
                      <td className={`${td} text-foreground/70`}>{r.salesman ?? "—"}</td>
                      <td className={td}>{titleCase(r.status)}</td>
                      <td className={`${td} whitespace-nowrap text-xs text-muted-foreground`}>{formatDate(r.since)}</td>
                    </tr>
                  ))}
                {(k === "onboarded" || k === "lost-clients") &&
                  (data as Awaited<ReturnType<typeof clientsEntering>>).rows.map((r) => (
                    <tr key={r.id} className="hover:bg-subtle/50">
                      <td className={`${td} font-medium`}><ClientLink id={r.id} name={r.name} /></td>
                      <td className={`${td} text-foreground/70`}>{r.company}</td>
                      <td className={`${td} text-foreground/70`}>{r.salesman ?? "—"}</td>
                      <td className={`${td} text-foreground/70`}>{r.note ?? "—"}</td>
                      <td className={`${td} whitespace-nowrap text-xs text-muted-foreground`}>{formatDate(r.at)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <DrilldownPager page={page} pageSize={pageSize} total={data.total} />
    </>
  );
}

function ClientLink({ id, name }: { id: number; name: string }) {
  return <Link href={`/dashboard/admin/clients/${id}`} className="transition hover:text-primary">{name}</Link>;
}
