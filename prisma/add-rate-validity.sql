-- One-off: shipping rate validity. Existing rates keep a null date (no expiry) until they are edited.
--   psql "$DATABASE_URL" -f prisma/add-rate-validity.sql
ALTER TABLE "shipping_rates" ADD COLUMN "valid_until" DATE;
