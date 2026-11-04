import { isPeriodKey, monthKey, periodLabel, type PeriodKey } from "@/lib/dashboard-period";
import { DashboardPending, DashboardTransitionProvider } from "@/components/dashboard/DashboardTransition";
import { Suspense } from "react";
import { getCachedAdminOrgs } from "@/lib/cached-queries";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import {
  KpiCardsRow,
  CompanyHeroSection,
  SalesmanLeaderboardSection,
  TaskHealthSection,
  LiveActivitySection,
  LostClientsSection,
  MonthlyTrendSection,
  KpiSkeleton,
  HeroSkeleton,
  CardSkeleton,
  CardSmallSkeleton,
} from "@/components/dashboard/AdminDashboardSections";


export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; org?: string }>;
}) {
  const params = await searchParams;
  const period: PeriodKey = isPeriodKey(params.period) ? params.period : "this_month";
  const orgId = params.org ? Number(params.org) : undefined;

  // Orgs are fast (cached 300s) — fetch for header + filters
  const orgs = await getCachedAdminOrgs();

  const orgNames = orgs.length > 2 ? `${orgs.length} companies` : orgs.map((o) => o.name).join(" & ");

  return (
    <DashboardTransitionProvider>
      <PageHeader
        title="Owner Dashboard"
        subtitle={`${orgNames} · ${periodLabel(period === "this_month" ? monthKey(0) : period)}`}
        action={<DashboardFilters orgs={orgs} />}
      />

      <DashboardPending className="space-y-6">
        <Suspense fallback={<KpiSkeleton />}>
          <KpiCardsRow period={period} orgId={orgId} />
        </Suspense>

        <Suspense fallback={<HeroSkeleton />}>
          <CompanyHeroSection period={period} orgId={orgId} />
        </Suspense>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Suspense fallback={<CardSkeleton />}>
            <SalesmanLeaderboardSection
              orgId={orgId}
              className="order-1 lg:order-none"
            />
          </Suspense>

          <Suspense fallback={<CardSkeleton />}>
            <TaskHealthSection
              orgId={orgId}
              className="order-2 lg:order-none"
            />
          </Suspense>

          <Suspense fallback={<CardSmallSkeleton />}>
            <MonthlyTrendSection
              orgId={orgId}
              className="order-3 lg:order-none"
            />
          </Suspense>

          <Suspense fallback={<CardSmallSkeleton className="lg:col-span-2" />}>
            <LostClientsSection
              period={period}
              orgId={orgId}
              className="order-5 lg:order-none lg:col-span-2"
            />
          </Suspense>

          <Suspense fallback={<CardSkeleton />}>
            <LiveActivitySection className="order-4 lg:order-none" />
          </Suspense>
        </div>
      </DashboardPending>
    </DashboardTransitionProvider>
  );
}
