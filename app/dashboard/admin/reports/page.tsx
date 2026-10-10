import { prisma } from "@/lib/prisma";
import { byPerformance, getPerformance, monthPeriod, sumPerformance } from "@/lib/performance";
import { formatAmount } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";

/** This month at a glance: who brought in the most, and what the whole sales team brought in. */
export default async function ReportsPage() {
  const salesmen = await prisma.user.findMany({ where: { role_id: 3 }, select: { id: true, name: true } });
  const perf = await getPerformance(salesmen.map((s) => s.id), monthPeriod(0));
  const ranked = salesmen.map((s) => ({ ...s, perf: perf.get(s.id)! })).sort(byPerformance);
  const top = ranked[0];
  const team = sumPerformance(perf.values());
  return (
    <>
      <PageHeader title="Reports" subtitle="This month's performance across the sales team." />
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Top performer" value={top && top.perf.value > 0 ? top.name : "—"} hint={top ? `${formatAmount(top.perf.value)} from ${top.perf.orders} orders` : undefined} />
        <KpiCard label="Team order value" value={formatAmount(team.value)} hint={`${team.orders.toLocaleString()} orders this month`} />
        <KpiCard label="New clients" value={team.newClients.toLocaleString()} hint="First order placed this month" />
      </div>
    </>
  );
}
