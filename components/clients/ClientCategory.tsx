"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Gold star pill shown next to premium clients' names. Renders nothing for standard clients. */
export function PremiumBadge({ category, compact = false, className }: { category?: string | null; compact?: boolean; className?: string }) {
  if (category !== "premium") return null;
  if (compact) {
    return (
      <span title="Premium customer" className={cn("inline-flex shrink-0 text-amber-500", className)}>
        <Star className="size-3.5 fill-current" aria-hidden />
        <span className="sr-only">Premium customer</span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25",
        className,
      )}
    >
      <Star className="size-3 fill-current" aria-hidden />
      Premium
    </span>
  );
}

/**
 * Star button that marks a client premium (or back to standard). Owners and managers only —
 * the API enforces that too. Updates in place, then refreshes the page data.
 */
export function PremiumToggle({
  clientId,
  clientName,
  category,
  withLabel = false,
}: {
  clientId: number;
  clientName: string;
  category?: string | null;
  /** Show "Premium" / "Mark as premium" text beside the star (detail pages). */
  withLabel?: boolean;
}) {
  const router = useRouter();
  const [premium, setPremium] = useState(category === "premium");
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !premium;
    setPremium(next); // optimistic
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: next ? "premium" : "standard" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't update the client");
      toast.success(next ? `${clientName} marked as premium` : `${clientName} is no longer premium`);
      startTransition(() => router.refresh());
    } catch (err) {
      setPremium(!next);
      toast.error(err instanceof Error ? err.message : "Couldn't update the client");
    } finally {
      setSaving(false);
    }
  }

  const label = premium ? `Remove premium from ${clientName}` : `Mark ${clientName} as premium`;
  return (
    <SimpleTooltip label={premium ? "Premium customer — click to remove" : "Mark as premium customer"}>
      <button
        type="button"
        onClick={toggle}
        disabled={saving || isPending}
        aria-pressed={premium}
        aria-label={label}
        className={cn(
          "press inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md disabled:opacity-60",
          withLabel ? "h-7 rounded-full px-2.5 text-xs font-medium ring-1 ring-inset" : "size-7",
          premium
            ? cn("text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/15", withLabel && "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25")
            : cn("text-muted-foreground/50 hover:bg-muted hover:text-amber-500", withLabel && "text-muted-foreground ring-border"),
        )}
      >
        <Star className={cn(withLabel ? "size-3.5" : "size-4", premium && "fill-current")} aria-hidden />
        {withLabel && (premium ? "Premium" : "Mark as premium")}
      </button>
    </SimpleTooltip>
  );
}
