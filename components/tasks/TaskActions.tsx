"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, CheckCircle2, ExternalLink, History, Loader2, MessageSquareText, PhoneCall, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { isActiveEnquiry } from "@/types/enquiry";
import { isOpenTask, leadOutcomeLabels, type LeadOutcome, type TaskKind } from "@/types/task";

/** The task fields the action cell needs (shared by the salesman and manager task lists). */
export type ActionTask = {
  id: number;
  description: string;
  status: string;
  kind?: TaskKind;
  clientId?: number | null;
  clientName?: string | null;
  isClientTask?: boolean;
  enquiry?: { id: number; status: string; prefix?: string | null } | null;
  outcome?: string | null;
};

const OUTCOME_TONE: Record<string, string> = {
  contacted: "bg-success-soft text-success-foreground",
  follow_up: "bg-info-soft text-info-foreground",
  rejected: "bg-danger-soft text-danger-foreground",
};

/** True for tasks whose status is driven by an outcome (no free status dropdown). */
export function isGuidedTask(task: ActionTask) {
  return task.kind === "lead_follow_up" || (task.kind === "enquiry_follow_up" && !!task.enquiry);
}

/** Read-only status pill for guided tasks. */
export function TaskStatusPill({ task }: { task: ActionTask }) {
  const open = isOpenTask(task.status);
  // The outcome is the status while it describes the task's state: follow-up only while still open,
  // contacted / rejected once closed. A follow-up task closed some other way (e.g. reassigned) is just "Closed".
  const outcome = task.outcome && (open ? task.outcome === "follow_up" : task.outcome !== "follow_up") ? task.outcome : null;
  const label = outcome ? leadOutcomeLabels[outcome as LeadOutcome] : open ? (task.status === "in_process" ? "In progress" : "Pending") : task.status === "achieved" ? "Done" : "Closed";
  const tone = outcome ? OUTCOME_TONE[outcome] : open ? "bg-muted text-foreground" : task.status === "achieved" ? "bg-success-soft text-success-foreground" : "bg-muted text-muted-foreground";
  return <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium", tone)}>{label}</span>;
}

/**
 * What a person can do with a task:
 *  - lead follow-up → Contacted / Follow-up / Rejected (updates the client)
 *  - enquiry follow-up → log a follow-up, or open the enquiry to move it on / close it with a reason
 *  - any task → its history
 */
export function TaskActions({ task, enquiriesPath }: { task: ActionTask; enquiriesPath: string }) {
  const [outcome, setOutcome] = useState<LeadOutcome | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const open = isOpenTask(task.status);
  const canHaveHistory = !task.isClientTask;

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {task.kind === "lead_follow_up" && open && task.clientId && (
        <>
          <Button size="sm" variant="soft" onClick={() => setOutcome("contacted")}>
            <PhoneCall /> Contacted
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setOutcome("follow_up")}>
            <CalendarClock /> Follow-up
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOutcome("rejected")} className="hover:bg-danger-soft hover:text-danger-foreground">
            <XCircle /> Rejected
          </Button>
        </>
      )}
      {task.kind === "enquiry_follow_up" && open && task.enquiry && isActiveEnquiry(task.enquiry.status) && (
        <>
          <Link href={`${enquiriesPath}?followUp=${task.enquiry.id}`} className={buttonVariants({ size: "sm" })}>
            <MessageSquareText /> Follow up
          </Link>
          <Link href={`${enquiriesPath}?view=${task.enquiry.id}`} className={buttonVariants({ size: "sm", variant: "secondary" })} title="Move to the next stage or close it with a reason">
            <ExternalLink /> Open enquiry
          </Link>
        </>
      )}
      {canHaveHistory && (
        <Button size="icon-sm" variant="ghost" onClick={() => setHistoryOpen(true)} aria-label={`History of ${task.description}`} title="History">
          <History />
        </Button>
      )}

      {outcome && task.clientId && (
        <LeadOutcomeDialog task={task} clientId={task.clientId} outcome={outcome} onClose={() => setOutcome(null)} />
      )}
      {historyOpen && <TaskHistoryDialog task={task} onClose={() => setHistoryOpen(false)} />}
    </div>
  );
}

/* ───────────────────────── Outcome dialog ───────────────────────── */

const todayPlus = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

