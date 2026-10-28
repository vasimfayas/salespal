# Changelog

Newest first. Types: Added, Changed, Fixed. Tag each release `vX.Y.Z` (fix = patch, feature = minor, breaking = major).

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
