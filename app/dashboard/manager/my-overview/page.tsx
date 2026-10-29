import { notTodo } from "@/lib/task-privacy";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSalesPalSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { actualProfit, EMPTY_PERFORMANCE, getPerformance, monthPeriod } from "@/lib/performance";
import { likeForLike } from "@/lib/pipeline-metrics";
import { formatAmount } from "@/lib/utils";
import { OPEN_TASK_STATUSES } from "@/types/task";
import { CheckCircle2, ClipboardList, ClockAlert, ListChecks, Package, PiggyBank, TrendingUp, UserPlus, Wallet } from "lucide-react";

export default async function ManagerMyOverviewPage() {
  const session = await getSalesPalSession();
  if (!session) redirect("/login");
  return (
    <>
      <PageHeader title="My Overview" subtitle="Your own performance this month — orders and clients you handle yourself, and the tasks you manage." />
      <div className="space-y-6">
        <Suspense fallback={<CardsSkeleton count={5} />}>
          <PerformanceCards userId={Number(session.user.id)} />
        </Suspense>
        <Suspense fallback={<CardsSkeleton count={4} />}>
          <TaskCards userId={Number(session.user.id)} />
        </Suspense>
      </div>
    </>
  );
}

const change = (a: number, b: number) => (b > 0 ? Math.round(((a - b) / b) * 100) : a > 0 ? 100 : 0);

async function PerformanceCards({ userId }: { userId: number }) {
  const month = monthPeriod(0);
  const current = { from: month.from, to: new Date() };
  const previous = likeForLike(current, monthPeriod(-1).from, month.from);
  const [now, prev, profit] = await Promise.all([getPerformance([userId], current), getPerformance([userId], previous), actualProfit(userId, current, previous)]);
  const cur = now.get(userId) ?? EMPTY_PERFORMANCE;
  const last = prev.get(userId) ?? EMPTY_PERFORMANCE;
  const cards = [
    { label: "Order value", value: cur.value, prev: last.value, icon: Wallet, bg: "bg-primary", money: true },
    { label: "Orders", value: cur.orders, prev: last.orders, icon: Package, bg: "bg-info", money: false },
    { label: "Provisional profit", value: cur.profit, prev: last.profit, icon: TrendingUp, bg: "bg-warning", money: true },
    { label: "Actual profit", value: profit.current, prev: profit.previous, icon: PiggyBank, bg: "bg-success", money: true },
    { label: "New clients", value: cur.newClients, prev: last.newClients, icon: UserPlus, bg: "bg-success", money: false },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => {
        const pct = change(c.value, c.prev);
        return (
          <StatCard
            key={c.label}
            icon={c.icon}
            label={`${c.label} · this month`}
            value={c.money ? formatAmount(c.value) : c.value}
            unit={c.money ? "QAR" : undefined}
            badgeLabel={`${pct > 0 ? "+" : ""}${pct}%`}
            badgeDirection={pct > 0 ? "up" : pct < 0 ? "down" : "flat"}
            caption={
              <>
                Same days last month: <span className="font-semibold text-foreground">{c.money ? formatAmount(c.prev) : c.prev}</span>
              </>
            }
            theme={{ bg: c.bg }}
          />
        );
      })}
    </div>
  );
}

/** Tasks the manager hands to the team vs the ones on their own plate. */
async function TaskCards({ userId }: { userId: number }) {
  const open = { in: [...OPEN_TASK_STATUSES] };
  const toTeam = { created_by_id: userId, assigned_to_id: { not: userId }, AND: [notTodo] };
  const mine = { assigned_to_id: userId, status: open };
  const overdue = { ...mine, due_date: { lt: new Date() } };
  const [t1, t2, t3, t4] = await Promise.all([
    prisma.task.count({ where: toTeam }),
    prisma.task.count({ where: { ...toTeam, status: open } }),
    prisma.task.count({ where: mine }),
    prisma.task.count({ where: overdue }),
  ]);
  const cards = [
    { label: "Assigned to team", value: t1, caption: "All tasks you gave your salesmen", icon: ClipboardList, bg: "bg-primary" },
    { label: "Team tasks open", value: t2, caption: "Still pending or in process", icon: ListChecks, bg: "bg-info" },
    { label: "My open tasks", value: t3, caption: "Assigned to you", icon: CheckCircle2, bg: "bg-success" },
    { label: "My overdue tasks", value: t4, caption: "Open and past their due date", icon: ClockAlert, bg: "bg-danger" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} caption={c.caption} theme={{ bg: c.bg }} />
      ))}
    </div>
  );
}

function CardsSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-card" />
      ))}
    </div>
  );
}
