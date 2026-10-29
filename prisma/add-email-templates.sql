-- One-off: per-company email templates (Email templates page). Safe to run once.
--   psql "$DATABASE_URL" -f prisma/add-email-templates.sql
CREATE TABLE "email_templates" (
    "id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER,
    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "email_templates_org_id_key_key" ON "email_templates"("org_id", "key");
