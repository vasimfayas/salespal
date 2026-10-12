import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardTheme {
  /** Tone of the icon chip, given as the solid class it maps from (bg-primary, bg-info, bg-warning, bg-danger, bg-success). */
  bg: string;
}

const chip: Record<string, string> = {
  "bg-primary": "bg-primary-soft text-primary-soft-foreground",
  "bg-success": "bg-success-soft text-success-foreground",
  "bg-info": "bg-info-soft text-info-foreground",
  "bg-warning": "bg-warning-soft text-warning-foreground",
  "bg-danger": "bg-danger-soft text-danger-foreground",
};

const tone = {
  good: "bg-success-soft text-success-foreground",
  bad: "bg-danger-soft text-danger-foreground",
  flat: "bg-muted text-muted-foreground",
} as const;

/** Dashboard metric: tinted icon, label, figure, trend pill and an optional caption. */
export function StatCard({
  icon: Icon,
  label,
  value,
  badgeLabel,
  badgeDirection,
  caption,
  theme,
  goodWhen = "up",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  /** Text shown in the pill, e.g. "+12%" or "3 pending". Omit to hide the pill. */
  badgeLabel?: string;
  badgeDirection?: "up" | "down" | "flat";
  /** Free-form line under the number, e.g. "Vs last month: 340". Omit to hide. */
  caption?: React.ReactNode;
  theme: StatCardTheme;
  /** Which way is good news: "down" for lost clients, overdue tasks… (colours the pill). */
  goodWhen?: "up" | "down";
}) {
  const TrendIcon = badgeDirection === "up" ? TrendingUp : badgeDirection === "down" ? TrendingDown : Minus;

  return (
    <div className="@container flex h-full min-w-0 flex-col rounded-card border border-border bg-card p-4 text-left shadow-card sm:p-5">
      <div className="flex items-start gap-2.5">
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-[10px]", chip[theme.bg] ?? chip["bg-primary"])}>
          <Icon size={16} strokeWidth={2.25} aria-hidden />
        </span>
        <span className="line-clamp-2 pt-1.5 text-sm font-medium leading-snug text-muted-foreground">{label}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
        <p className="min-w-0 break-words text-xl font-semibold leading-none tracking-tight text-foreground tabular-nums @[11rem]:text-2xl @[15rem]:text-[28px]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {badgeLabel && (
          <span
            className={cn(
              "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
              tone[!badgeDirection || badgeDirection === "flat" ? "flat" : badgeDirection === goodWhen ? "good" : "bad"],
            )}
          >
            <TrendIcon size={11} strokeWidth={2.5} aria-hidden />
            {badgeLabel}
          </span>
        )}
      </div>

      {caption && <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{caption}</div>}
    </div>
  );
}
