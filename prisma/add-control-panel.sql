-- One-off, for the Control Panel (import batches, deployment log, error log). Run on the server before or right after deploying 1.4.0:
--   psql "$DATABASE_URL" -f prisma/add-control-panel.sql
-- Safe to run once; it fails (changes nothing) if the tables already exist.
BEGIN;
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "import_batch_id" INTEGER;
-- CreateTable
CREATE TABLE "import_batches" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'clients',
    "file_name" TEXT,
    "org_id" INTEGER,
    "org_name" TEXT,
    "total_rows" INTEGER NOT NULL DEFAULT 0,
    "failed_rows" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'importing',
    "created_by_id" INTEGER NOT NULL,
    "created_by_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "reversed_at" TIMESTAMP(3),
    "reversed_by" TEXT,
    "reversed_count" INTEGER NOT NULL DEFAULT 0,
    "kept_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "import_batches_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "deployments" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "commit" TEXT,
    "deployed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "deployments_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "error_logs" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "path" TEXT,
    "method" TEXT,
    "digest" TEXT,
    "user_id" INTEGER,
    "version" TEXT,
    "count" INTEGER NOT NULL DEFAULT 1,
    "first_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',
    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "import_batches_created_at_idx" ON "import_batches"("created_at");
-- CreateIndex
CREATE INDEX "deployments_deployed_at_idx" ON "deployments"("deployed_at");
-- CreateIndex
CREATE UNIQUE INDEX "error_logs_fingerprint_key" ON "error_logs"("fingerprint");
-- CreateIndex
CREATE INDEX "error_logs_status_last_seen_idx" ON "error_logs"("status", "last_seen");
-- CreateIndex
CREATE INDEX "clients_import_batch_id_idx" ON "clients"("import_batch_id");
-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_import_batch_id_fkey" FOREIGN KEY ("import_batch_id") REFERENCES "import_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;
