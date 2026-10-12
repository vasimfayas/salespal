import { Suspense } from "react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatCard, type StatCardTheme } from "@/components/dashboard/StatCard";
import { UserCheck, Phone, Sparkles, XCircle, ListChecks, Package, UserPlus, Plus, Send, Users, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { EMPTY_PERFORMANCE, getPerformance, monthPeriod } from "@/lib/performance";
import { MonthlyActivityChart } from "@/components/dashboard/MonthlyActivityChart";
import { OrderMonthlyChart } from "@/components/orders/OrderMonthlyChart";
import { Avatar } from "@/components/ui/avatar";
import { TaskActions } from "@/components/tasks/TaskActions";
import { DueDate, KindBadge } from "@/components/tasks/TaskRowParts";
import { getTasksPage } from "@/lib/tasks-list";
import { getTargetAchievements, todayUtc } from "@/lib/salesman-targets";
import { ACTIVE_ENQUIRY_STATUSES } from "@/types/enquiry";
import { isOpenTask } from "@/types/task";
import { cn, formatAmount } from "@/lib/utils";
import { getCachedSalesmanInfo, getMonthlyOrderStats } from "@/lib/cached-queries";
import { STUCK_AFTER_DAYS, currentStatusCounts, likeForLike, monthlyEntries, statusEntries, statusExits, stuckCounts } from "@/lib/pipeline-metrics";
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

/** Pipeline cards: how many clients are in the stage now, what changed this month, and who is stuck. */
const STATUS_CARD_CONFIG: {
  label: string;
  key: string;
  icon: typeof UserCheck;
  theme: StatCardTheme;
  goodWhen: "up" | "down";
  /** Early stages also show clients sitting there too long. */
  stuck?: boolean;
}[] = [
  { label: "Onboarded", key: "onboarded", icon: UserCheck, theme: { bg: "bg-primary" }, goodWhen: "up" },
  { label: "Follow up", key: "follow_up", icon: Phone, theme: { bg: "bg-primary" }, goodWhen: "up", stuck: true },
  { label: "Leads", key: "lead", icon: Sparkles, theme: { bg: "bg-info" }, goodWhen: "up", stuck: true },
  { label: "Lost", key: "lost", icon: XCircle, theme: { bg: "bg-danger" }, goodWhen: "down" },
];

async function KpiCardsSection({ userId }: { userId: number }) {
  const now = new Date();
  const month = monthPeriod(0);
  const current = { from: month.from, to: now };
  const previous = likeForLike(current, monthPeriod(-1).from, month.from);
  const scope = { ownerIds: [userId] };
  const [counts, entered, enteredBefore, left, stuck] = await Promise.all([
    currentStatusCounts(scope),
    statusEntries(scope, current),
    statusEntries(scope, previous),
    statusExits(scope, current),
    stuckCounts(scope, STATUS_CARD_CONFIG.filter((c) => c.stuck).map((c) => c.key), now),
  ]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUS_CARD_CONFIG.map((card) => {
        const movedIn = entered[card.key] ?? 0;
        const net = movedIn - (left[card.key] ?? 0);
        const stuckHere = stuck[card.key] ?? 0;
        return (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={counts[card.key] ?? 0}
            badgeLabel={`${net > 0 ? "+" : ""}${net} this month`}
            badgeDirection={net > 0 ? "up" : net < 0 ? "down" : "flat"}
            goodWhen={card.goodWhen}
            caption={
              <span className="space-y-0.5">
                <span className="block">
                  Moved in: <span className="font-semibold text-foreground">{movedIn}</span> · same days last month:{" "}
                  <span className="font-semibold text-foreground">{enteredBefore[card.key] ?? 0}</span>
                </span>
                {card.stuck && stuckHere > 0 && (
                  <Link href={`/dashboard/salesman/clients?status=${card.key}`} className="block font-medium text-warning-foreground hover:underline">
                    {stuckHere} here over {STUCK_AFTER_DAYS} days
                  </Link>
                )}
              </span>
            }
            theme={card.theme}
          />
        );
      })}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <Skeleton className="h-44 rounded-card" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="col-span-2 h-20 rounded-card" />
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "Enquiry", href: "/dashboard/salesman/enquiries?new=1", icon: Plus },
  { label: "Send to client", href: "/dashboard/salesman/enquiries?send=1", icon: Send },
  { label: "New task", href: "/dashboard/salesman/tasks?add=1", icon: ListChecks },
  { label: "Clients", href: "/dashboard/salesman/clients", icon: Users },
];

