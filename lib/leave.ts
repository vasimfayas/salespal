/** Leave / cover helpers. Client-safe: no server imports. Dates are date-only (UTC midnight), like Prisma @db.Date. */

const DAY_MS = 24 * 60 * 60 * 1000;

export type LeaveDates = { start_date: Date | string; end_date: Date | string; returned_at: Date | string | null };

const day = (d: Date | string) => {
  const x = new Date(d);
  return Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
};

/** Last day actually away: the planned end, or the day before they came back early. */
export function leaveLastDay(leave: LeaveDates): number {
  const end = day(leave.end_date);
  if (!leave.returned_at) return end;
  return Math.min(end, day(leave.returned_at) - DAY_MS);
}

/** Days away so far (inclusive), counting only up to `today`. 0 for a leave that hasn't started. */
export function leaveDaysTaken(leave: LeaveDates, today: Date = new Date()): number {
  const last = Math.min(leaveLastDay(leave), day(today));
  const start = day(leave.start_date);
  return last < start ? 0 : Math.round((last - start) / DAY_MS) + 1;
}

export type LeaveState = "upcoming" | "active" | "ended";

export function leaveState(leave: LeaveDates, today: Date = new Date()): LeaveState {
  const t = day(today);
  if (leaveLastDay(leave) < t) return "ended";
  return day(leave.start_date) > t ? "upcoming" : "active";
}
