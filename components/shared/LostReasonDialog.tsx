"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { lostReasonLabels, lostReasons, type LostReason } from "@/types/enquiry";

/** Asks why an enquiry / order was lost: one reason from the list plus an optional remark. */
export function LostReasonDialog({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onClose: () => void;
  /** Throw to show the error inline. */
  onConfirm: (reason: LostReason, remark: string) => Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      {open && (
        <DialogContent title={title} description={description}>
          <LostReasonForm confirmLabel={confirmLabel} onClose={onClose} onConfirm={onConfirm} />
        </DialogContent>
      )}
    </Dialog>
  );
}

function LostReasonForm({ confirmLabel, onClose, onConfirm }: { confirmLabel: string; onClose: () => void; onConfirm: (reason: LostReason, remark: string) => Promise<void> }) {
  const [reason, setReason] = useState<LostReason | null>(null);
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!reason) return setError("Pick why it was lost.");
        setSaving(true);
        setError(null);
        try {
          await onConfirm(reason, remark.trim());
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setSaving(false);
        }
      }}
    >
      <DialogBody className="space-y-4">
        {error && <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger-foreground">{error}</p>}
        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium text-foreground">Reason</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {lostReasons.map((r) => (
              <label
                key={r}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-center rounded-control border px-3 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/25",
                  reason === r ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground hover:bg-subtle",
                )}
              >
                <input type="radio" name="lost-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="sr-only" />
                {lostReasonLabels[r]}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Remark <span className="font-normal text-muted-foreground">(optional)</span>
          </span>
          <textarea
            rows={3}
            maxLength={500}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder={reason === "high_rate" ? "e.g. Competitor quoted 12% lower" : "Anything worth remembering"}
            className="w-full rounded-control border border-input bg-card px-3 py-2.5 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15"
          />
        </label>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
          Back
        </Button>
        <Button type="submit" variant="danger" loading={saving}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
