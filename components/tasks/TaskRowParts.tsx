"use client";

import Link from "next/link";
import { Calendar, ListTodo, Loader2, MessageSquareText, Package, UserPlus, Wallet } from "lucide-react";
import type { ActionTask } from "@/components/tasks/TaskActions";
import { enquiryRef } from "@/types/enquiry";
import { cn, formatDate, titleCase } from "@/lib/utils";
import { isOpenTask, taskKindLabels, taskStatuses, type TaskKind } from "@/types/task";

/** Row building blocks shared by the salesman and manager task tables. */
export type RowTask = ActionTask & { due_date: Date | string };

const KIND_BADGE: Record<TaskKind, { icon: typeof ListTodo; className: string }> = {
  general: { icon: ListTodo, className: "bg-muted text-muted-foreground" },
  lead_follow_up: { icon: UserPlus, className: "bg-success-soft text-success-foreground" },
  enquiry_follow_up: { icon: MessageSquareText, className: "bg-warning-soft text-warning-foreground" },
  order_follow_up: { icon: Package, className: "bg-info-soft text-info-foreground" },
  payment_follow_up: { icon: Wallet, className: "bg-primary-soft text-primary-soft-foreground" },
};

const STATUS_SELECT_COLORS: Record<string, string> = {
  pending: "bg-muted text-foreground",
  in_process: "bg-info-soft text-info-foreground",
  achieved: "bg-success-soft text-success-foreground",
  unsuccessful: "bg-danger-soft text-danger-foreground",
};

export function KindBadge({ task }: { task: RowTask }) {
  const kind = task.kind ?? (task.enquiry ? "enquiry_follow_up" : "general");
  const badge = KIND_BADGE[kind];
  const Icon = badge.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", badge.className)}>
      <Icon size={11} aria-hidden />
      {task.enquiry ? `${taskKindLabels[kind]} · ${enquiryRef(task.enquiry.id, task.enquiry.prefix)}` : taskKindLabels[kind]}
    </span>
  );
}

/** Red within 2 days (or overdue), amber within a week — only while the task is still open. */
export function DueDate({ task, now }: { task: RowTask; now: number }) {
  const open = isOpenTask(task.status);
  const days = Math.ceil((new Date(task.due_date).getTime() - now) / (1000 * 60 * 60 * 24));
  const tone = !open
    ? "text-muted-foreground"
    : days <= 2
      ? "font-medium text-danger-foreground"
      : days <= 7
        ? "font-medium text-warning-foreground"
        : "text-foreground";
  return (
    <span className={cn("inline-flex flex-col items-start gap-1 whitespace-nowrap tabular-nums", tone)}>
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={13} className="shrink-0 opacity-70" aria-hidden />
        {formatDate(task.due_date)}
      </span>
      {open && days < 0 && <span className="rounded-full bg-danger-soft px-1.5 py-px text-[10px] font-semibold">Overdue</span>}
    </span>
  );
}

/** True when some row shows TaskActions' inline buttons (lead outcomes / enquiry links), so the actions column needs room. */
export const hasInlineActions = (tasks: RowTask[]) =>
  tasks.some((t) => isOpenTask(t.status) && (t.kind === "lead_follow_up" || (t.kind === "enquiry_follow_up" && !!t.enquiry)));

export function StatusSelect({ task, updating, onChange }: { task: RowTask; updating: boolean; onChange: (status: string) => void }) {
  return (
    <div className="relative inline-flex items-center gap-1.5">
      <select
        value={task.status}
        onChange={(e) => onChange(e.target.value)}
        disabled={updating}
        aria-label={`Update status for ${task.description}`}
        className={cn(
          "cursor-pointer appearance-none rounded-full py-1 pl-2.5 pr-7 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-wait disabled:opacity-60",
          STATUS_SELECT_COLORS[task.status] ?? STATUS_SELECT_COLORS.pending,
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
        }}
      >
        {taskStatuses.map((status) => (
          <option key={status} value={status}>
            {titleCase(status)}
          </option>
        ))}
      </select>
      {updating && <Loader2 size={14} className="animate-spin text-muted-foreground" aria-label="Saving" />}
    </div>
  );
}

/** Client the task is about, linked to its page. */
export function ClientChip({ task, clientsPath }: { task: RowTask; clientsPath: string }) {
  if (!task.clientName) return null;
  return task.clientId ? (
    <Link href={`${clientsPath}/${task.clientId}`} className="truncate text-xs font-medium text-muted-foreground hover:text-primary hover:underline">
      · {task.clientName}
    </Link>
  ) : (
    <span className="truncate text-xs font-medium text-muted-foreground">· {task.clientName}</span>
  );
}
