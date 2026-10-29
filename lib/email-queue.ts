import { Queue } from "bullmq";
import { prisma } from "@/lib/prisma";
import { emailLogo } from "@/lib/email-logo";
import { sendMail } from "@/lib/mailer";
import { redisConnection } from "@/lib/report-queue";

export const EMAIL_QUEUE = "emails";
export const EMAIL_ATTEMPTS = 3;

let queue: Queue | undefined;
const emailQueue = () => (queue ??= new Queue(EMAIL_QUEUE, { connection: redisConnection(), defaultJobOptions: { attempts: EMAIL_ATTEMPTS, backoff: { type: "exponential", delay: 15_000 }, removeOnComplete: 500, removeOnFail: 500 } }));

/**
 * Sends one stored email. Used by the worker, and by queueEmail when Redis is down.
 * Throws when the SMTP server refuses it (the worker retries); marks the row "not_configured" when email is off.
 */
export async function deliverEmailJob(id: number) {
  const job = await prisma.emailJob.findUnique({ where: { id } });
  if (!job || job.status === "sent") return;
  await prisma.emailJob.update({ where: { id }, data: { attempts: { increment: 1 } } });
  const logo = await emailLogo({ logo_path: job.logo_path });
  let sent: boolean;
  try {
    sent = await sendMail({ to: job.to, subject: job.subject, text: job.text, html: job.html, attachments: logo ? [logo] : undefined });
  } catch (err) {
    await prisma.emailJob.update({ where: { id }, data: { error: (err instanceof Error ? err.message : String(err)).slice(0, 500) } });
    throw err;
  }
  await prisma.emailJob.update({ where: { id }, data: sent ? { status: "sent", sent_at: new Date(), error: null } : { status: "not_configured" } });
}

/** Saves the email and hands it to the worker; returns the job id to poll. With Redis unreachable it is sent right here instead. */
export async function queueEmail(m: { kind: string; to: string; subject: string; text: string; html: string; logoPath: string | null }) {
  const row = await prisma.emailJob.create({ data: { kind: m.kind, to: m.to, subject: m.subject, text: m.text, html: m.html, logo_path: m.logoPath }, select: { id: true } });
  try {
    await Promise.race([emailQueue().add("send", { emailJobId: row.id }), new Promise((_, no) => setTimeout(() => no(new Error("Redis timeout")), 3000))]);
  } catch (err) {
    console.error("Email queue unavailable, sending directly:", err);
    await deliverEmailJob(row.id).catch(() => prisma.emailJob.update({ where: { id: row.id }, data: { status: "failed" } }));
  }
  return row.id;
}

/** What the screens show for a job. */
export type EmailJobStatus = { id: number; status: "queued" | "sent" | "failed" | "not_configured"; error: string | null };
