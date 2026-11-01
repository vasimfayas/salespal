"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { endLeave, extendLeave, getLeaveInfo, startLeave, type LeaveInfo } from "@/lib/actions/leave-actions";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Shown next to the button: the person's current or next leave. */
export type LeaveBadge = { state: "active" | "upcoming"; start: string; end: string; coverName: string; /** Planned length, inclusive. */ days: number };

const today = () => new Date().toISOString().slice(0, 10);

/** "Leave" action for a manager / salesman row: mark on leave with a cover, end it early, see history and days taken. */
export function LeaveButton({ userId, name, badge, compact }: { userId: number; name: string; badge?: LeaveBadge; compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<LeaveInfo | null>(null);
  const [form, setForm] = useState({ coverId: "", start: today(), end: today() });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Leave whose end date is being changed, and the new date.
  const [extending, setExtending] = useState<{ id: number; end: string } | null>(null);

  async function load() {
    const res = await getLeaveInfo(userId);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setInfo(res.info);
  }

  function show() {
    setOpen(true);
    setError(null);
    setInfo(null);
    setExtending(null);
    setForm({ coverId: "", start: today(), end: today() });
    void load();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await startLeave({ userId, coverId: Number(form.coverId), start: form.start, end: form.end });
    setSaving(false);
    if (!res.success) return setError(res.error);
    toast.success(`${name} is on leave from ${formatDate(form.start)} to ${formatDate(form.end)}`);
    setOpen(false);
    router.refresh();
  }

  async function end(leaveId: number, upcoming: boolean) {
    if (!confirm(upcoming ? `Cancel this leave for ${name}?` : `Mark ${name} as back today? Their cover loses access straight away.`)) return;
    const res = await endLeave(leaveId);
    if (!res.success) return toast.error(res.error);
    toast.success(upcoming ? "Leave cancelled" : `${name} is back`);
    await load();
    router.refresh();
  }

  async function saveExtend() {
    if (!extending) return;
    setError(null);
    const res = await extendLeave(extending.id, extending.end);
    if (!res.success) return setError(res.error);
    toast.success(`${name}'s leave now ends ${formatDate(extending.end)}`);
    setExtending(null);
    await load();
    router.refresh();
  }

  const open_ = info?.leaves.filter((l) => l.state !== "ended") ?? [];
  const isManager = info?.user.role_id === 2;

  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        {badge && (
          <span
            className={cn(
              "inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
              badge.state === "active" ? "bg-warning-soft text-warning-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {badge.state === "active" ? "On leave" : "Upcoming leave"} {formatDate(badge.start)} – {formatDate(badge.end)} ({badge.days}d)
            <span className="font-normal">&nbsp;· replacement: {badge.coverName}</span>
          </span>
        )}
        <Button variant="ghost" size={compact ? "sm" : "icon-sm"} onClick={show} aria-label={`Leave for ${name}`} title="Leave">
          <Plane />
          {compact && <span>Leave</span>}
        </Button>
      </span>

      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <ModalHeader
            icon={<Plane />}
            title={`Leave: ${name}`}
            description="While they're away, the cover sees and works their clients, enquiries, tasks and approvals. Nothing is reassigned, so access ends when they're back."
            onClose={() => setOpen(false)}
          />
          {error && (
            <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm font-medium text-danger-foreground">
              {error}
            </p>
          )}
          {!info && !error && <p className="text-sm text-muted-foreground">Loading…</p>}

          {info && (
            <>
              {open_.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-control border border-border bg-subtle px-3 py-2 text-sm">
                  <span>
                    <span className="font-medium text-foreground">{l.state === "active" ? "On leave" : "Upcoming"}</span>{" "}
                    {formatDate(l.start)} – {formatDate(l.end)} · covered by {l.coverName}
                  </span>
                  <span className="flex gap-1.5">
                    <Button type="button" size="sm" variant="secondary" onClick={() => setExtending({ id: l.id, end: l.end })}>
                      Extend
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => end(l.id, l.state === "upcoming")}>
                      {l.state === "active" ? "Back today" : "Cancel"}
                    </Button>
                  </span>
                  {extending?.id === l.id && (
                    <div className="flex w-full flex-wrap items-end gap-2">
                      <Input
                        id={`leave-extend-${l.id}`}
                        label="New last day away"
                        type="date"
                        min={l.start > today() ? l.start : today()}
                        value={extending.end}
                        onChange={(e) => setExtending({ id: l.id, end: e.target.value })}
                      />
                      <Button type="button" size="sm" onClick={saveExtend} disabled={!extending.end || extending.end === l.end}>
                        Save date
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setExtending(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              <Select
                id={`leave-cover-${userId}`}
                label={isManager ? "Cover (another manager)" : "Cover (another salesman)"}
                required
                value={form.coverId}
                onChange={(e) => setForm({ ...form, coverId: e.target.value })}
              >
                <option value="">Select…</option>
                {info.candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {info.candidates.length === 0 && (
                <p className="text-xs text-muted-foreground">No other {isManager ? "manager" : "salesman"} works for the same company.</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <Input id={`leave-start-${userId}`} label="From" type="date" required value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
                <Input id={`leave-end-${userId}`} label="Until (last day away)" type="date" required min={form.start} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">
                  History · {info.totalDays} day{info.totalDays === 1 ? "" : "s"} on leave
                </p>
                {info.leaves.length === 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">No leave recorded yet.</p>
                ) : (
                  <ul className="mt-1 max-h-40 divide-y divide-border overflow-y-auto text-xs text-muted-foreground">
                    {info.leaves.map((l) => (
                      <li key={l.id} className="flex justify-between gap-2 py-1.5">
                        <span>
                          {formatDate(l.start)} – {formatDate(l.end)}
                          {l.returnedAt && ` (back ${formatDate(l.returnedAt)})`} · {l.coverName}
                        </span>
                        <span className="shrink-0 font-medium text-foreground">{l.days}d</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="submit" loading={saving} disabled={!info || !form.coverId}>
              Put on leave
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
