"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ListTodo, MessageSquareText, Package, RotateCcw, UserPlus, UserRound, Wallet, type LucideIcon } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn, titleCase } from "@/lib/utils";
import { isOpenTask, taskKindLabels, type TaskKind } from "@/types/task";
import type { CalendarSummaryRow, CalendarTask } from "@/lib/calendar";

type View = "month" | "week" | "year";

/** One look per task type: the legend, the chips and the dots all read from here. */
const KINDS: Record<TaskKind, { icon: LucideIcon; dot: string; chip: string }> = {
  general: { icon: ListTodo, dot: "bg-slate-400", chip: "border-slate-400 bg-slate-400/10" },
  lead_follow_up: { icon: UserPlus, dot: "bg-emerald-500", chip: "border-emerald-500 bg-emerald-500/10" },
  client_follow_up: { icon: UserRound, dot: "bg-lime-500", chip: "border-lime-500 bg-lime-500/10" },
  enquiry_follow_up: { icon: MessageSquareText, dot: "bg-amber-500", chip: "border-amber-500 bg-amber-500/10" },
  order_follow_up: { icon: Package, dot: "bg-sky-500", chip: "border-sky-500 bg-sky-500/10" },
  order_revision: { icon: RotateCcw, dot: "bg-rose-500", chip: "border-rose-500 bg-rose-500/10" },
  payment_follow_up: { icon: Wallet, dot: "bg-violet-500", chip: "border-violet-500 bg-violet-500/10" },
};
const KIND_ORDER = Object.keys(KINDS) as TaskKind[];

const STATUS_PILL: Record<string, string> = {
  pending: "bg-muted text-foreground",
  in_process: "bg-info-soft text-info-foreground",
  achieved: "bg-success-soft text-success-foreground",
  unsuccessful: "bg-danger-soft text-danger-foreground",
};

