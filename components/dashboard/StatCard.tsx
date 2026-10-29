import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
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
  unit,
  badgeLabel,
  badgeDirection,
  caption,
  theme,
  goodWhen = "up",
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  /** Small suffix after the figure, e.g. "QAR". */
  unit?: string;
  /** Text shown in the pill, e.g. "+12%" or "3 pending". Omit to hide the pill. */
  badgeLabel?: string;
  badgeDirection?: "up" | "down" | "flat";
  /** Free-form line under the number, e.g. "Vs last month: 340". Omit to hide. */
  caption?: React.ReactNode;
  theme: StatCardTheme;
  /** Which way is good news: "down" for lost clients, overdue tasks… (colours the pill). */
  goodWhen?: "up" | "down";
  /** Makes the whole card a link, to the list of records behind the figure. */
  href?: string;
}) {
  const TrendIcon = badgeDirection === "up" ? TrendingUp : badgeDirection === "down" ? TrendingDown : Minus;

  const body = (
    <>
      <div className="flex items-start gap-2.5">
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-[10px]", chip[theme.bg] ?? chip["bg-primary"])}>
          <Icon size={16} strokeWidth={2.25} aria-hidden />
        </span>
        <span className="line-clamp-2 pt-1.5 text-sm font-medium leading-snug text-muted-foreground">{label}</span>
        {href && <ArrowUpRight size={16} className="ml-auto mt-1.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />}
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
        <p className="min-w-0 text-xl font-semibold leading-none tracking-tight text-foreground tabular-nums @[11rem]:text-[22px] @[15rem]:text-[28px]">
          <span className="whitespace-nowrap">{typeof value === "number" ? value.toLocaleString() : value}</span>
          {unit && <span className="ml-1 whitespace-nowrap text-xs font-medium tracking-normal text-muted-foreground">{unit}</span>}
        </p>
        {badgeLabel && (
          <span
            className={cn(
              "inline-flex min-w-0 max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-tight font-medium tabular-nums",
              tone[!badgeDirection || badgeDirection === "flat" ? "flat" : badgeDirection === goodWhen ? "good" : "bad"],
            )}
          >
            <TrendIcon size={11} strokeWidth={2.5} className="shrink-0" aria-hidden />
            {badgeLabel}
          </span>
        )}
      </div>

      {caption && <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{caption}</div>}
    </>
  );
  const box = "@container flex h-full min-w-0 flex-col rounded-card border border-border bg-card p-4 text-left shadow-card sm:p-5";
  return href ? (
    <Link href={href} aria-label={`${label}: see the list`} className={cn(box, "group transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring")}>
      {body}
    </Link>
  ) : (
    <div className={box}>{body}</div>
  );
}
