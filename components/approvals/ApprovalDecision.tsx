"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { decideApprovalAction } from "@/lib/actions/approval-actions";

/** Approve / reject the step waiting on the user. Rejecting needs a reason; approving takes an optional note. */
export function ApprovalDecision({ requestId }: { requestId: number }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "rejected") {
    if (decision === "rejected" && !comment.trim()) return setError("Add a reason before rejecting.");
    setBusy(decision);
    setError(null);
    const res = await decideApprovalAction(requestId, decision, comment);
    setBusy(null);
    if (!res.success) return setError(res.error);
    toast.success(res.message ?? "Done");
    router.refresh();
  }

  return (
    <div className="space-y-2 border-t border-border pt-3">
      <Textarea
        aria-label="Comment"
        rows={2}
        maxLength={500}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment (required to reject)"
        className="min-h-14"
      />
      {error && (
        <p role="alert" className="text-xs font-medium text-danger-foreground">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" className="text-danger-foreground hover:bg-danger-soft" loading={busy === "rejected"} disabled={!!busy} onClick={() => decide("rejected")}>
          <X /> Reject
        </Button>
        <Button size="sm" loading={busy === "approved"} disabled={!!busy} onClick={() => decide("approved")}>
          <Check /> Approve
        </Button>
      </div>
    </div>
  );
}
