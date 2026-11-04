-- One-off: enquiry priority flag (0 normal, 1 medium, 2 very important). Run BEFORE deploying 1.12.0.
--   psql "$DATABASE_URL" -f prisma/add-enquiry-priority.sql
-- Additive and safe on live data: existing enquiries become 0 (normal).
ALTER TABLE "enquiries" ADD COLUMN IF NOT EXISTS "priority" SMALLINT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS "enquiries_priority_enquiry_date_id_idx" ON "enquiries" ("priority", "enquiry_date", "id");
