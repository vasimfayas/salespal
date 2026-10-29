import { Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { REPORT_QUEUE, redisConnection } from "@/lib/report-queue";
import { buildCompanyReportPdf } from "@/lib/report-pdf";
import { writeStoredFile } from "@/lib/company-documents";
import { EMAIL_ATTEMPTS, EMAIL_QUEUE, deliverEmailJob } from "@/lib/email-queue";

/** Background worker: builds queued reports and sends queued emails. Run with `npm run worker` (its own process / container). */
const worker = new Worker(
  REPORT_QUEUE,
  async (job) => {
    const { reportJobId } = job.data as { reportJobId: number };
    const row = await prisma.reportJob.findUnique({ where: { id: reportJobId }, include: { requestedBy: { select: { id: true, role_id: true } } } });
    if (!row) return;
    await prisma.reportJob.update({ where: { id: row.id }, data: { status: "running" } });
    const { org, from, to } = row.params as { org: number; from: string; to: string };
    const built = await buildCompanyReportPdf(org, from, to, { id: row.requestedBy.id, role_id: row.requestedBy.role_id });
    if (!built) throw new Error("Company not found");
    const file_path = `reports/${row.id}.pdf`;
    await writeStoredFile(file_path, built.pdf);
    await prisma.reportJob.update({ where: { id: row.id }, data: { status: "done", file_path, file_name: built.fileName, finished_at: new Date(), error: null } });
  },
  // PDF rendering blocks the event loop for seconds, so the lock must outlive it or BullMQ retries a job that is still running.
  { connection: redisConnection(), concurrency: 1, lockDuration: 120_000 },
);

// A job is only marked failed once its retries are used up.
worker.on("failed", async (job, err) => {
  console.error("report job failed", job?.id, err.message);
  if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    await prisma.reportJob.update({ where: { id: job.data.reportJobId }, data: { status: "failed", error: err.message.slice(0, 500), finished_at: new Date() } }).catch(() => {});
  }
});
worker.on("ready", () => console.log("report worker ready"));

// Emails go out one at a time, so SMTP providers never see a burst; a refused one is retried with backoff.
const emailWorker = new Worker(EMAIL_QUEUE, async (job) => deliverEmailJob((job.data as { emailJobId: number }).emailJobId), { connection: redisConnection(), concurrency: 1 });
emailWorker.on("failed", async (job, err) => {
  console.error("email job failed", job?.id, err.message);
  if (job && job.attemptsMade >= (job.opts.attempts ?? EMAIL_ATTEMPTS)) {
    await prisma.emailJob.update({ where: { id: job.data.emailJobId }, data: { status: "failed" } }).catch(() => {});
  }
});
emailWorker.on("ready", () => console.log("email worker ready"));
process.on("SIGTERM", async () => {
  await Promise.all([worker.close(), emailWorker.close()]);
  process.exit(0);
});
