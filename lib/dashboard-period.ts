/** Reporting periods of the owner dashboard (this month, last month, this quarter so far) and the one before each. */
export type PeriodKey = "this_month" | "last_month" | "quarter";


export function getPeriodRange(period: PeriodKey) {
  const now = new Date();
  let start: Date;
  let end: Date | undefined;

  if (period === "last_month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (period === "quarter") {
    const quarter = Math.floor(now.getMonth() / 3);
    start = new Date(now.getFullYear(), quarter * 3, 1);
    end = undefined; // until now
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = undefined;
  }
  return { start, end };
}

export function getPreviousPeriodRange(period: PeriodKey) {
  const now = new Date();
  if (period === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      0,
      23,
      59,
      59,
      999,
    );
    return { start, end };
  } else if (period === "quarter") {
    const quarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
    const end = new Date(now.getFullYear(), quarter * 3, 0, 23, 59, 59, 999);
    return { start, end };
  } else {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { start, end };
  }
}


export const periodLabels: Record<PeriodKey, string> = { this_month: "This month", last_month: "Last month", quarter: "This quarter" };
export const isPeriodKey = (v: unknown): v is PeriodKey => v === "this_month" || v === "last_month" || v === "quarter";
