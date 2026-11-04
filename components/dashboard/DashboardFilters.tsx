"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/utils";
import { monthKey, periodLabel, type MonthKey } from "@/lib/dashboard-period";
import { useDashboardTransition } from "@/components/dashboard/DashboardTransition";
import { Loader2 } from "lucide-react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

interface Org {
  id: number;
  name: string;
  prefix: string | null;
}

const selectClass =
  "h-8 w-full cursor-pointer rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15";

export function DashboardFilters({ orgs }: { orgs: Org[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { pending, start } = useDashboardTransition();
  const searchParams = useSearchParams();

  const currentPeriod = searchParams.get("period") ?? "this_month";
  const currentOrg = searchParams.get("org") ?? "all";

  const [selectedOrg, setSelectedOrg] = useState(currentOrg);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);

  // Synchronize state when query parameters change (e.g., via back/forward navigation)
  useEffect(() => {
    setSelectedOrg(currentOrg);
  }, [currentOrg]);

  useEffect(() => {
    setSelectedPeriod(currentPeriod);
  }, [currentPeriod]);

  const navigate = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "this_month") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      // scroll: false keeps the owner where they are; the transition dims the page until the new numbers arrive.
      start(() => router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false }));
    },
    [router, pathname, searchParams, start]
  );

  const handleOrgChange = (orgId: string) => {
    setSelectedOrg(orgId);
    navigate("org", orgId);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    navigate("period", period);
  };

  // Compute current quarter label
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  const quarterLabel = `Q${quarter} ${now.getFullYear()}`;
  // This year's months, Jan → now (no future months). The current month is "this_month".
  const years = [now.getFullYear()].map((y) => ({
    year: y,
    months: Array.from({ length: y === now.getFullYear() ? now.getMonth() + 1 : 12 }, (_, m) => ({
      value: y === now.getFullYear() && m === now.getMonth() ? "this_month" : `${y}-${String(m + 1).padStart(2, "0")}`,
      label: periodLabel(`${y}-${String(m + 1).padStart(2, "0")}` as MonthKey) + (y === now.getFullYear() && m === now.getMonth() ? " (this month)" : ""),
    })),
  }));
  // An old "Last month" link, or the current month typed as YYYY-MM, still shows a matching choice.
  const shown = selectedPeriod === "last_month" ? monthKey(-1, now) : selectedPeriod === monthKey(0, now) ? "this_month" : selectedPeriod;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className={cn("hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex", !pending && "invisible")} aria-live="polite">
        <Loader2 size={14} className="animate-spin" aria-hidden />
        {pending ? "Updating…" : ""}
      </span>
      {/* Company filter: buttons for two companies, a dropdown beyond that so names never squash. */}
      {orgs.length <= 2 ? (
        <SegmentedControl
          label="Company"
          size="sm"
          value={selectedOrg}
          onChange={handleOrgChange}
          options={[{ value: "all", label: "All" }, ...orgs.map((org) => ({ value: String(org.id), label: <span className="whitespace-nowrap" title={org.name}>{org.prefix ?? org.name}</span> }))]}
        />
      ) : (
        <select aria-label="Company" value={selectedOrg} onChange={(e) => handleOrgChange(e.target.value)} className={cn(selectClass, "sm:w-44")}>
          <option value="all">All companies</option>
          {orgs.map((org) => (
            <option key={org.id} value={String(org.id)} title={org.name}>
              {org.prefix ?? org.name}
            </option>
          ))}
        </select>
      )}

      {/* Period dropdown */}
      <select aria-label="Period" value={shown} onChange={(e) => handlePeriodChange(e.target.value)} className={cn(selectClass, "sm:w-40")}>
        <option value="quarter">{quarterLabel} so far</option>
        {years.map((y) => (
          <optgroup key={y.year} label={String(y.year)}>
            {y.months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
