-- One-off, AFTER `npx prisma db push` (which creates client_status_events and clients.status_changed_at).
-- Safe to re-run: each step skips what it already did.

-- 1) Enquiry stages "On negotiations" and "Offer revised" are gone: an enquiry whose order was sent back is
--    "Revision requested", any other is "Quoted".
UPDATE enquiries e
SET status = CASE
  WHEN EXISTS (SELECT 1 FROM orders o WHERE o.origin_enquiry_id = e.id AND o.status = 'revision_requested') THEN 'revision_requested'
  ELSE 'quoted'
END
WHERE e.status IN ('negotiation', 'offer_revised');

-- 2) Client status history, best effort, from the history log lines "Status changed to <status>…".
--    Credited to the client's current salesman; clients that already have events are skipped.
WITH parsed AS (
  SELECT l.client_id, l.done_by, l.created_at, l.action,
         substring(l.action from '^Status changed to ([a-z_]+)') AS to_status
  FROM client_logs l
  WHERE l.action LIKE 'Status changed to %'
    AND NOT EXISTS (SELECT 1 FROM client_status_events ev WHERE ev.client_id = l.client_id)
),
ordered AS (
  SELECT p.*,
         -- Clients start as leads unless created otherwise; the first logged change is assumed to leave "lead".
         COALESCE(LAG(p.to_status) OVER (PARTITION BY p.client_id ORDER BY p.created_at, p.action), 'lead') AS from_status
  FROM parsed p
  WHERE p.to_status IS NOT NULL
)
INSERT INTO client_status_events (client_id, from_status, to_status, owner_id, actor_id, org_id, source, created_at)
SELECT o.client_id, o.from_status, o.to_status, c.assigned_salesman_id,
       CASE WHEN o.action LIKE '%(no enquiry in%' THEN NULL ELSE o.done_by END,
       c.org_id,
       CASE WHEN o.action LIKE '%(no enquiry in%' THEN 'dormant_sweep' ELSE 'manual' END,
       o.created_at
FROM ordered o
JOIN clients c ON c.id = o.client_id
WHERE o.from_status IS DISTINCT FROM o.to_status;

-- 3) A creation event per client: "lead" when its history shows later changes, otherwise its current status.
INSERT INTO client_status_events (client_id, from_status, to_status, owner_id, actor_id, org_id, source, created_at)
SELECT c.id, NULL,
       CASE WHEN EXISTS (SELECT 1 FROM client_status_events ev WHERE ev.client_id = c.id) THEN 'lead' ELSE c.status END,
       c.assigned_salesman_id, NULL, c.org_id, 'create', c.created_at
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM client_status_events ev WHERE ev.client_id = c.id AND ev.source = 'create');

-- 4) When each client entered its current status.
UPDATE clients c
SET status_changed_at = x.at
FROM (
  SELECT client_id, MAX(created_at) AS at FROM client_status_events GROUP BY client_id
) x
WHERE x.client_id = c.id AND c.status_changed_at IS DISTINCT FROM x.at;
