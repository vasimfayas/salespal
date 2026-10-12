"use client";

import { LineChart } from "@mantine/charts";

export type TrendSeries = { key: string; label: string };
/** One row per month: `month` plus a count per series key. */
export type TrendPoint = { month: string } & Record<string, number | string>;

const compactMoney = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fullMoney = new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const COLORS = ["teal.6", "blue.6", "orange.6", "grape.6", "red.6", "yellow.7", "cyan.6", "pink.6"];

/** `money`: amounts — compact axis ticks (1.2M), two-decimal tooltips. */
export function MonthlyTrendChart({ data, series, money }: { data: TrendPoint[]; series: TrendSeries[]; money?: boolean }) {
  return (
    <LineChart
      h={300}
      data={data}
      dataKey="month"
      withLegend
      tickLine="y"
      gridAxis="x"
      curveType="monotone"
      {...(money && {
        valueFormatter: (v: number) => fullMoney.format(v),
        yAxisProps: { tickFormatter: (v: number) => compactMoney.format(v), width: 56 },
      })}
      series={series.map((s, i) => ({ name: s.key, label: s.label, color: COLORS[i % COLORS.length] }))}
    />
  );
}
