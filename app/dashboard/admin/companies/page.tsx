import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSalesPalSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getCachedAdminCompaniesPageOrgs,
  getCachedAdminCompaniesPageManagers,
  getCachedAdminCompaniesPageAccountants,
  getCachedAdminCompaniesPageSalesmen,
  getCachedAdminCompaniesPageRelations,
  getCachedAdminCompaniesPageClientCounts
} from "@/lib/cached-queries";
import { CompaniesClient } from "./CompaniesClient";
import { Skeleton } from "@/components/ui/Skeleton";

import { getPerformance, monthPeriod, type Performance } from "@/lib/performance";
async function CompaniesDashboardWrapper() {
  const [
    companies,
    managersList,
    accountantsList,
    salesmenList,
    managerSalesmen,
    clientCounts
  ] = await Promise.all([
    getCachedAdminCompaniesPageOrgs(),
    getCachedAdminCompaniesPageManagers(),
    getCachedAdminCompaniesPageAccountants(),
    getCachedAdminCompaniesPageSalesmen(),
    getCachedAdminCompaniesPageRelations(),
    getCachedAdminCompaniesPageClientCounts()
  ]);

  // This month's performance per company: each company's salesmen, counting only that company's clients.
  const performanceByOrg: Record<number, Record<number, Performance>> = {};
  await Promise.all(
    companies.map(async (org) => {
      const salesmanIds = [...new Set(managerSalesmen.filter((ms) => ms.org_id === org.id).map((ms) => ms.salesman_id))];
      const perf = await getPerformance(salesmanIds, monthPeriod(0), { orgId: org.id });
      performanceByOrg[org.id] = Object.fromEntries(perf);
    }),
  );

  return (
    <CompaniesClient
      companies={companies}
      managersList={managersList}
      accountantsList={accountantsList}
      salesmenList={salesmenList}
      managerSalesmen={managerSalesmen}
      clientCounts={clientCounts}
      performanceByOrg={performanceByOrg}
    />
  );
}

function CompaniesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Buttons skeleton */}
      <div className="flex gap-2 justify-end">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Two Column Grid */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-card border border-border bg-card p-6 space-y-6">
            <div className="space-y-3 pb-4 border-b border-border">
              <Skeleton className="h-6 w-36" />
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((j) => (
                  <Skeleton key={j} className="h-14 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="rounded-xl border border-border p-4 space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CompaniesPage() {
  const session = await getSalesPalSession();
  if (!session) {
    redirect("/login");
  }

  if (session.user.role_id !== 1) {
    return (
      <div className="p-6 text-center text-danger-foreground font-semibold bg-danger-soft rounded-xl border border-danger/30">
        Unauthorized access
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Companies"
        subtitle="Create companies, manage their documents, and assign managers, salesmen and accountants"
      />
      <div className="mt-6">
        <Suspense fallback={<CompaniesSkeleton />}>
          <CompaniesDashboardWrapper />
        </Suspense>
      </div>
    </>
  );
}
