/** Generated report PDFs and their job rows are kept this many days from the request; the daily cleanup then deletes them. */
export const REPORT_KEEP_DAYS = 30;

/** Whole days left before a report (created at `createdAt`) is deleted; 0 = deleted by tonight's cleanup. */
export function reportDaysLeft(createdAt: string | Date, now = Date.now()) {
  const expires = new Date(createdAt).getTime() + REPORT_KEEP_DAYS * 86_400_000;
  return Math.max(0, Math.ceil((expires - now) / 86_400_000));
}