function LeadOutcomeDialog({ task, clientId, outcome, onClose }: { task: ActionTask; clientId: number; outcome: LeadOutcome; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ contact_person_name: "", contact_no: "", contact_person_designation: "", mail_id: "", note: "", due_date: todayPlus(7) });
  const [loaded, setLoaded] = useState(outcome !== "contacted");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  // Contacted: start from the client's current contact details so only what changed needs typing.
  if (!loaded && !fetching) {
    setFetching(true);
    fetch(`/api/clients/${clientId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const c = data?.client;
        if (c) {
          setForm((f) => ({
            ...f,
            contact_person_name: c.contact_person_name && c.contact_person_name !== "-" ? c.contact_person_name : "",
            contact_no: c.contact_no && c.contact_no !== "-" ? c.contact_no : "",
            contact_person_designation: c.contact_person_designation ?? "",
            mail_id: c.mail_id ?? "",
          }));
        }
      })
      .finally(() => setLoaded(true));
  }

  const copy = {
    contacted: { title: "Mark as contacted", description: `Who did you reach at ${task.clientName ?? "the client"}? Saving updates the client's contact details.`, cta: "Save — contacted" },
    follow_up: { title: "Plan a follow-up", description: "Why it needs another follow-up, and when. The task's due date moves to that day.", cta: "Save follow-up" },
    rejected: { title: "Reject this lead", description: "Why the lead isn't going forward. The client is marked lost with this reason.", cta: "Reject lead" },
  }[outcome];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${task.id}/outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't save the outcome");
      toast.success(
        outcome === "contacted" ? `${task.clientName ?? "Client"} marked contacted` : outcome === "follow_up" ? `Follow-up set for ${formatDate(form.due_date)}` : "Lead rejected",
      );
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the outcome");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose}>
      <form onSubmit={submit}>
        <ModalHeader
          title={copy.title}
          description={copy.description}
          onClose={onClose}
          icon={outcome === "contacted" ? <PhoneCall /> : outcome === "follow_up" ? <CalendarClock /> : <XCircle />}
        />
        {error && <p role="alert" className="mb-4 rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">{error}</p>}

        {outcome === "contacted" &&
          (!loaded ? (
            <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading client details…</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="oc-person" label="Contact person" required autoFocus value={form.contact_person_name} onChange={(e) => setForm({ ...form, contact_person_name: e.target.value })} />
              <Input id="oc-designation" label="Designation" required value={form.contact_person_designation} onChange={(e) => setForm({ ...form, contact_person_designation: e.target.value })} placeholder="e.g. Logistics Manager" />
              <Input id="oc-phone" label="Phone" type="tel" required value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} placeholder="+974 …" />
              <Input id="oc-email" label="Email (optional)" type="email" value={form.mail_id} onChange={(e) => setForm({ ...form, mail_id: e.target.value })} />
              <div className="sm:col-span-2">
                <Textarea id="oc-note" label="Note (optional)" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="What was discussed" />
              </div>
            </div>
          ))}

        {outcome === "follow_up" && (
          <div className="space-y-4">
            <Textarea id="oc-reason" label="Reason" required autoFocus rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Asked to call back after their budget meeting" />
            <div className="sm:w-56">
              <Input id="oc-due" label="Follow up on" type="date" required min={todayPlus(1)} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
          </div>
        )}

        {outcome === "rejected" && (
          <Textarea id="oc-reason" label="Reason" required autoFocus rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Already has a forwarder under contract" />
        )}

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant={outcome === "rejected" ? "danger" : "primary"} loading={saving} disabled={!loaded}>
            {outcome === "contacted" && !saving && <CheckCircle2 />}
            {copy.cta}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

/* ───────────────────────── History dialog ───────────────────────── */

type HistoryItem = { id: number; action: string; note: string | null; prev_due_date: string | null; new_due_date: string | null; by: string; at: string };

const ACTION_LABELS: Record<string, string> = {
  contacted: "Contacted",
  follow_up: "Follow-up planned",
  rejected: "Rejected",
  enquiry_follow_up: "Enquiry followed up",
  enquiry_stage: "Enquiry moved on",
  enquiry_closed: "Enquiry closed",
  reassigned: "Reassigned",
  status: "Status changed",
};

function TaskHistoryDialog({ task, onClose }: { task: ActionTask; onClose: () => void }) {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [requested, setRequested] = useState(false);
  if (!requested) {
    setRequested(true);
    fetch(`/api/tasks/${task.id}/updates`)
      .then((r) => (r.ok ? r.json() : { updates: [] }))
      .then((d) => setItems(d.updates ?? []))
      .catch(() => setItems([]));
  }

  return (
    <Modal open onClose={onClose} closeOnBackdrop>
      <ModalHeader title="Task history" description={task.description} onClose={onClose} icon={<History />} />
      {items === null ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading…</p>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Nothing recorded on this task yet.</p>
      ) : (
        <ol className="max-h-[55vh] space-y-4 overflow-y-auto border-l border-border pl-4">
          {items.map((u) => (
            <li key={u.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-border-strong" aria-hidden />
              <p className="text-sm font-medium text-foreground">{ACTION_LABELS[u.action] ?? u.action}</p>
              {u.note && <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground/80">{u.note}</p>}
              {u.new_due_date && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Due {u.prev_due_date ? `${formatDate(u.prev_due_date)} → ` : ""}{formatDate(u.new_due_date)}
                </p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{u.by} · {formatDateTime(u.at)}</p>
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}
