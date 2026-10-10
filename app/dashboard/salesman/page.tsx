import { Suspense } from "react";
import { getSalesPalSession } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatCard, type StatCardTheme } from "@/components/dashboard/StatCard";
import { UserCheck, Phone, Sparkles, XCircle, ListChecks, Wallet, Package, UserPlus } from "lucide-react";
import { EMPTY_PERFORMANCE, getPerformance, monthPeriod } from "@/lib/performance";
import { MonthlyActivityChart } from "@/components/dashboard/MonthlyActivityChart";
import { OrderMonthlyChart } from "@/components/orders/OrderMonthlyChart";
import { TaskOverview } from "@/components/dashboard/TaskOverview";
import { formatAmount } from "@/lib/utils";
import {
  getCachedSalesmanInfo,
  getCachedClientStatusCounts,
  getCachedMonthLogs,
  getCachedSalesmanTasks,
  getCachedOnboardedByMonth,
  getMonthlyOrderStats,
} from "@/lib/cached-queries";
import { orderStatsScope } from "@/lib/scoping";

/* ── Skeleton fragments for each Suspense boundary ── */

function KpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-card border border-border bg-card p-5 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="mt-5 flex items-end justify-between gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-card animate-pulse">
      <Skeleton className="h-4 w-40 mb-5" />
      <Skeleton className="h-[240px] w-full rounded-xl" />
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-card animate-pulse">
      <Skeleton className="h-4 w-32 mb-5" />
      <div className="divide-y divide-border rounded-xl border border-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_CARD_CONFIG: {
  label: string;
  key: string;
  icon: typeof UserCheck;
  theme: StatCardTheme;
}[] = [
  {
    label: "Onboarded",
    key: "onboarded",
    icon: UserCheck,
    theme: { bg: "bg-primary" },
  },
  {
    label: "Follow up",
    key: "follow_up",
    icon: Phone,
    theme: { bg: "bg-primary" },
  },
  {
    label: "Leads",
    key: "lead",
    icon: Sparkles,
    theme: { bg: "bg-info" },
  },
  {
    label: "Lost",
    key: "lost",
    icon: XCircle,
    theme: { bg: "bg-primary" },
  },
];

function countByAction(logs: { action: string }[], keyword: string) {
  return logs.filter((l) => l.action.toLowerCase().includes(keyword)).length;
}

async function KpiCardsSection({ userId }: { userId: number }) {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [counts, thisMonthLogs, lastMonthLogs] = await Promise.all([
    getCachedClientStatusCounts(userId),
    getCachedMonthLogs(userId, thisMonthStart.toISOString()),
    getCachedMonthLogs(userId, lastMonthStart.toISOString(), lastMonthEnd.toISOString()),
  ]);

  const pctChanges: Record<string, number> = {};
  const lastMonthCounts: Record<string, number> = {};
  for (const card of STATUS_CARD_CONFIG) {
    const thisCount = countByAction(thisMonthLogs, card.key);
    const lastCount = countByAction(lastMonthLogs, card.key);
    const denom = Math.max(lastCount, 1);
    pctChanges[card.key] = Math.round(((thisCount - lastCount) / denom) * 100);
    lastMonthCounts[card.key] = lastCount;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUS_CARD_CONFIG.map((card) => {
        const pct = pctChanges[card.key] ?? 0;
        return (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={counts[card.key as keyof typeof counts] ?? 0}
            badgeLabel={`${pct > 0 ? "+" : ""}${pct}%`}
            badgeDirection={pct > 0 ? "up" : pct < 0 ? "down" : "flat"}
            caption={
              <>
                Vs last month:{" "}
                <span className="font-semibold text-foreground">{lastMonthCounts[card.key] ?? 0}</span>
              </>
            }
            theme={card.theme}
          />
        );
      })}
    </div>
  );
}

