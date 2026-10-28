# Bug log

Open items first. Add new ones at the top of Open; move to Fixed with the version and commit when done.

## Open

### 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned
- **Seen:** deleting manager MOHAMED RASAL failed: "can't be deleted: they have 4 client history entries on record."
- **Cause:** about 20 tables point at `users` without cascade (`client_logs.done_by`, `task_updates`, `enquiry_events`, uploaded documents, shipping rate edits and others). A user who ever did anything cannot be deleted. There is no deactivate option, so the only way to retire someone is to keep the account, remove company assignments and reset the password.
- **Also:** `clients.assigned_salesman_id` is required, so a client cannot be "unassigned". The owner and super admin cannot reassign clients (`/api/clients/bulk-assign` is manager-only).
- **Planned fix:**
  1. Add `users.active` (default true). Login refuses inactive users; user lists show an inactive state; the "delete" action offers "Deactivate" when history exists.
  2. Allow the owner and super admin to use bulk reassign.
  3. Decide on optional `assigned_salesman_id` (an "Unassigned" pool). About 32 files read the assigned salesman, so each must handle null.
- **Done so far:** the delete error message now lists every blocking record and only suggests reassigning clients when there are some (1.2.0).

## Fixed

### 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`)
Staff on the Companies page counted salesmen of other companies; now scoped by `org_id` and counted once per person.
