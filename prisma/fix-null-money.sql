-- Repairs NULLs in money columns that the schema declares NOT NULL, then enforces NOT NULL + defaults
-- so it can't happen again. Safe to re-run. Run against the PRODUCTION database:
--
--   psql "$DATABASE_URL" -f prisma/fix-null-money.sql
--
-- (strip any "?schema=public" from the URL for psql). It prints the NULL counts before fixing.

\echo 'NULL money values before the fix:'
SELECT 'orders.amount' AS col, count(*) FROM orders WHERE amount IS NULL
UNION ALL SELECT 'orders.advance_amount', count(*) FROM orders WHERE advance_amount IS NULL
UNION ALL SELECT 'orders.paid_total', count(*) FROM orders WHERE paid_total IS NULL
UNION ALL SELECT 'order_payments.amount', count(*) FROM order_payments WHERE amount IS NULL
UNION ALL SELECT 'shipping_rates.price', count(*) FROM shipping_rates WHERE price IS NULL
UNION ALL SELECT 'salesman_targets.amount', count(*) FROM salesman_targets WHERE amount IS NULL;

BEGIN;

-- Order amount: what the order was created from (actual figures if accounts set them, else the quote).
UPDATE orders o
SET amount = COALESCE(
  (SELECT e.actual_cost + e.actual_profit FROM enquiries e WHERE e.id = o.origin_enquiry_id AND e.actual_cost IS NOT NULL AND e.actual_profit IS NOT NULL),
  (SELECT e.provisional_cost + e.provisional_profit FROM enquiries e WHERE e.id = o.origin_enquiry_id AND e.provisional_cost IS NOT NULL AND e.provisional_profit IS NOT NULL),
  0)
WHERE o.amount IS NULL;

UPDATE orders SET advance_amount = 0 WHERE advance_amount IS NULL;
UPDATE order_payments SET amount = 0 WHERE amount IS NULL;

-- paid_total is always advance + recorded payments (what the app keeps in sync); recompute every row.
UPDATE orders o
SET paid_total = o.advance_amount + COALESCE((SELECT SUM(p.amount) FROM order_payments p WHERE p.order_id = o.id), 0)
WHERE o.paid_total IS DISTINCT FROM o.advance_amount + COALESCE((SELECT SUM(p.amount) FROM order_payments p WHERE p.order_id = o.id), 0);

UPDATE shipping_rates SET price = 0 WHERE price IS NULL;
UPDATE salesman_targets SET amount = 0 WHERE amount IS NULL;

-- Enforce what schema.prisma already says.
ALTER TABLE orders ALTER COLUMN amount SET DEFAULT 0, ALTER COLUMN amount SET NOT NULL;
ALTER TABLE orders ALTER COLUMN advance_amount SET DEFAULT 0, ALTER COLUMN advance_amount SET NOT NULL;
ALTER TABLE orders ALTER COLUMN paid_total SET DEFAULT 0, ALTER COLUMN paid_total SET NOT NULL;
ALTER TABLE order_payments ALTER COLUMN amount SET NOT NULL;
ALTER TABLE shipping_rates ALTER COLUMN price SET DEFAULT 0, ALTER COLUMN price SET NOT NULL;
ALTER TABLE salesman_targets ALTER COLUMN amount SET NOT NULL;

COMMIT;

\echo 'Done. Orders whose paid total now differs from advance + payments (should be 0):'
SELECT count(*) FROM orders o
WHERE o.paid_total <> o.advance_amount + COALESCE((SELECT SUM(p.amount) FROM order_payments p WHERE p.order_id = o.id), 0);
