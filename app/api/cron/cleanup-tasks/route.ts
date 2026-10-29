import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTaskViews } from "@/lib/enquiry-follow-ups";
import { APPROVAL_KEEP_MONTHS } from "@/lib/approvals";
import { removeDocumentFile } from "@/lib/company-documents";
import { REPORT_KEEP_DAYS } from "@/lib/report-retention";

/** Closed tasks are kept this long, then removed. Their outcomes stay in the client history (client_logs). */
const KEEP_MONTHS = 6;

/**
 * Daily housekeeping: deletes tasks closed (achieved / unsuccessful) more than KEEP_MONTHS ago, and approval
 * requests decided more than APPROVAL_KEEP_MONTHS ago with their log (the outcome stays on the client / enquiry).
 * Report jobs older than REPORT_KEEP_DAYS lose their PDF file and row.
 * Tasks closed before closed_at existed fall back to their due date. Task history rows cascade.
 *
 * Disabled unless CRON_SECRET is set. Call from the server's cron, e.g. daily at 03:00:
 *   curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/cleanup-tasks
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Task cleanup is disabled (CRON_SECRET not set)" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - KEEP_MONTHS);
  const { count } = await prisma.task.deleteMany({
    where: {
      status: { in: ["achieved", "unsuccessful"] },
      OR: [{ closed_at: { lt: cutoff } }, { closed_at: null, due_date: { lt: cutoff } }],
    },
  });
  if (count) revalidateTaskViews();

  const approvalCutoff = new Date();
  approvalCutoff.setUTCMonth(approvalCutoff.getUTCMonth() - APPROVAL_KEEP_MONTHS);
  const approvals = await prisma.approvalRequest.deleteMany({ where: { status: { not: "pending" }, decided_at: { lt: approvalCutoff } } });

  const reportCutoff = new Date(Date.now() - REPORT_KEEP_DAYS * 24 * 60 * 60 * 1000);
  const oldReports = await prisma.reportJob.findMany({ where: { created_at: { lt: reportCutoff } }, select: { id: true, file_path: true } });
  await Promise.all(oldReports.map((r) => (r.file_path ? removeDocumentFile(r.file_path) : null)));
  const reports = await prisma.reportJob.deleteMany({ where: { id: { in: oldReports.map((r) => r.id) } } });

  return NextResponse.json({ deleted: count, approvals_deleted: approvals.count, reports_deleted: reports.count, cutoff: cutoff.toISOString() });
}
