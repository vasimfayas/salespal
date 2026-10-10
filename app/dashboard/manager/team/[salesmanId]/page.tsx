import { notFound } from "next/navigation";
import { canAccessSalesman } from "@/lib/scoping";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPerformance, monthPeriod } from "@/lib/performance";
import { formatAmount } from "@/lib/utils";
import { clientStatusCounts, getClientsPage } from "@/lib/clients-list";
import type { SearchParams } from "@/lib/list-params";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ClientTable } from "@/components/clients/ClientTable";
import { PerformanceReportButton } from "@/components/reports/PerformanceReportButton";

export default async function SalesmanDrilldownPage({
  params,
  searchParams,
}: {
  params: Promise<{ salesmanId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ salesmanId }, query, session] = await Promise.all([params, searchParams, getSalesPalSession()]);
  const id = Number(salesmanId);
  if (!(await canAccessSalesman({ id: session!.user.id, role_id: session!.user.role_id }, id))) notFound();

  const scope = { assigned_salesman_id: id };
  const [salesman, counts, clients, perfMap] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { name: true } }),
    clientStatusCounts(scope),
    getClientsPage(scope, query),
    getPerformance([id], monthPeriod(0)),
  ]);
  const perf = perfMap.get(id)!;
  if (!salesman) notFound();
  const totalClients = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <>
      <PageHeader
        title={salesman.name}
        subtitle="What they brought in this month, and their clients."
        action={<PerformanceReportButton salesmanId={id} salesmanName={salesman.name} />}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Order value · this month" value={formatAmount(perf.value)} />
        <KpiCard label="Orders · this month" value={perf.orders} />
        <KpiCard label="New clients · this month" value={perf.newClients} hint="First order placed this month" />
        <KpiCard label="Clients" value={totalClients} hint={`${counts.onboarded ?? 0} onboarded`} />
      </div>
      <ClientTable clients={clients.rows} total={clients.total} page={clients.page} pageSize={clients.pageSize} />
    </>
  );
}
