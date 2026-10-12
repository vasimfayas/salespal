"use client";

import dynamic from "next/dynamic";
import type { TrendPoint, TrendSeries } from "@/components/dashboard/MonthlyTrendChart";

const MonthlyTrendChartLazy = dynamic(
  () =>
    import("@/components/dashboard/MonthlyTrendChart").then(
      (mod) => mod.MonthlyTrendChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] w-full rounded-xl bg-muted animate-pulse" />
    ),
  }
);

export function MonthlyTrendChartWrapper({ data, series, money }: { data: TrendPoint[]; series: TrendSeries[]; money?: boolean }) {
  return (
    <div className="h-[300px] w-full">
      <MonthlyTrendChartLazy data={data} series={series} money={money} />
    </div>
  );
}
