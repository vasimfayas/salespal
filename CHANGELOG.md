# Changelog

Newest first. Types: Added, Changed, Fixed. Tag each release `vX.Y.Z` (fix = patch, feature = minor, breaking = major).

## 1.14.0 - 2026-11-06

### Changed
- Salesman targets now measure provisional profit, taken from each order's enquiry, instead of order value. This applies to the monthly performance report, company report, Salesmen and Team pages, and the salesman dashboard. Achieved / Missed status follows it, including for past targets.

### Added
- Actual profit confirmed by accounts shows next to provisional profit on the same screens. It is for information and does not affect target progress.

## 1.13.0 - 2026-11-05

### Added
- Agents: an agent can be a member of several networks. The network field lists the distinct networks already on agents and takes new names by typing; CSV import and export use `WCA; JCtrans` in one cell.
- Agents: link an agent to one or more companies. Send to agent and Quote only offer agents linked to the enquiry's company (the server enforces it); an agent with no company stays available to all. Agents page shows the companies and has a company filter.

### Changed
- Clients: the Status dropdown is now a tab switch with counts, like enquiries, on every client list.

### Removed
- Agents: the code field is no longer shown or edited. Saved codes stay in the database.

## 1.12.0 - 2026-11-04

> Before deploying, run `prisma/add-enquiry-priority.sql` and `prisma/add-enquiry-details-pending.sql` on the production database (both only add columns).

### Added
- Enquiries: priority flag (very important / medium / normal), set by the raiser, their manager or the owner; lists sort by priority, then date (managers: grouped by who raised it).
- Enquiries: Quick enquiry. Client, mode, from and to give an enquiry ref straight away; it shows "Details pending" and can't be quoted or sent to agents until Complete details is saved.
- Enquiries: copy-ref icon next to each ref; salesman filter for managers, manager-team and person filters for the owner; the follow-ups-due and needs-details pills filter the list.
- From / To: a whole country can be picked as the place.
- Clients: owner can reassign selected clients to a manager or salesman of the client's company, or take them over.
- Clients: similar names shown after 3 letters while adding; new names saved in capitals; same name with a different CR is allowed.
- Owner dashboard: company page (clients by status and full status history); month filter for this year's months.

### Changed
- Credit enquiries need manager approval when their credit days exceed the client's approved credit days.
- Enquiry, Onboarded and Not enquired are system statuses: salesmen can't set them by hand (managers and owner can, to correct).
- Owner dashboard company cards: onboarded and lost count the selected period (same rule as the top cards), order value and Top performer follow the period; tiles open their lists.
- Smoother loading on the owner dashboard and its drill-downs; tidier enquiry toolbar, banners and table; quick-enquiry route fields full width.
- Client form: Department behind "+ Add department"; "Attn" is now "Contact".

## 1.11.0 - 2026-11-02

### Added
- Enquiries: company tag on every enquiry, and a company filter (with counts) next to the status tabs.
- Owner: Orders screen for every company, with the accounts actions (add details, deliver, complete, cancel). Enquiries and client history link the owner and super admin to the order.

### Changed
- Enquiry list shows the selling price instead of cost / profit.
- Enquiry list shows origin and destination on their own lines, so the origin isn't cut off; phone cards show the order number.

## 1.10.1 - 2026-11-02

### Fixed
- Enquiries: "follow-up due" now shows only once the follow-up date arrives (or while a revision task is open), so logging a follow-up clears it until the next date. The banner and popup no longer say "open for over 30 days".
- Next follow-up date must be after today, so logging a follow-up can't flag the enquiry straight away.

## 1.10.0 - 2026-11-01

### Added
- Owner: add enquiries on their own behalf; My Clients and Tasks in the owner menu.
- Staff leave: owner (or a manager, for their salesmen) marks a manager or salesman on leave with from/to dates and a replacement of the same role. The replacement sees and handles their work and gets the credit; overlapping leave and replacements who are away are blocked. Extend, cancel or "back today". Staff tables tag who is on leave and show from–to, days and the replacement.
- Quotes: itemised lines (charge, cost, selling) with profit below. Save one quote per agent, then "Use this quote" for the enquiry. The agent list puts agents for the enquiry's mode in the origin country first (★ top agents first), like Send to agent.
- Enquiries: container counts with + / − per type (e.g. 2 × 20'DC + 1 × 40'RF), a temperature per reefer container, and the open top gauge whenever an open top is selected.
- Enquiry export form: container table with counts, per-container reefer temperatures and IG/OG per open top; reefer truck temperature has its own field.
- "mm" dimension unit.

### Changed
- New logins get a random password shown once to whoever creates them (no shared default). Changing your password needs the current one and at least 8 characters.
- Security headers on every response (HSTS, no framing by other sites, nosniff, referrer and permissions policy).
- Faster client search (trigram indexes); new indexes for approvals, enquiry events and import batches.
- Next.js 16.4.3, next-auth 4.24.15, nodemailer 10 and other security updates.

### Fixed
- Open top gauge disappeared when a reefer was also selected.

### Deploy note
- Database changes (additive): after deploying run `npx prisma db push --skip-generate` in the app container. If it reports dropping `client_tasks_old` (the backup from 1.x's client-task merge), check its rows are in `tasks`, then add `--accept-data-loss`.
- Logins created before this release may still use the old default password; ask those users to change it.

## 1.9.0 - 2026-10-31

### Added
- Clients: moving a client to Follow up asks for a follow-up date (and any missing contact details) and creates a follow-up task for the client's salesman, due that day.
- Clients: the super admin can delete a client from its page. Refused while the client has orders or departments.

### Changed
- Enquiry form: the Job ref list shows only the selected mode's codes (Sea, Air or Road), plus Warehouse Storage. Changing the mode clears a job ref that no longer fits.

### Fixed
- Clients list: after saving the contact details or lost reason dialog, the page no longer stays unclickable until a refresh.

### Deploy note
- No database changes. Rebuild and restart the web app (`npm run build`, `npm start`); the worker is unchanged.

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
