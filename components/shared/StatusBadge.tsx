import { ArrowRight, Check, CheckCheck, Circle, Clock3, Globe, Inbox, PackageCheck, RotateCcw, Send, Tag, X, type LucideIcon } from "lucide-react";
import { cn, titleCase } from "@/lib/utils";
import { enquiryStatusLabels } from "@/types/enquiry";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

// Coloured word + icon, no pill (the table style): tone sets the colour, the status its icon.
const toneClasses: Record<StatusTone, string> = {
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  danger: "text-danger-foreground",
  info: "text-info-foreground",
  primary: "text-primary-soft-foreground",
  neutral: "text-muted-foreground",
};

const TONE_ICONS: Record<StatusTone, LucideIcon> = {
  success: Check,
  warning: Clock3,
  danger: X,
  info: ArrowRight,
  primary: Check,
  neutral: Circle,
};

const STATUS_ICONS: Record<string, LucideIcon> = {
  sent_to_client: Send,
  inquiry_received: Inbox,
  with_agent: Globe,
  quoted: Tag,
  confirmed: Check,
  lost: X,
  transit: ArrowRight,
  delivered: PackageCheck,
  completed: CheckCheck,
  revision_requested: RotateCcw,
  cancelled: X,
};

/** One place that decides which tone a status value gets. */
const STATUS_TONES: Record<string, StatusTone> = {
  // Enquiry stages
  sent_to_client: "info",
  inquiry_received: "neutral",
  with_agent: "warning",
  quoted: "info",
  revision_requested: "warning",
  confirmed: "success",
  lost: "danger",
};

const STATUS_LABELS: Record<string, string> = enquiryStatusLabels;

export function StatusBadge({ status, tone, label, className }: { status: string; tone?: StatusTone; label?: string; className?: string }) {
  const t = tone ?? STATUS_TONES[status] ?? "neutral";
  const Icon = STATUS_ICONS[status] ?? TONE_ICONS[t];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium", toneClasses[t], className)}>
      <Icon className={cn("shrink-0", Icon === Circle ? "size-2 fill-current" : "size-3.5")} strokeWidth={2.4} aria-hidden />
      {label ?? STATUS_LABELS[status] ?? titleCase(status)}
    </span>
  );
}
