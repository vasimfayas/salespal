/**
 * Reporting periods of the owner dashboard and the one before each: this month, last month, this quarter so far,
 * or a calendar month as "YYYY-MM" (the month picker). The current month as "YYYY-MM" runs until now, like this_month.
 */
export type MonthKey = `${number}-${number}`;
export type PeriodKey = "this_month" | "last_month" | "quarter" | MonthKey;

const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Year and month index (0-11) of a "YYYY-MM" key, or null. */
function parseMonth(period: string) {
  const m = MONTH_RE.exec(period);
  return m ? { y: Number(m[1]), m: Number(m[2]) - 1 } : null;
}

/** "YYYY-MM" for a month offset from now (0 = this month, -1 = last month). */
export function monthKey(offset: number, now = new Date()): MonthKey {
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` as MonthKey;
}

export function getPeriodRange(period: PeriodKey, now = new Date()) {
  let start: Date;
  let end: Date | undefined;
  const month = parseMonth(period);

  if (month) {
    start = new Date(month.y, month.m, 1);
    const isCurrent = month.y === now.getFullYear() && month.m === now.getMonth();
    end = isCurrent ? undefined : new Date(month.y, month.m + 1, 0, 23, 59, 59, 999);
  } else if (period === "last_month") {
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

export function getPreviousPeriodRange(period: PeriodKey, now = new Date()) {
  const month = parseMonth(period);
  if (month) {
    return { start: new Date(month.y, month.m - 1, 1), end: new Date(month.y, month.m, 0, 23, 59, 59, 999) };
  }
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


const NAMED: Record<string, string> = { this_month: "This month", last_month: "Last month", quarter: "This quarter" };

/** "This month", "Oct 2026", … */
export function periodLabel(period: PeriodKey) {
  const month = parseMonth(period);
  return month ? `${MONTH_NAMES[month.m]} ${month.y}` : NAMED[period];
}

export const isPeriodKey = (v: unknown): v is PeriodKey =>
  v === "this_month" || v === "last_month" || v === "quarter" || (typeof v === "string" && MONTH_RE.test(v));
