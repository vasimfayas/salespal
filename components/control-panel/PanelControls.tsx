"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { resolveAllErrors, reverseImportBatch, setDeploymentNote, setErrorStatus } from "@/lib/actions/control-panel-actions";

export type PanelTab = "imports" | "deployments" | "errors";

export function PanelTabs({ tab, counts }: { tab: PanelTab; counts: { errors: number } }) {
  const { set } = useUrlFilters();
  return (
    <FilterTabs
      label="Control panel sections"
      value={tab}
      onChange={(value) => set({ tab: value === "imports" ? null : value, status: null })}
      tabs={[
        { value: "imports", label: "Imports" },
        { value: "deployments", label: "Deployments" },
        { value: "errors", label: "Errors", count: counts.errors },
      ]}
    />
  );
}

export function PanelPager({ page, pageSize, total, noun }: { page: number; pageSize: number; total: number; noun: string }) {
  const { set, isPending } = useUrlFilters();
  return <Pagination page={page} pageSize={pageSize} total={total} noun={noun} pending={isPending} onPage={(p) => set({ page: p })} />;
}

export function ErrorStatusFilter({ status }: { status: "open" | "resolved" | "all" }) {
  const { set } = useUrlFilters();
  return (
    <FilterTabs
      label="Error status"
      value={status}
      onChange={(value) => set({ status: value === "open" ? null : value })}
      tabs={[
        { value: "open", label: "Open" },
        { value: "resolved", label: "Resolved" },
        { value: "all", label: "All" },
      ]}
    />
  );
}

export function ReverseImportButton({ id, label, imported }: { id: number; label: string; imported: number }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function run() {
    start(async () => {
      const res = await reverseImportBatch(id);
      setResult(
        res.success
          ? { ok: true, message: `${res.removed} client${res.removed === 1 ? "" : "s"} removed${res.kept ? `, ${res.kept} kept because they already have enquiries, orders, approvals or departments` : ""}.` }
          : { ok: false, message: res.error },
      );
    });
  }
  const close = () => {
    if (pending) return;
    setOpen(false);
    setResult(null);
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)} disabled={imported === 0}>
        <Undo2 /> Reverse
      </Button>
      <Modal open={open} onClose={close} size="sm">
        <h3 className="text-base font-semibold text-foreground">Reverse this import?</h3>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        {result ? (
          <p className={`mt-4 rounded-control border p-3 text-sm ${result.ok ? "border-success/30 bg-success-soft text-success-foreground" : "border-danger/30 bg-danger-soft text-danger-foreground"}`}>{result.message}</p>
        ) : (
          <p className="mt-4 text-sm text-foreground/85">
            The {imported} client{imported === 1 ? "" : "s"} created by this import will be deleted along with their history, contacts and tasks. Clients that already have enquiries, orders, approval requests or departments are kept. This can’t be undone.
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={close} disabled={pending}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button size="sm" onClick={run} disabled={pending} className="bg-danger text-white hover:bg-danger/90">
              {pending && <Loader2 className="animate-spin" />} Reverse import
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}

export function ErrorActions({ id, status }: { id: number; status: string }) {
  const [pending, start] = useTransition();
  const resolved = status === "resolved";
  return (
    <Button size="sm" variant="secondary" disabled={pending} onClick={() => start(async () => void (await setErrorStatus(id, resolved ? "open" : "resolved")))}>
      {pending ? <Loader2 className="animate-spin" /> : resolved ? <RotateCcw /> : <CheckCircle2 />}
      {resolved ? "Reopen" : "Resolve"}
    </Button>
  );
}

export function ResolveAllButton({ open }: { open: number }) {
  const [pending, start] = useTransition();
  if (open === 0) return null;
  return (
    <Button size="sm" variant="secondary" disabled={pending} onClick={() => start(async () => void (await resolveAllErrors()))}>
      {pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Resolve all ({open})
    </Button>
  );
}

/** Saves on blur / Enter; shows a quick "Saved". */
export function DeploymentNote({ id, note }: { id: number; note: string | null }) {
  const [value, setValue] = useState(note ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const save = () => {
    if (value.trim() === (note ?? "")) return;
    start(async () => {
      await setDeploymentNote(id, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };
  return (
    <div className="flex items-center gap-2">
      <input
        aria-label="Deployment note"
        value={value}
        maxLength={500}
        placeholder="Add a note (what changed, who deployed)…"
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className="h-8 w-full min-w-0 rounded-control border border-transparent bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 hover:border-border focus:border-ring focus:bg-card focus:ring-3 focus:ring-ring/15"
      />
      <span className="w-12 shrink-0 text-xs text-muted-foreground" aria-live="polite">
        {pending ? "Saving…" : saved ? "Saved" : ""}
      </span>
    </div>
  );
}