/* Dates are plain "YYYY-MM-DD" strings handled in UTC, so a due date never shifts a day with the time zone. */
const parse = (s: string) => new Date(`${s}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => iso(new Date(parse(s).getTime() + n * 86_400_000));
const startOfWeek = (s: string) => addDays(s, -parse(s).getUTCDay());
const monthStart = (s: string) => `${s.slice(0, 7)}-01`;
const addMonths = (s: string, n: number) => iso(new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1 + n, 1)));
const fmt = (s: string, opts: Intl.DateTimeFormatOptions) => parse(s).toLocaleDateString("en", { timeZone: "UTC", ...opts });
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthGrid(anchor: string) {
  const first = startOfWeek(monthStart(anchor));
  const last = addDays(monthStart(addMonths(anchor, 1)), -1);
  const weeks = Math.ceil((parse(last).getTime() - parse(first).getTime() + 86_400_000) / (7 * 86_400_000));
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(first, i));
}

function rangeFor(view: View, anchor: string) {
  if (view === "year") return { from: `${anchor.slice(0, 4)}-01-01`, to: `${anchor.slice(0, 4)}-12-31` };
  if (view === "week") return { from: startOfWeek(anchor), to: addDays(startOfWeek(anchor), 6) };
  const grid = monthGrid(anchor);
  return { from: grid[0], to: grid[grid.length - 1] };
}

function titleFor(view: View, anchor: string) {
  if (view === "year") return anchor.slice(0, 4);
  if (view === "month") return fmt(anchor, { month: "long", year: "numeric" });
  const start = startOfWeek(anchor);
  const end = addDays(start, 6);
  return `${fmt(start, { month: "short", day: "numeric" })} – ${fmt(end, { month: "short", day: "numeric", year: "numeric" })}`;
}

type Loaded = { key: string; tasks: CalendarTask[]; summary: CalendarSummaryRow[]; truncated: boolean };

export type CalendarPerson = { id: number; name: string };

export function TaskCalendar({
  people,
  clientsBase,
  tasksHref,
}: {
  /** Assignees the viewer may filter by; empty for people who only see their own tasks. */
  people: CalendarPerson[];
  /** Where a client's page lives for this role, if it has one. */
  clientsBase: string | null;
  /** This role's task list, if it has one. */
  tasksHref: string | null;
}) {
  const today = useMemo(() => new Date().toLocaleDateString("en-CA"), []);
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(today);
  const [selected, setSelected] = useState<string | null>(today);
  const [hidden, setHidden] = useState<Set<TaskKind>>(new Set());
  const [person, setPerson] = useState("all");
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState(false);
  const multiUser = people.length > 0;

  const { from, to } = rangeFor(view, anchor);
  const key = `${view === "year" ? "summary" : "rows"}|${from}|${to}|${person}`;

  useEffect(() => {
    const controller = new AbortController();
    const q = new URLSearchParams({ from, to, mode: view === "year" ? "summary" : "rows", ...(person !== "all" ? { user: person } : {}) });
    fetch(`/api/calendar?${q}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        setError(false);
        setLoaded({ key, tasks: data.tasks ?? [], summary: data.days ?? [], truncated: Boolean(data.truncated) });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [key, from, to, view, person]);

  const loading = loaded?.key !== key && !error;

  const visibleTasks = useMemo(() => (loaded?.tasks ?? []).filter((t) => !hidden.has(t.kind)), [loaded, hidden]);
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarTask[]>();
    for (const t of visibleTasks) map.set(t.date, [...(map.get(t.date) ?? []), t]);
    return map;
  }, [visibleTasks]);
  const kindsByDate = useMemo(() => {
    const map = new Map<string, TaskKind[]>();
    const source = view === "year" ? (loaded?.summary ?? []).map((r) => ({ date: r.date, kind: r.kind })) : [];
    for (const r of source) if (!hidden.has(r.kind)) map.set(r.date, [...(map.get(r.date) ?? []), r.kind]);
    return map;
  }, [loaded, hidden, view]);
  const countByKind = useMemo(() => {
    const counts = Object.fromEntries(KIND_ORDER.map((k) => [k, 0])) as Record<TaskKind, number>;
    if (view === "year") for (const r of loaded?.summary ?? []) counts[r.kind] += r.count;
    else for (const t of loaded?.tasks ?? []) counts[t.kind]++;
    return counts;
  }, [loaded, view]);

  function go(direction: -1 | 1) {
    setAnchor((a) => (view === "year" ? addMonths(a, 12 * direction) : view === "month" ? addMonths(a, direction) : addDays(a, 7 * direction)));
  }
  function openDay(date: string, nextView: View = "month") {
    setView(nextView);
    setAnchor(date);
    setSelected(date);
  }
  const toggleKind = (kind: TaskKind) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (!next.delete(kind)) next.add(kind);
      return next;
    });

  const selectedTasks = selected ? (byDate.get(selected) ?? []) : [];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-3 shadow-card sm:flex-row sm:flex-wrap sm:items-center sm:p-4">
        <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="icon-sm" aria-label={`Previous ${view}`} onClick={() => go(-1)}>
            <ChevronLeft />
          </Button>
          <Button variant="secondary" size="icon-sm" aria-label={`Next ${view}`} onClick={() => go(1)}>
            <ChevronRight />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => openDay(today, view)}>
            Today
          </Button>
        </div>
        <h2 className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-foreground" aria-live="polite">
          {titleFor(view, anchor)}
        </h2>
        {multiUser && (
          <select
            aria-label="Show tasks of"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="h-8 cursor-pointer rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15"
          >
            <option value="all">Everyone</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        <SegmentedControl
          label="Calendar view"
          size="sm"
          value={view}
          onChange={(v) => {
            setView(v);
            if (v !== "year" && !selected) setSelected(anchor);
          }}
          options={[
            { value: "month", label: "Month" },
            { value: "week", label: "Week" },
            { value: "year", label: "Year" },
          ]}
        />
      </div>

      {/* Legend: doubles as a filter */}
      <ul className="flex flex-wrap gap-1.5" aria-label="Task types">
        {KIND_ORDER.map((kind) => {
          const off = hidden.has(kind);
          const { icon: Icon, dot } = KINDS[kind];
          return (
            <li key={kind}>
              <button
                type="button"
                aria-pressed={!off}
                onClick={() => toggleKind(kind)}
                className={cn(
                  "press inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  off ? "border-border bg-transparent text-muted-foreground line-through" : "border-border bg-card text-foreground hover:border-border-strong",
                )}
              >
                <span className={cn("size-2 rounded-full", dot, off && "opacity-30")} aria-hidden />
                <Icon size={12} aria-hidden className="text-muted-foreground" />
                {taskKindLabels[kind]}
                <span className="tabular-nums text-muted-foreground">{countByKind[kind]}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {error && <p className="rounded-control border border-danger/30 bg-danger-soft p-3 text-sm text-danger-foreground">Couldn’t load tasks. Check your connection and try again.</p>}
      {loaded?.truncated && view !== "year" && !error && (
        <p className="rounded-control border border-warning/30 bg-warning-soft p-3 text-sm text-warning-foreground">Showing the first 3000 tasks of this period. Pick one person to see the rest.</p>
      )}

      <div className={cn("transition-opacity", loading && "opacity-60")} aria-busy={loading}>
        {!loaded ? (
          <Skeleton className="h-[480px] rounded-card" />
        ) : view === "month" ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <MonthGrid anchor={anchor} today={today} selected={selected} byDate={byDate} multiUser={multiUser} onSelect={setSelected} />
            <DayPanel date={selected} tasks={selectedTasks} multiUser={multiUser} clientsBase={clientsBase} tasksHref={tasksHref} />
          </div>
        ) : view === "week" ? (
          <WeekView anchor={anchor} today={today} byDate={byDate} multiUser={multiUser} clientsBase={clientsBase} />
        ) : (
          <YearView year={anchor.slice(0, 4)} today={today} kindsByDate={kindsByDate} onDay={(d) => openDay(d)} onMonth={(m) => openDay(m)} />
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Month ───────────────────────── */

function MonthGrid({ anchor, today, selected, byDate, multiUser, onSelect }: { anchor: string; today: string; selected: string | null; byDate: Map<string, CalendarTask[]>; multiUser: boolean; onSelect: (d: string) => void }) {
  const days = monthGrid(anchor);
  const month = anchor.slice(0, 7);
  return (
    <div className="overflow-hidden rounded-card border border-border bg-card shadow-card">
      <div className="grid grid-cols-7 border-b border-border bg-subtle text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date, i) => {
          const tasks = byDate.get(date) ?? [];
          const inMonth = date.startsWith(month);
          const isToday = date === today;
          const isSelected = date === selected;
          const kinds = [...new Set(tasks.map((t) => t.kind))];
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              aria-label={`${fmt(date, { weekday: "long", month: "long", day: "numeric" })}, ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
              className={cn(
                "flex min-h-14 cursor-pointer flex-col gap-1 border-b border-r border-border p-1 text-left outline-none transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring md:min-h-28 md:p-1.5",
                i % 7 === 6 && "border-r-0",
                i >= days.length - 7 && "border-b-0",
                inMonth ? "bg-card hover:bg-subtle" : "bg-subtle/60 text-muted-foreground hover:bg-subtle",
                isSelected && "bg-primary-soft/60 ring-2 ring-inset ring-ring/60",
              )}
            >
              <span className={cn("inline-flex size-6 items-center justify-center self-start rounded-full text-xs font-semibold tabular-nums", isToday ? "bg-primary text-primary-foreground" : inMonth ? "text-foreground" : "text-muted-foreground")}>
                {parse(date).getUTCDate()}
              </span>
              {/* Phones: dots only. Wider screens: the first few tasks. */}
              <span className="flex flex-wrap gap-0.5 md:hidden" aria-hidden>
                {kinds.slice(0, 4).map((k) => (
                  <span key={k} className={cn("size-1.5 rounded-full", KINDS[k].dot)} />
                ))}
              </span>
              <span className="hidden min-w-0 flex-col gap-0.5 md:flex">
                {tasks.slice(0, 3).map((t) => (
                  <Chip key={t.id} task={t} multiUser={multiUser} />
                ))}
                {tasks.length > 3 && <span className="px-1 text-[11px] font-medium text-muted-foreground">+{tasks.length - 3} more</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ task, multiUser }: { task: CalendarTask; multiUser: boolean }) {
  const done = !isOpenTask(task.status);
  return (
    <span className={cn("flex min-w-0 items-center gap-1 rounded-sm border-l-2 px-1.5 py-0.5 text-[11px] leading-tight text-foreground", KINDS[task.kind].chip, done && "opacity-55")} title={`${task.assignedName}: ${task.description}`}>
      {multiUser && <span className="shrink-0 font-semibold">{task.assignedName.split(" ")[0]}</span>}
      <span className={cn("truncate", done && "line-through")}>{task.description}</span>
    </span>
  );
}

/* ───────────────────────── Day panel & cards ───────────────────────── */

function DayPanel({ date, tasks, multiUser, clientsBase, tasksHref }: { date: string | null; tasks: CalendarTask[]; multiUser: boolean; clientsBase: string | null; tasksHref: string | null }) {
  return (
    <aside className="rounded-card border border-border bg-card p-4 shadow-card lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto" aria-label="Tasks of the selected day">
      {date ? (
        <>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{fmt(date, { weekday: "long", month: "long", day: "numeric" })}</h3>
            <span className="text-xs text-muted-foreground">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
          </div>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <CalendarDays className="size-6 opacity-60" aria-hidden />
              Nothing scheduled for this day.
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t.id}>
                  <TaskCard task={t} multiUser={multiUser} clientsBase={clientsBase} />
                </li>
              ))}
            </ul>
          )}
          {tasksHref && tasks.length > 0 && (
            <Link href={tasksHref} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
              Open all tasks
            </Link>
          )}
        </>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">Pick a day to see its tasks.</p>
      )}
    </aside>
  );
}

function TaskCard({ task, multiUser, clientsBase }: { task: CalendarTask; multiUser: boolean; clientsBase: string | null }) {
  const { icon: Icon, chip, dot } = KINDS[task.kind];
  const done = !isOpenTask(task.status);
  return (
    <div className={cn("space-y-1.5 rounded-control border-l-4 p-2.5 text-sm", chip, done && "opacity-60")}>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <span className={cn("size-2 rounded-full", dot)} aria-hidden />
        <Icon size={12} aria-hidden />
        {taskKindLabels[task.kind]}
        <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold", STATUS_PILL[task.status] ?? "bg-muted text-foreground")}>{titleCase(task.status.replace(/_/g, " "))}</span>
      </div>
      <p className={cn("text-foreground", done && "line-through")}>{task.description}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        {multiUser && <span className="font-medium text-foreground/80">{task.assignedName}</span>}
        {task.clientName &&
          (clientsBase && task.clientId ? (
            <Link href={`${clientsBase}/${task.clientId}`} className="hover:text-primary hover:underline">
              {task.clientName}
            </Link>
          ) : (
            <span>{task.clientName}</span>
          ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Week ───────────────────────── */

function WeekView({ anchor, today, byDate, multiUser, clientsBase }: { anchor: string; today: string; byDate: Map<string, CalendarTask[]>; multiUser: boolean; clientsBase: string | null }) {
  const start = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <div className="space-y-2">
      {days.map((date) => {
        const tasks = byDate.get(date) ?? [];
        const isToday = date === today;
        return (
          <section key={date} className={cn("flex flex-col gap-2 rounded-card border bg-card p-3 shadow-card sm:flex-row sm:gap-4", isToday ? "border-ring/70 ring-1 ring-ring/40" : "border-border")} aria-label={fmt(date, { weekday: "long", month: "long", day: "numeric" })}>
            <header className="flex shrink-0 items-baseline gap-2 sm:w-20 sm:flex-col sm:items-start sm:gap-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{fmt(date, { weekday: "short" })}</span>
              <span className={cn("flex items-center gap-1.5 text-xl font-semibold tabular-nums", isToday ? "text-primary" : "text-foreground")}>
                {parse(date).getUTCDate()}
                {isToday && <span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-semibold uppercase text-primary-foreground">Today</span>}
              </span>
            </header>
            {tasks.length === 0 ? (
              <p className="self-center text-xs text-muted-foreground">No tasks</p>
            ) : (
              <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
                {tasks.map((t) => (
                  <TaskCard key={t.id} task={t} multiUser={multiUser} clientsBase={clientsBase} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Year ───────────────────────── */

function YearView({ year, today, kindsByDate, onDay, onMonth }: { year: string; today: string; kindsByDate: Map<string, TaskKind[]>; onDay: (d: string) => void; onMonth: (m: string) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 12 }, (_, m) => {
        const first = `${year}-${String(m + 1).padStart(2, "0")}-01`;
        const days = monthGrid(first);
        return (
          <section key={first} className="rounded-card border border-border bg-card p-3 shadow-card">
            <button type="button" onClick={() => onMonth(first)} className="mb-2 cursor-pointer text-sm font-semibold text-foreground hover:text-primary">
              {fmt(first, { month: "long" })}
            </button>
            <div className="grid grid-cols-7 text-center text-[10px] font-medium text-muted-foreground">
              {WEEKDAYS.map((d) => (
                <span key={d} className="pb-1">
                  {d[0]}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((date) => {
                const inMonth = date.startsWith(first.slice(0, 7));
                if (!inMonth) return <span key={date} />;
                const kinds = [...new Set(kindsByDate.get(date) ?? [])];
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => onDay(date)}
                    aria-label={`${fmt(date, { month: "long", day: "numeric" })}${kinds.length ? `, ${kinds.length} task ${kinds.length === 1 ? "type" : "types"}` : ""}`}
                    className={cn("flex h-9 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md text-[11px] tabular-nums outline-none hover:bg-subtle focus-visible:ring-2 focus-visible:ring-ring", date === today ? "font-bold text-primary" : "text-foreground")}
                  >
                    {parse(date).getUTCDate()}
                    <span className="flex h-1.5 gap-px" aria-hidden>
                      {kinds.slice(0, 3).map((k) => (
                        <span key={k} className={cn("size-1.5 rounded-full", KINDS[k].dot)} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
