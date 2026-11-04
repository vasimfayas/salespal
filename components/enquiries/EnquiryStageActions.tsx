"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RefreshCw, Send, Tag, XCircle } from "lucide-react";
import { SendToAgentDialog } from "@/components/enquiries/SendToAgentDialog";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { LostReasonDialog } from "@/components/shared/LostReasonDialog";
import { formatAmount } from "@/lib/utils";
import type { EnquiryListItem } from "@/types/enquiry";
import { AgentQuotes } from "@/components/enquiries/AgentQuotes";

export type Action = "send_agent" | "quote" | "requote" | "confirm" | "lose";

async function stage(id: number, body: Record<string, unknown>) {
  const res = await fetch(`/api/enquiries/${id}/stage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to update enquiry");
  return data as { status: string; orderId: number | null; reopened?: boolean; approvalRequested?: boolean };
}

/** The order a re-confirmation will reopen: the latest order event was a revision request (events are newest first). */
function orderToReopen(enquiry: EnquiryListItem): number | null {
  const last = enquiry.events.find((ev) => ev.order_id && ["confirmed", "order_reopened", "revision_requested", "order_cancelled"].includes(ev.action));
  return last?.action === "revision_requested" ? last.order_id : null;
}

/** Which stage moves are offered from each status (the server enforces the same table). */
export function availableActions(status: string): Action[] {
  switch (status) {
    // Waiting for the client to fill in the form; it can still be closed as lost.
    case "sent_to_client":
      return ["lose"];
    // Get a rate from an agent by email, or quote it yourself.
    case "inquiry_received":
    case "with_agent":
      return ["send_agent", "quote", "lose"];
    case "quoted":
      return ["requote", "confirm", "lose"];
    // The order was sent back: requote, or confirm again to reopen it as it was.
    case "revision_requested":
      return ["requote", "confirm", "lose"];
    default:
      return [];
  }
}

/** Buttons shown inline in a table row: both ways to get a rate before quoting, else the single next step. */
export function rowActions(status: string): Action[] {
  if (status === "inquiry_received" || status === "with_agent") return ["send_agent", "quote"];
  const next = primaryAction(status);
  return next ? [next] : [];
}

/** The single most likely next step. */
export function primaryAction(status: string): Action | null {
  return ({ inquiry_received: "quote", with_agent: "quote", quoted: "confirm", revision_requested: "requote" } as Record<string, Action>)[status] ?? null;
}

const META: Record<Action, { label: string; icon: typeof Tag }> = {
  send_agent: { label: "Send to agent", icon: Send },
  quote: { label: "Quote", icon: Tag },
  requote: { label: "Requote", icon: RefreshCw },
  confirm: { label: "Order", icon: CheckCircle2 },
  lose: { label: "Mark lost", icon: XCircle },
};

/**
 * Enquiry stage buttons + their dialogs.
 * `only` limits the buttons (e.g. just the primary action in a table row).
 */
export function EnquiryStageActions({
  enquiry,
  only,
  size = "sm",
  onDone,
  onBeforeOpen,
}: {
  enquiry: EnquiryListItem;
  only?: Action[];
  size?: "sm" | "md";
  onDone: (message: string) => void;
  /** Called before a dialog opens (e.g. to close a surrounding sheet). */
  onBeforeOpen?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<Action | null>(null);
  // Confirming waits for a manager's approval of the quote (pending), or a requote after a rejection.
  const blocked = enquiry.approval_required && (enquiry.approval_status === "pending" || enquiry.approval_status === "rejected");
  // A quick enquiry can only be marked lost until its full details are saved.
  const actions = availableActions(enquiry.status).filter(
    (a) => (!only || only.includes(a)) && !(a === "confirm" && blocked) && !(enquiry.details_pending && a !== "lose"),
  );
  if (actions.length === 0) return null;

  function start(action: Action) {
    onBeforeOpen?.();
    setOpen(action);
  }

  return (
    <>
      {actions.map((action) => {
        const { label, icon: Icon } = META[action];
        const lose = action === "lose";
        return (
          <Button
            key={action}
            size={size}
            variant={lose ? "ghost" : action === "confirm" || (only && action !== "send_agent") ? "primary" : "secondary"}
            className={cn(
              lose && "text-danger-foreground hover:bg-danger-soft hover:text-danger-foreground",
              action === "confirm" && "bg-success text-white hover:bg-success/90 dark:text-foreground",
              (action === "quote" || action === "requote") && "bg-warning text-white hover:bg-warning/90 dark:text-foreground",
            )}
            onClick={(e) => {
              e.stopPropagation();
              start(action);
            }}
          >
            <Icon /> {label}
          </Button>
        );
      })}

      <FiguresDialog
        enquiry={enquiry}
        mode={open === "quote" || open === "requote" ? open : null}
        onClose={() => setOpen(null)}
        onSaved={(msg) => {
          setOpen(null);
          onDone(msg);
          router.refresh();
        }}
        onChanged={() => router.refresh()}
      />
      <SendToAgentDialog
        enquiry={enquiry}
        open={open === "send_agent"}
        onClose={() => setOpen(null)}
        onSent={() => router.refresh()}
      />
      <ConfirmDialog
        enquiry={enquiry}
        open={open === "confirm"}
        onClose={() => setOpen(null)}
        onSaved={(msg) => {
          setOpen(null);
          onDone(msg);
          router.refresh();
        }}
      />
      <LostReasonDialog
        open={open === "lose"}
        title={`Mark ${enquiry.ref} as lost`}
        description={`${enquiry.client_name} · ${enquiry.from} → ${enquiry.to}`}
        confirmLabel="Mark lost"
        onClose={() => setOpen(null)}
        onConfirm={async (reason, remark) => {
          await stage(enquiry.id, { action: "lose", reason, remark });
          setOpen(null);
          onDone(`${enquiry.ref} marked lost`);
          router.refresh();
        }}
      />
    </>
  );
}

function FiguresDialog({
  enquiry,
  mode,
  onClose,
  onSaved,
  onChanged,
}: {
  enquiry: EnquiryListItem;
  mode: "quote" | "requote" | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
  onChanged: () => void;
}) {
  return (
    <Dialog open={!!mode} onOpenChange={(o) => !o && onClose()}>
      {mode && (
        <DialogContent
          size="lg"
          title={mode === "quote" ? `Quote ${enquiry.ref}` : `Requote ${enquiry.ref}`}
          description={
            mode === "quote"
              ? `${enquiry.client_name} · ${enquiry.from} → ${enquiry.to}`
              : `Current quote: cost ${formatAmount(enquiry.provisional_cost ?? 0)} · profit ${formatAmount(enquiry.provisional_profit ?? 0)}. The old figures are kept in the history.`
          }
        >
          <AgentQuotes key={`${enquiry.id}-${mode}`} enquiry={enquiry} mode={mode} onClose={onClose} onSaved={onSaved} onChanged={onChanged} />
        </DialogContent>
      )}
    </Dialog>
  );
}

function ConfirmDialog({ enquiry, open, onClose, onSaved }: { enquiry: EnquiryListItem; open: boolean; onClose: () => void; onSaved: (msg: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = (enquiry.provisional_cost ?? 0) + (enquiry.provisional_profit ?? 0);
  const reopenId = orderToReopen(enquiry);
  const orderNo = (id: number | null) => `#${String(id).padStart(5, "0")}`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      {open && (
        <DialogContent title={`Confirm ${enquiry.ref}`} description={
            reopenId
              ? `The client accepted the revised offer. Order ${orderNo(reopenId)} is reopened in Transit with the new amount; its job no, invoice details and payments are kept.`
              : "The client accepted the offer. This creates the order (status Transit) for accounts to process."
          }
        >
          <DialogBody className="space-y-3">
            {error && <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{error}</p>}
            <dl className="grid grid-cols-2 gap-3 rounded-control border border-border p-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Client</dt><dd className="font-medium text-foreground">{enquiry.client_name}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Route</dt><dd className="font-medium text-foreground">{enquiry.from} → {enquiry.to}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Cost / profit</dt><dd className="font-medium tabular-nums text-foreground">{formatAmount(enquiry.provisional_cost ?? 0)} / {formatAmount(enquiry.provisional_profit ?? 0)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Order amount</dt><dd className="font-semibold tabular-nums text-foreground">{formatAmount(total)}</dd></div>
            </dl>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>Back</Button>
            <Button
              loading={saving}
              onClick={async () => {
                setSaving(true);
                setError(null);
                try {
                  const res = await stage(enquiry.id, { action: "confirm" });
                  onSaved(
                    res.approvalRequested
                      ? `${enquiry.ref} needs manager approval first — sent to the manager's queue`
                      : `${enquiry.ref} confirmed · order ${orderNo(res.orderId)} ${res.reopened ? "reopened" : "created"}`,
                  );
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed to confirm");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <CheckCircle2 /> {reopenId ? "Confirm & reopen order" : "Confirm & create order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
