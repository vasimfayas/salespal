import { Check, Clock, X } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { APPROVAL_FLOWS, STEP_LABELS, stepLabel, type ApprovalLogEntry, type ApprovalType } from "@/types/approval";

const ACTION_LABEL: Record<string, string> = { submitted: "Requested", approved: "Approved", rejected: "Rejected", cancelled: "Cancelled" };

/** The flow's steps with where the request is, then the log of every action. */
export function ApprovalTimeline({
  type,
  status,
  currentStep,
  log,
}: {
  type: ApprovalType;
  status: string;
  currentStep: number;
  log: ApprovalLogEntry[];
}) {
  const steps = APPROVAL_FLOWS[type].steps;
  const stateOf = (i: number) =>
    status === "approved" || i < currentStep ? "done" : i === currentStep ? (status === "rejected" ? "rejected" : status === "pending" ? "current" : "idle") : "idle";

  return (
    <div className="space-y-3">
      <ol className="flex flex-wrap items-center gap-1.5" aria-label="Approval steps">
        {steps.map((key, i) => {
          const state = stateOf(i);
          return (
            <li key={key} className="flex items-center gap-1.5">
              {i > 0 && <span className="h-px w-4 bg-border" aria-hidden />}
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  state === "done" && "bg-success-soft text-success-foreground",
                  state === "current" && "bg-warning-soft text-warning-foreground",
                  state === "rejected" && "bg-danger-soft text-danger-foreground",
                  state === "idle" && "bg-muted text-muted-foreground",
                )}
              >
                {state === "done" ? <Check size={11} aria-hidden /> : state === "rejected" ? <X size={11} aria-hidden /> : state === "current" ? <Clock size={11} aria-hidden /> : null}
                {STEP_LABELS[key]}
                <span className="sr-only">: {state === "done" ? "approved" : state === "current" ? "waiting" : state === "rejected" ? "rejected" : "not yet"}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <ul className="space-y-1.5 border-l border-border pl-3 text-xs">
        {log.map((entry) => (
          <li key={entry.id} className="text-muted-foreground">
            <span
              className={cn(
                "font-semibold",
                entry.action === "approved" ? "text-success-foreground" : entry.action === "rejected" ? "text-danger-foreground" : "text-foreground",
              )}
            >
              {ACTION_LABEL[entry.action] ?? entry.action}
            </span>
            {entry.step >= 0 && <> · {stepLabel(type, entry.step)}</>} · {entry.actor} · {formatDateTime(entry.created_at)}
            {entry.comment && <span className="block text-foreground">“{entry.comment}”</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
