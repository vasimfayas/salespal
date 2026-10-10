-- One-off, BEFORE `npx prisma db push`: enquiries and orders get their own company (org_id).
-- Existing rows take their client's company (orders: their enquiry's). Idempotent; safe to re-run.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS org_id INTEGER;
UPDATE enquiries e SET org_id = c.org_id FROM clients c WHERE c.id = e.client_id AND e.org_id IS NULL;
ALTER TABLE enquiries ALTER COLUMN org_id SET NOT NULL;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS org_id INTEGER;
UPDATE orders o
SET org_id = COALESCE((SELECT e.org_id FROM enquiries e WHERE e.id = COALESCE(o.enquiry_id, o.origin_enquiry_id)), c.org_id)
FROM clients c
WHERE c.id = o.client_id AND o.org_id IS NULL;
ALTER TABLE orders ALTER COLUMN org_id SET NOT NULL;
