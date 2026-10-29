-- One-off: background email queue (worker). Safe to run once.
--   psql "$DATABASE_URL" -f prisma/add-email-jobs.sql
CREATE TABLE "email_jobs" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "logo_path" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    CONSTRAINT "email_jobs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "email_jobs_status_created_at_idx" ON "email_jobs"("status", "created_at");