/** The month at a glance: order value against target, open enquiries, payments due, and quick actions. */
async function MonthHeroSection({ userId }: { userId: number }) {
  const today = todayUtc();
  const [perfNow, perfPrev, target, enquiries, dues] = await Promise.all([
    getPerformance([userId], { from: monthPeriod(0).from, to: new Date() }),
    // Same days of last month, so early in the month the change isn't automatically negative.
    getPerformance([userId], likeForLike({ from: monthPeriod(0).from, to: new Date() }, monthPeriod(-1).from, monthPeriod(0).from)),
    prisma.salesmanTarget.findFirst({
      where: { salesman_id: userId, closed_at: null, period_start: { lte: today }, period_end: { gte: today } },
      orderBy: { period_start: "desc" },
      select: { id: true, amount: true },
    }),
    prisma.enquiry.groupBy({ by: ["status"], where: { created_by_id: userId, status: { in: [...ACTIVE_ENQUIRY_STATUSES] } }, _count: { _all: true } }),
    prisma.$queryRaw<{ due: number; past_due: number }[]>(Prisma.sql`
      SELECT COALESCE(SUM(o.amount - o.paid_total), 0)::float8 AS due,
             COUNT(*) FILTER (WHERE o.due_date < ${today})::int AS past_due
      FROM orders o
      WHERE o.created_by_id = ${userId} AND o.status IN ('transit', 'delivered') AND o.amount - o.paid_total > 0.005`),
  ]);
  const value = (perfNow.get(userId) ?? EMPTY_PERFORMANCE).value;
  const prevValue = (perfPrev.get(userId) ?? EMPTY_PERFORMANCE).value;
  const pct = prevValue > 0 ? Math.round(((value - prevValue) / prevValue) * 100) : value > 0 ? 100 : 0;
  const targetAmount = target ? Number(target.amount) : 0;
  // Progress on the active target counts the same orders as the manager's Team page.
  const achieved = target ? ((await getTargetAchievements([userId])).get(target.id) ?? 0) : 0;
  const targetPct = targetAmount > 0 ? Math.min(100, Math.round((achieved / targetAmount) * 100)) : 0;
  const openEnquiries = enquiries.reduce((sum, g) => sum + g._count._all, 0);
  const withAgents = enquiries.find((g) => g.status === "with_agent")?._count._all ?? 0;
  const due = dues[0] ?? { due: 0, past_due: 0 };
  const month = new Date().toLocaleString("en", { month: "long" });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* Month card */}
      <section aria-labelledby="month-title" className="flex flex-col justify-between gap-5 rounded-card bg-[#15171a] p-5 text-white shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p id="month-title" className="text-sm text-white/70">My orders · {month}</p>
            <p className="mt-1 break-words text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">{formatAmount(value)}</p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-control px-2.5 py-1 text-xs font-semibold tabular-nums",
              pct >= 0 ? "bg-[#2c3a1c] text-[#c8e68e]" : "bg-[#3a221c] text-[#f3b49f]",
            )}
            title="Compared with the same days last month"
          >
            {pct >= 0 ? <TrendingUp size={13} aria-hidden /> : <TrendingDown size={13} aria-hidden />}
            {pct > 0 ? "+" : ""}
            {pct}%
          </span>
        </div>
        {target ? (
          <div role="img" aria-label={`${targetPct}% of target ${formatAmount(targetAmount)}`} className="space-y-1.5">
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[repeating-linear-gradient(135deg,#a3ce5b_0_6px,#8dbb45_6px_12px)]"
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>{targetPct}% of target</span>
              <span className="tabular-nums">{formatAmount(targetAmount)}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-white/70">
            Same days last month: <span className="font-semibold tabular-nums text-white">{formatAmount(prevValue)}</span> · no target set yet
          </p>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/salesman/enquiries" className="rounded-card border border-border bg-card p-4 shadow-card transition-colors hover:bg-subtle">
          <p className="text-sm text-muted-foreground">Open enquiries</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{openEnquiries}</p>
          <p className="mt-0.5 text-xs text-warning-foreground">{withAgents ? `${withAgents} with agents` : "none with agents"}</p>
        </Link>
        <Link href="/dashboard/salesman/orders?pay=due" className="rounded-card border border-border bg-card p-4 shadow-card transition-colors hover:bg-subtle">
          <p className="text-sm text-muted-foreground">Payments due</p>
          <p className="mt-1 break-words text-2xl font-bold tabular-nums text-foreground">{formatAmount(due.due)}</p>
          <p className={cn("mt-0.5 text-xs", due.past_due ? "text-danger-foreground" : "text-muted-foreground")}>
            {due.past_due ? `${due.past_due} past due` : "nothing past due"}
          </p>
        </Link>
        <nav aria-label="Quick actions" className="col-span-2 grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-card border border-border bg-card px-1 py-3 text-center text-xs font-medium text-foreground shadow-card transition-colors hover:bg-subtle"
            >
              <span className="flex size-9 items-center justify-center rounded-control bg-primary-soft text-primary-soft-foreground">
                <a.icon size={17} aria-hidden />
              </span>
              {a.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

/** Open tasks soonest due first, each with its own action (Follow up, Contacted…, Revise offer). */
async function FollowUpsSection({ userId }: { userId: number }) {
  const { rows } = await getTasksPage({ userId }, {});
  const open = rows.filter((t) => isOpenTask(t.status)).slice(0, 6);
  const now = todayUtc().getTime();
  return (
    <SectionCard title="Follow-ups due" subtitle="Your open tasks, soonest first" href="/dashboard/salesman/tasks">
      {open.length === 0 ? (
        <EmptyState icon={ListChecks} title="You're all caught up" message="New follow-ups and tasks will show up here." />
      ) : (
        <ul className="divide-y divide-border">
          {open.map((task) => (
            <li key={`${task.isClientTask ? "c" : "t"}-${task.id}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <KindBadge task={task} />
                  <DueDate task={task} now={now} />
                </div>
                <p className="line-clamp-2 text-sm font-medium text-foreground" title={task.description}>
                  {task.clientName ? `${task.clientName} — ` : ""}
                  {task.description}
                </p>
              </div>
              <div className="shrink-0">
                <TaskActions task={task} enquiriesPath="/dashboard/salesman/enquiries" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

/** invoice_date is a date column: compare as plain local calendar days. */
const day = (d: Date) => Prisma.sql`${`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`}::date`;

/**
 * Actual profit accounts entered on the salesman's orders invoiced in each range (by invoice date, as on the
 * owner's Accounts page and the reports), leaving out cancelled and sent-back orders.
 */
async function actualProfit(userId: number, current: { from: Date; to: Date }, previous: { from: Date; to: Date }) {
  const [row] = await prisma.$queryRaw<{ current: number; previous: number }[]>(Prisma.sql`
    SELECT COALESCE(SUM(e.actual_profit) FILTER (WHERE o.invoice_date >= ${day(current.from)}), 0)::float8 AS current,
           COALESCE(SUM(e.actual_profit) FILTER (WHERE o.invoice_date <= ${day(previous.to)}), 0)::float8 AS previous
    FROM orders o JOIN enquiries e ON e.id = o.enquiry_id
    WHERE o.created_by_id = ${userId} AND o.status NOT IN ('cancelled', 'revision_requested') AND e.actual_profit IS NOT NULL
      AND o.invoice_date >= ${day(previous.from)} AND o.invoice_date <= ${day(current.to)}
      AND (o.invoice_date >= ${day(current.from)} OR o.invoice_date <= ${day(previous.to)})`);
  return row ?? { current: 0, previous: 0 };
}

/** This month's orders, new clients and actual profit vs last month — what salesman performance is measured on. */
async function PerformanceCardsSection({ userId }: { userId: number }) {
  // Month so far vs the same days of last month.
  const month = monthPeriod(0);
  const current = { from: month.from, to: new Date() };
  const previous = likeForLike(current, monthPeriod(-1).from, month.from);
  const [now, prev, profit] = await Promise.all([getPerformance([userId], current), getPerformance([userId], previous), actualProfit(userId, current, previous)]);
  const cur = now.get(userId) ?? EMPTY_PERFORMANCE;
  const last = prev.get(userId) ?? EMPTY_PERFORMANCE;
  const change = (a: number, b: number) => (b > 0 ? Math.round(((a - b) / b) * 100) : a > 0 ? 100 : 0);
  const cards = [
    { label: "Orders", value: cur.orders, prev: last.orders, pct: change(cur.orders, last.orders), icon: Package, theme: { bg: "bg-info" }, money: false },
    { label: "New clients", value: cur.newClients, prev: last.newClients, pct: change(cur.newClients, last.newClients), icon: UserPlus, theme: { bg: "bg-success" }, money: false },
    { label: "Actual profit", value: profit.current, prev: profit.previous, pct: change(profit.current, profit.previous), icon: PiggyBank, theme: { bg: "bg-primary" }, money: true },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className={cn(c.money && "col-span-2 lg:col-span-1")}>
          <StatCard
            icon={c.icon}
            label={`${c.label} · this month`}
            value={c.money ? formatAmount(c.value) : c.value}
            badgeLabel={`${c.pct > 0 ? "+" : ""}${c.pct}%`}
            badgeDirection={c.pct > 0 ? "up" : c.pct < 0 ? "down" : "flat"}
            caption={
              <>
                Same days last month: <span className="font-semibold text-foreground">{c.money ? formatAmount(c.prev) : c.prev}</span>
                {c.money && <span className="block">By invoice date, from the figures accounts enter.</span>}
              </>
            }
            theme={c.theme}
          />
        </div>
      ))}
    </div>
  );
}

async function MonthlyChartSection({ userId }: { userId: number }) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const byMonth = await monthlyEntries({ ownerIds: [userId] }, "onboarded", sixMonthsAgo);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { month: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`, count: byMonth[key] ?? 0 };
  });

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

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <Avatar name={salesmanName} size="lg" className="rounded-control" />
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">{salesmanName}</h1>
          {orgName && <p className="truncate text-xs text-muted-foreground">{orgName}</p>}
        </div>
      </div>

      {/* ─── 1. The month: order value vs target, enquiries, payments, quick actions ─── */}
      <Suspense fallback={<HeroSkeleton />}>
        <MonthHeroSection userId={userId} />
      </Suspense>

      {/* ─── 2. What to do next ─── */}
      <Suspense fallback={<ChartSkeleton />}>
        <FollowUpsSection userId={userId} />
      </Suspense>

      {/* ─── 3. Orders, new clients and actual profit vs last month ─── */}
      <Suspense fallback={<KpiCardsSkeleton />}>
        <PerformanceCardsSection userId={userId} />
      </Suspense>

      {/* ─── 4. Pipeline: where your clients are ─── */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Your pipeline</h2>
        <Suspense fallback={<KpiCardsSkeleton />}>
          <KpiCardsSection userId={userId} />
        </Suspense>
      </div>

      {/* ─── 5. Charts side by side on desktop ─── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <MonthlyChartSection userId={userId} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <OrderStatsSection userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}
