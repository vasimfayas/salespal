"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/utils";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

interface Org {
  id: number;
  name: string;
}

const selectClass =
  "h-8 w-full cursor-pointer rounded-control border border-input bg-card px-3 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-150 hover:border-border-strong focus:border-ring focus:ring-3 focus:ring-ring/15";

export function DashboardFilters({ orgs }: { orgs: Org[] }) {
  const router = useRouter();
  const pathname = usePathname();
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
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, searchParams]
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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Company filter: buttons for two companies, a dropdown beyond that so names never squash. */}
      {orgs.length <= 2 ? (
        <SegmentedControl
          label="Company"
          size="sm"
          value={selectedOrg}
          onChange={handleOrgChange}
          options={[{ value: "all", label: "All" }, ...orgs.map((org) => ({ value: String(org.id), label: <span className="whitespace-nowrap">{org.name}</span> }))]}
        />
      ) : (
        <select aria-label="Company" value={selectedOrg} onChange={(e) => handleOrgChange(e.target.value)} className={cn(selectClass, "sm:w-44")}>
          <option value="all">All companies</option>
          {orgs.map((org) => (
            <option key={org.id} value={String(org.id)}>
              {org.name}
            </option>
          ))}
        </select>
      )}

      {/* Period dropdown */}
      <select aria-label="Period" value={selectedPeriod} onChange={(e) => handlePeriodChange(e.target.value)} className={cn(selectClass, "sm:w-36")}>
        <option value="this_month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="quarter">{quarterLabel}</option>
      </select>
    </div>
  );
}
