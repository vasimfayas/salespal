# Changelog

Newest first. Types: Added, Changed, Fixed. Tag each release `vX.Y.Z` (fix = patch, feature = minor, breaking = major).

## 1.4.0 - 2026-10-28

### Added
- Control Panel for the super admin: log of bulk client imports with a reverse option, deployment log with notes, and an error log that catches server and browser errors automatically.

### Deploy note
- Run `psql "$DATABASE_URL" -f prisma/add-control-panel.sql` once on the server (new tables and `clients.import_batch_id`).

## 1.3.0 - 2026-10-28

### Added
- Calendar for every role, opened from the top bar: month, week and year views, scheduled tasks per day with the assignee, a colour and icon per task type (legend doubles as a filter), and a person filter for managers and owners.

## 1.2.0 - 2026-10-28

Database change: `client_tasks` is merged into `tasks`. Run `prisma/merge-client-tasks-into-tasks.sql` on the server once after deploying.

### Changed
- One task table: client tasks are now tasks with type "Client follow-up". Lists, counts and the client page read from it.
- Managers see their own tasks (created by or assigned to them) in Team Tasks, not only their salesmen's.
- Task list: the Follow up button no longer overlaps the status dropdown.
- Deleting a user that has history lists every kind of record that blocks it.

### Added
- Managers, owner and super admin get the full task form on a client page: title, notes, action (call, email, meeting, video conference, collect, ...), due date, task type, assignee and notification.
- Docs: `docs/ARCHITECTURE.md` and `docs/bugs/BUGS.md`.

### Fixed
- Assigning a client task to someone outside the manager's team is refused.

## 1.1.2 - 2026-10-28

### Added
- Owner and super admin can open a client from the clients table (new client detail page).

## 1.1.1 - 2026-10-28

### Changed
- Owner dashboard company selector shows the company prefix instead of the full name.
- Deleting a user that has history now lists every kind of record that blocks it.

## 1.1.0 - 2026-10-28

### Changed
- Owner mobile tab bar trimmed to Overview, Tasks, Salesmen, Accounts, Approvals and Reports. Other links stay in the menu drawer.
- App version and commit shown at the bottom of the sidebar. Commit comes from Coolify's `SOURCE_COMMIT`.

## 1.0.0 - 2026-10-28
First tracked release. Everything before this is summarised below.

### Fixed
- Companies page: Staff count now only counts people assigned to that company, each once.

### Changed
- Login form cleaned up, logo anchored, zoom disabled for an app-like feel (2026-10-26).

### Added
- Redis and background workers (2026-10-15).
- Company, company document and KYC export (2026-10-14).
- Credit agreement for sales enquiries (2026-10-13).
- Operations module, reports, actual profit card (2026-10-12).
- Send enquiry to client / agent, order prefix, organisation logo (2026-10-10).
- Premium / standard client category on enquiries (2026-10-10).
