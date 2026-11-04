"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { enquiryPriorities, type EnquiryPriority } from "@/types/enquiry";

const tone: Record<EnquiryPriority, string> = {
  2: "bg-danger-soft text-danger-foreground",
  1: "bg-warning-soft text-warning-foreground",
  0: "bg-muted text-muted-foreground",
};

const labelOf = (p: EnquiryPriority) => enquiryPriorities.find((x) => x.value === p)!.label;

/** Flag chip for medium / very important enquiries; nothing for normal. */
export function PriorityFlag({ priority, className }: { priority: EnquiryPriority; className?: string }) {
  if (priority === 0) return null;
  return (
    <span className={cn("inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold", tone[priority], className)}>
      <Flag size={11} aria-hidden fill="currentColor" />
      {labelOf(priority)}
    </span>
  );
}

/** Segmented control that sets the enquiry's priority (POST /api/enquiries/[id]/priority). */
export function PriorityPicker({ enquiryId, priority, onDone }: { enquiryId: number; priority: EnquiryPriority; onDone: (message: string) => void }) {
  const [saving, setSaving] = useState<EnquiryPriority | null>(null);

  async function choose(next: EnquiryPriority) {
    if (next === priority || saving !== null) return;
    setSaving(next);
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}/priority`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: next }),
      });
      const data = await res.json().catch(() => ({}));
      onDone(res.ok ? `Priority set to ${labelOf(next).toLowerCase()}` : data.error || "Failed to set priority");
    } catch {
      onDone("Failed to set priority");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div role="radiogroup" aria-label="Priority" className="inline-flex flex-wrap gap-1 rounded-xl bg-muted p-1">
      {[...enquiryPriorities].reverse().map((p) => {
        const selected = (saving ?? priority) === p.value;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={saving !== null}
            onClick={() => choose(p.value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:cursor-wait",
              selected ? cn("shadow-sm", p.value === 0 ? "bg-card text-foreground" : tone[p.value]) : "text-muted-foreground hover:text-foreground",
            )}
          >
            {p.value > 0 && <Flag size={11} aria-hidden fill={selected ? "currentColor" : "none"} />}
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
