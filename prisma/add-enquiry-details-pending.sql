-- Quick enquiries: saved with client, mode and route only; the full details follow later.
-- Additive: existing enquiries get false and behave exactly as before. Run before deploying.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS details_pending BOOLEAN NOT NULL DEFAULT false;
