"use client";

import { FilterTabs } from "@/components/ui/FilterTabs";
import { clientStatusLabels, clientStatuses } from "@/types/client";

/** Client status tabs with counts; one scrolling line, like the enquiry status tabs. */
export function ClientStatusTabs({ value, counts, onChange }: { value: string; counts: Record<string, number>; onChange: (status: string) => void }) {
  const tabs = [
    { value: "all", label: "All", count: Object.values(counts).reduce((sum, n) => sum + n, 0) },
    ...clientStatuses.map((st) => ({ value: st as string, label: clientStatusLabels[st], count: counts[st] ?? 0 })),
  ];
  return <FilterTabs label="Filter by status" value={value} onChange={onChange} tabs={tabs} className="w-full flex-nowrap overflow-x-auto [scrollbar-width:none]" />;
}
