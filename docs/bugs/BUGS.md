# Bug log

Open items first. Add new ones at the top of Open; move to Fixed with the version and commit when done.

## Open

### 2026-11-03: A client can't be linked to more than one company (postponed)
- **Seen:** the same real client works with more than one of our companies, but SalesPal holds it under one company only.
- **Cause:** `clients.org_id` is a single company and `clients.cr_no` is unique across the system, so the client can't be added again under a second company. Enquiries can already be raised under another company the salesman works for (`resolveEnquiryClient`), but the client itself is only visible to the managers of its own company. About 25 files read `clients.org_id`: scoping, client lists, bulk assign, company dashboards and KPIs, dormant sweep, credit approvals and import.
- **Decided:** status, onboarding checklist and credit approval stay **shared** (one per client, as today).
- **Still to decide:** who handles the client in each linked company, one person per company or one person for all.
- **Safe rollout (app is in production):**
  1. Add a link table for client and extra companies; keep `clients.org_id` as the main company so every current screen, report and import keeps working. No backfill: existing clients behave exactly as now.
  2. Widen visibility: managers and salesmen of a linked company see the client and can raise enquiries under that company.
  3. Reports keep counting the client under its main company only, so there is no double counting.
  4. Do not rename or drop `clients.org_id`, and do not change `cr_no` uniqueness in the same release.

### 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned
- **Seen:** deleting manager MOHAMED RASAL failed: "can't be deleted: they have 4 client history entries on record."
- **Cause:** about 20 tables point at `users` without cascade (`client_logs.done_by`, `task_updates`, `enquiry_events`, uploaded documents, shipping rate edits and others). A user who ever did anything cannot be deleted. There is no deactivate option, so the only way to retire someone is to keep the account, remove company assignments and reset the password.
- **Also:** `clients.assigned_salesman_id` is required, so a client cannot be "unassigned". The owner and super admin cannot reassign clients (`/api/clients/bulk-assign` is manager-only).
- **Planned fix:**
  1. Add `users.active` (default true). Login refuses inactive users; user lists show an inactive state; the "delete" action offers "Deactivate" when history exists.
  2. Allow the owner and super admin to use bulk reassign.
  3. Decide on optional `assigned_salesman_id` (an "Unassigned" pool). About 32 files read the assigned salesman, so each must handle null.
- **Done so far:** the delete error message now lists every blocking record and only suggests reassigning clients when there are some (1.2.0).
- **Done:** step 2, the owner and super admin can reassign clients from the Clients page (to themselves, or a manager / salesman of the client's company).

## Fixed

### 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`)
Staff on the Companies page counted salesmen of other companies; now scoped by `org_id` and counted once per person.
