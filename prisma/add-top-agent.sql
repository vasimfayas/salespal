-- One-off: flag for top agents on the Agents page.
--   psql "$DATABASE_URL" -c 'ALTER TABLE "agents" ADD COLUMN "is_top" BOOLEAN NOT NULL DEFAULT false;'
ALTER TABLE "agents" ADD COLUMN "is_top" BOOLEAN NOT NULL DEFAULT false;
