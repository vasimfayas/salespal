import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnquiryListItem } from "@/types/enquiry";

const CHIP = {
  pending: { label: "Awaiting approval", icon: Clock, tone: "bg-warning-soft text-warning-foreground" },
  rejected: { label: "Rejected — requote", icon: XCircle, tone: "bg-danger-soft text-danger-foreground" },
  approved: { label: "Manager approved", icon: CheckCircle2, tone: "bg-success-soft text-success-foreground" },
} as const;

/** The quote's manager-approval state, shown under the enquiry status. Nothing when no approval is involved. */
export function ApprovalChip({ enquiry, className }: { enquiry: Pick<EnquiryListItem, "approval_status" | "approval_required">; className?: string }) {
  const chip = enquiry.approval_status ? CHIP[enquiry.approval_status as keyof typeof CHIP] : null;
  if (!chip || (!enquiry.approval_required && enquiry.approval_status !== "approved")) return null;
  const Icon = chip.icon;
  return (
    <span className={cn("mt-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", chip.tone, className)}>
      <Icon size={11} aria-hidden /> {chip.label}
    </span>
  );
}
