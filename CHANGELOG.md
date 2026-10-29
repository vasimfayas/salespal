# Changelog

Newest first. Types: Added, Changed, Fixed. Tag each release `vX.Y.Z` (fix = patch, feature = minor, breaking = major).

## 1.8.0 - 2026-10-29

### Added
- Reports: filter a company report by staff (one or several), mode, From country, To country, and choose which detail tables to include (Orders, All enquiries, Confirmed enquiries, Lost enquiries & orders). A filtered PDF says what it was narrowed to; the recent list shows the filters.
- Reports: a Delete button on finished and failed reports (removes the PDF).
- Reports: each finished report shows "Deleted in N days" (reports are kept 30 days by the daily cleanup).
- Overview: Onboarded, Active Pipeline, Lost Clients and the new Lost Enquiries tiles open a list of the records behind the number, with 20 / 50 rows per page.

### Changed
- Overview: the Conversion Rate tile is now Lost Enquiries (this period vs the same days before).
- Reports page: removed the Top performer, Team order value and New clients tiles.

### Fixed
- Phone: the bottom tab bar no longer clips its icons and labels on iPhones (the safe area is now added to its height).

### Deploy note
- No database changes. The worker builds the report PDFs, so it must be redeployed with the web app (Auto Deploy does both).

## 1.7.0 - 2026-10-29

### Added
- Send to agent: pick several agents at once. Agents who handle the enquiry's mode in the country it ships from (e.g. sea agents in China for Ningbo) are preselected; any other agent can be searched and added.
- Send to agent: a Review step previews the email (company template, real shipment), with edit for that send only and reset to default.
- Agents page: filters for mode, country and network, a Top agents filter, and a star to flag top agents (listed first and starred when sending).
- Locations: a master list of seaports, airports and road points (owner and super admin edit it). Enquiry and shipping-rate From / To pickers and the agent country list read from it. Filled from the built-in list on first use.
- Email templates: each company's own wording for the agent rate request and client enquiry form emails (owner and super admin), with placeholders, preview and reset to default. `{{logo}}` puts the company logo in the signature.
- Emails are sent by the background worker (queue `emails`, retries with backoff) instead of inside the request; the dialogs show Sending / Emailed per recipient.

### Changed
- The worker (`npm run worker`) now also sends emails. It needs `REDIS_URL`, `SMTP_*`, `MAIL_FROM`, `DATABASE_URL` and the same `uploads/` volume as the web app.
- `docs/redis-and-workers-explained.pdf` explains Redis, the queues and the worker setup.

### Deploy note
- Run once on the server, before deploying: `prisma/add-top-agent.sql`, `prisma/add-locations.sql`, `prisma/add-email-templates.sql`, `prisma/add-email-jobs.sql` (adds `agents.is_top` and tables `locations`, `email_templates`, `email_jobs`).
- Deploy the worker too, with the SMTP variables, or emails stay "Sending…".

## 1.6.0 - 2026-10-29

### Added
- "To do": a private personal task for every role. Nobody to assign; only its owner sees it (lists, calendar, dashboards and reports exclude other people's to-dos).
- Calendar: add a task on a picked day. Owners and managers can add it for themselves or give a General task to someone.

### Changed
- The old untyped task type is called "General" (assigned by a manager) and is separate from "To do".
- Managers, owners, accountants and operations can now create their own tasks (previously only salesmen could create personal ones).

## 1.5.0 - 2026-10-29

### Added
- Client documents: new type "Credit Agreement Copy" (not part of KYC; expiry optional).
- Shipping rates have a "Valid until" date. After it the rate shows as Expired with no price and is skipped for best price.
- Marking a client Lost now asks for a reason (and optional remark), enforced by the server and written to the client history.

### Deploy note
- Run `psql "$DATABASE_URL" -f prisma/add-rate-validity.sql` once on the server (adds `shipping_rates.valid_until`).

## 1.4.1 - 2026-10-28

### Added
- SalesPal can be installed to a phone's home screen and opens full screen without the browser bars (manifest, icons, iOS web-app settings).

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
