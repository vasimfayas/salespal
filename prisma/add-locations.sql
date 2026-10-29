-- One-off: master list of ports, airports and road points (Locations page). Safe to run once.
--   psql "$DATABASE_URL" -f prisma/add-locations.sql
-- The table is filled with the built-in list the first time the app reads it.
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "kind" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "aliases" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "locations_kind_name_country_key" ON "locations"("kind", "name", "country");
CREATE INDEX "locations_country_idx" ON "locations"("country");