/** This month's orders, order value and new clients vs last month — what salesman performance is measured on. */
async function PerformanceCardsSection({ userId }: { userId: number }) {
  const [now, prev] = await Promise.all([getPerformance([userId], monthPeriod(0)), getPerformance([userId], monthPeriod(-1))]);
  const cur = now.get(userId) ?? EMPTY_PERFORMANCE;
  const last = prev.get(userId) ?? EMPTY_PERFORMANCE;
  const change = (a: number, b: number) => (b > 0 ? Math.round(((a - b) / b) * 100) : a > 0 ? 100 : 0);
  const cards = [
    { label: "Order value", value: formatAmount(cur.value), prev: formatAmount(last.value), pct: change(cur.value, last.value), icon: Wallet, theme: { bg: "bg-primary" } },
    { label: "Orders", value: cur.orders, prev: last.orders, pct: change(cur.orders, last.orders), icon: Package, theme: { bg: "bg-info" } },
    { label: "New clients", value: cur.newClients, prev: last.newClients, pct: change(cur.newClients, last.newClients), icon: UserPlus, theme: { bg: "bg-success" } },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <StatCard
          key={c.label}
          icon={c.icon}
          label={`${c.label} · this month`}
          value={c.value}
          badgeLabel={`${c.pct > 0 ? "+" : ""}${c.pct}%`}
          badgeDirection={c.pct > 0 ? "up" : c.pct < 0 ? "down" : "flat"}
          caption={
            <>
              Last month: <span className="font-semibold text-foreground">{c.prev}</span>
            </>
          }
          theme={c.theme}
        />
      ))}
    </div>
  );
}

async function MonthlyChartSection({ userId }: { userId: number }) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const onboardedByMonth = await getCachedOnboardedByMonth(userId, sixMonthsAgo.toISOString());

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartDataMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    chartDataMap[key] = 0;
  }
  for (const row of onboardedByMonth) {
    const d = new Date(row.created_at);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (key in chartDataMap) {
      chartDataMap[key] += row._count.id;
    }
  }
  const chartData = Object.entries(chartDataMap).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <SectionCard title="Monthly onboarded" subtitle="Clients onboarded, last 6 months">
      <MonthlyActivityChart data={chartData} />
    </SectionCard>
  );
}

const ORDER_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function OrderStatsSection({ userId }: { userId: number }) {
  const scope = await orderStatsScope({ id: userId, role_id: 3 });
  const stats = await getMonthlyOrderStats(scope);

  const now = new Date();
  const chartDataMap: Record<string, { totalCollected: number; totalPending: number; orderCount: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${ORDER_MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    chartDataMap[key] = { totalCollected: 0, totalPending: 0, orderCount: 0 };
  }
  for (const row of stats) {
    const d = new Date(row.month);
    const key = `${ORDER_MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (key in chartDataMap) {
      chartDataMap[key] = {
        totalCollected: row.totalCollected,
        totalPending: row.totalPending,
        orderCount: row.orderCount,
      };
    }
  }
  const chartData = Object.entries(chartDataMap).map(([month, values]) => ({ month, ...values }));

  return (
    <SectionCard title="Orders: collected vs pending" subtitle="Last 6 months">
      <OrderMonthlyChart data={chartData} />
    </SectionCard>
  );
}

async function TasksSection({ userId }: { userId: number }) {
  const tasks = await getCachedSalesmanTasks(userId);

  return (
    <SectionCard title="My tasks" subtitle="Your next 5 by priority and due date">
      {tasks.length > 0 ? (
        <TaskOverview tasks={tasks} />
      ) : (
        <EmptyState
          icon={ListChecks}
          title="No tasks assigned yet"
          message="Tasks your manager assigns to you will show up here."
        />
      )}
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Page Component — streams each section independently
   ══════════════════════════════════════════════════════════════ */

export default async function SalesmanDashboardPage() {
  const session = await getSalesPalSession();
  const userId = session!.user.id;

  /* Header data is small — fetch it synchronously for immediate display */
  const user = await getCachedSalesmanInfo(userId);
  const salesmanName = user?.name ?? "Salesman";
  const orgName = [...new Set(user?.salesmanManager?.map((l) => l.managerOrg.org.name) ?? [])].join(", ");
  const subtitle = orgName ? `${salesmanName} • ${orgName}` : salesmanName;

  return (
    <>
      <PageHeader title="My Performance" subtitle={subtitle} />

      <div className="space-y-5">
        {/* ─── 1. Performance: orders, order value, new clients ─── */}
        <Suspense fallback={<KpiCardsSkeleton />}>
          <PerformanceCardsSection userId={userId} />
        </Suspense>

        {/* ─── 2. Pipeline: where your clients are ─── */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Your pipeline</h2>
          <Suspense fallback={<KpiCardsSkeleton />}>
            <KpiCardsSection userId={userId} />
          </Suspense>
        </div>

        {/* ─── 3 & 4. Charts side by side on desktop ─── */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Suspense fallback={<ChartSkeleton />}>
            <MonthlyChartSection userId={userId} />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <OrderStatsSection userId={userId} />
          </Suspense>
        </div>

        {/* ─── 5. Tasks Overview ─── */}
        <Suspense fallback={<TasksSkeleton />}>
          <TasksSection userId={userId} />
        </Suspense>
      </div>
    </>
  );
}
