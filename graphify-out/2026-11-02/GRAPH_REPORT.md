# Graph Report - salespal  (2026-11-02)

## Corpus Check
- 456 files · ~269,978 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2491 nodes · 9404 edges · 99 communities (93 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1fe6bf7f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard-org/page.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- Button
- enquiry-follow-ups.ts
- accountant/page.tsx
- admin-drilldown.ts
- formatAmount
- utils.ts
- clients/route.ts
- ApprovalsView.tsx
- Skeleton
- enquiry-agent.ts
- enquiry-fields.ts
- manager-actions.ts
- buttonVariants
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- AdminDashboardSections.tsx
- client.ts
- formatDate
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- TaskCard.tsx
- MonthlyTrendChart.tsx
- Changelog
- BulkImportClientsModal.tsx
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- company-report.ts
- package.json
- cn
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- leave-actions.ts
- 1.2.0 - 2026-10-28
- scoping.ts
- 1.7.0 - 2026-10-29
- control-panel/page.tsx
- cached-queries.ts
- enquiries.ts
- CompanyReportForm.tsx
- email-queue.ts
- list-params.ts
- admin/layout.tsx
- getSalesPalSession
- EmailTemplatesClient.tsx
- manager/tasks/page.tsx
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- report-pdf.tsx
- my-overview/page.tsx
- scripts
- SearchParams
- EnquiryFollowUpModals.tsx
- Frontend Design
- buildEnquiryFormPdf
- 1.5.0 - 2026-10-29
- README.md
- SalesPal UI Rules
- 1.6.0 - 2026-10-29
- order.ts
- AGENTS.md
- bench.sh
- salesman/page.tsx
- PageSkeleton
- EnquiryForm
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- company-documents.ts
- Sidebar.tsx
- Bug log
- agent-quote/[token]/route.ts
- clients-list.ts
- revalidateEnquiryPages
- UsersClient
- salesman-report.ts
- SalesPal Architecture
- salesman-targets.ts
- CompanyComparisonCard.tsx
- newTempPassword
- orders/[id]/page.tsx
- eslint.config.mjs
- next.config.ts
- next
- overrides
- bcryptjs
- proxy.ts
- admin/clients/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 242 edges
2. `next` - 169 edges
3. `getSalesPalSession()` - 138 edges
4. `prisma` - 128 edges
5. `react` - 115 edges
6. `Skeleton()` - 110 edges
7. `lucide-react` - 107 edges
8. `Button` - 97 edges
9. `PageHeader()` - 91 edges
10. `formatDate()` - 81 edges

## Surprising Connections (you probably didn't know these)
- `3. Folder map` --references--> `useShippingRates()`  [INFERRED]
  docs/ARCHITECTURE.md → hooks/useShippingRates.ts
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.5 Status flows (summary)` --references--> `sweepDormantClients()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/client-status-flow.ts
- `5.3 Schema management` --references--> `parentIdsWithCr()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/clients-list.ts

## Import Cycles
- None detected.

## Communities (99 total, 6 thin omitted)

### Community 0 - "dashboard-org/page.tsx"
Cohesion: 0.21
Nodes (16): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+8 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.16
Nodes (28): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, CompanyAccountantsPanel(), initials(), KINDS, Person (+20 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.06
Nodes (62): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverview() (+54 more)

### Community 3 - "Button"
Cohesion: 0.08
Nodes (37): EMPTY, ROLE_TONE, UserRow, Error(), AgentsClient(), save(), EMPTY, MultiInput() (+29 more)

### Community 4 - "enquiry-follow-ups.ts"
Cohesion: 0.10
Nodes (28): POST(), POST(), POST(), POST(), POST(), sweepDormantClients(), enquiryListInclude(), closeFollowUpTasks() (+20 more)

### Community 5 - "accountant/page.tsx"
Cohesion: 0.15
Nodes (21): AccountantDashboardPage(), dynamic, orderNo(), dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, SectionCard() (+13 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.17
Nodes (20): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), clientsEntering(), DrillClient, drillPreviousWindow() (+12 more)

### Community 7 - "formatAmount"
Cohesion: 0.05
Nodes (86): GET(), OrderDetail(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel() (+78 more)

### Community 8 - "utils.ts"
Cohesion: 0.09
Nodes (34): AgentQuotePage(), metadata, Notice(), AgentQuoteForm(), ApprovalDecision(), decide(), CreditRequestPanel(), submit() (+26 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.12
Nodes (36): DELETE(), PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), handleStatusChange(), handleStatusChange() (+28 more)

### Community 10 - "ApprovalsView.tsx"
Cohesion: 0.14
Nodes (23): ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL, ApprovalTimeline(), applyOutcome(), APPROVAL_KEEP_MONTHS (+15 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (24): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+16 more)

### Community 12 - "enquiry-agent.ts"
Cohesion: 0.18
Nodes (16): Enquiries and quotes, renderEmail(), AGENT_LINK_VALID_DAYS, AgentEnquiry, agentShipmentRows(), MODE, qty(), sendAgentRequestEmail() (+8 more)

### Community 13 - "enquiry-fields.ts"
Cohesion: 0.09
Nodes (38): CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, Summary(), validLines(), containerCounts(), ENQUIRY_FIELD_LABELS (+30 more)

### Community 14 - "manager-actions.ts"
Cohesion: 0.17
Nodes (20): DELETE(), POST(), DELETE(), POST(), ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies() (+12 more)

### Community 15 - "buttonVariants"
Cohesion: 0.09
Nodes (43): FollowUpsSection(), NotFound(), ClientPicker(), Option, ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask (+35 more)

### Community 16 - "1.10.0 - 2026-11-01"
Cohesion: 0.40
Nodes (5): 1.10.0 - 2026-11-01, Added, Changed, Deploy note, Fixed

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (36): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+28 more)

### Community 18 - "1.8.0 - 2026-10-29"
Cohesion: 0.40
Nodes (5): 1.8.0 - 2026-10-29, Added, Changed, Deploy note, Fixed

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.12
Nodes (26): POST(), ACTIONS, POST(), ACTIONS, POST(), ACTION_VERB, Actor, applyEnquiryAction() (+18 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.12
Nodes (35): AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo() (+27 more)

### Community 21 - "client.ts"
Cohesion: 0.06
Nodes (49): Org, DialogState, CompanyDocumentsPanel(), fileUrl(), ModalState, CompanyInfoCard(), docUrl(), CompanyLogo() (+41 more)

### Community 22 - "formatDate"
Cohesion: 0.12
Nodes (28): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), DrilldownPager() (+20 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (35): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+27 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (35): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+27 more)

### Community 25 - "TaskCard.tsx"
Cohesion: 0.31
Nodes (6): getDueDateColor(), Task, TaskCard(), Task, TaskList(), CardHeader()

### Community 26 - "MonthlyTrendChart.tsx"
Cohesion: 0.29
Nodes (7): COLORS, compactMoney, fullMoney, TrendPoint, TrendSeries, MonthlyTrendChartLazy, MonthlyTrendChartWrapper()

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "BulkImportClientsModal.tsx"
Cohesion: 0.12
Nodes (22): handleReset(), exportAgents(), handleFile(), downloadAgentTemplate(), split(), BulkImportClientsModal(), close(), handleFile() (+14 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.21
Nodes (27): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+19 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "company-report.ts"
Cohesion: 0.14
Nodes (18): GET(), AGENT_LOCK_ROLES, placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n() (+10 more)

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (28): name, prisma, seed, private, version, class-variance-authority, clsx, fflate (+20 more)

### Community 34 - "cn"
Cohesion: 0.09
Nodes (33): AuthLayout(), LoginForm(), LoginPage(), DocumentForm(), DocumentFormModal(), KpiCardProps, SmartAlertBanner(), getDueDateColor() (+25 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.12
Nodes (26): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+18 more)

### Community 37 - "1.0.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.0.0 - 2026-10-28, Added, Changed, Fixed

### Community 38 - "leave-actions.ts"
Cohesion: 0.11
Nodes (35): TeamPage(), TeamSection(), TeamSkeleton(), CoverBanner(), LeaveButton(), end(), load(), save() (+27 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "scoping.ts"
Cohesion: 0.10
Nodes (41): GET(), PATCH(), GET(), GET(), POST(), DELETE(), PATCH(), GET() (+33 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "control-panel/page.tsx"
Cohesion: 0.20
Nodes (24): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), DeploymentNote(), ErrorActions(), ErrorStatusFilter() (+16 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 44 - "enquiries.ts"
Cohesion: 0.09
Nodes (46): DELETE(), GET(), PUT(), PATCH(), POST(), SENDABLE, POST(), POST() (+38 more)

### Community 45 - "CompanyReportForm.tsx"
Cohesion: 0.09
Nodes (31): KIND, LocationPicker(), choose(), EMPTY, KINDS, LocationsClient(), changed(), remove() (+23 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.14
Nodes (20): 9. Background work, caching and scheduled jobs, EmailState, parseFilters(), text(), emailLogo(), deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE (+12 more)

### Community 47 - "list-params.ts"
Cohesion: 0.09
Nodes (39): GET(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), getEnquiriesPage() (+31 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.31
Nodes (8): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), MonthlyActivityChartProps, EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "getSalesPalSession"
Cohesion: 0.11
Nodes (28): handler, AgentsPage(), ApprovalsPage(), AccountantLayout(), AgentsPage(), ApprovalsPage(), EmailTemplatesPage(), LocationsPage() (+20 more)

### Community 50 - "EmailTemplatesClient.tsx"
Cohesion: 0.19
Nodes (11): EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), COMMON, EMAIL_TEMPLATE_KEYS, EmailTemplateKey (+3 more)

### Community 51 - "manager/tasks/page.tsx"
Cohesion: 0.39
Nodes (7): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds()

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.08
Nodes (52): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+44 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.11
Nodes (31): EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, Switch(), ContainerCount, EnquiryFollowUpItem (+23 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "report-pdf.tsx"
Cohesion: 0.23
Nodes (13): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+5 more)

### Community 57 - "my-overview/page.tsx"
Cohesion: 0.18
Nodes (21): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), SalesmanDrilldownPage(), MonthHeroSection() (+13 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "SearchParams"
Cohesion: 0.40
Nodes (9): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), OperationsEnquiriesPage(), AccountantCompanyChips(), NoAssignedCompanies(), getAccountantCompanies() (+1 more)

### Community 60 - "EnquiryFollowUpModals.tsx"
Cohesion: 0.48
Nodes (6): FollowUpForm(), submit(), FollowUpModal(), formatDateTime(), ModalHeader(), postJson()

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "1.5.0 - 2026-10-29"
Cohesion: 0.67
Nodes (3): 1.5.0 - 2026-10-29, Added, Deploy note

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 65 - "SalesPal UI Rules"
Cohesion: 0.50
Nodes (3): Docs, graphify, SalesPal UI Rules

### Community 66 - "1.6.0 - 2026-10-29"
Cohesion: 0.67
Nodes (3): 1.6.0 - 2026-10-29, Added, Changed

### Community 67 - "order.ts"
Cohesion: 0.17
Nodes (11): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, OrderPaymentItem, orderPaymentMethods, OrderPaymentMode (+3 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.10
Nodes (34): GET(), ChartSkeleton(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection() (+26 more)

### Community 71 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 73 - "EnquiryForm"
Cohesion: 0.17
Nodes (15): emptyPackageLine(), packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), ContainerChips(), emptyEnquiryForm(), EnquiryForm() (+7 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.16
Nodes (19): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+11 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.09
Nodes (42): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), CompanyTag(), daysOpen(), DgBadge(), EnquiriesClient() (+34 more)

### Community 79 - "company-documents.ts"
Cohesion: 0.10
Nodes (44): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+36 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.05
Nodes (57): DashboardLayout(), DashboardIndex(), appFont, metadata, RootLayout(), viewport, Providers(), AppShell() (+49 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "agent-quote/[token]/route.ts"
Cohesion: 0.09
Nodes (25): POST(), POST(), POST(), 5.1 Connection, 5.2 Entity relationship diagram, 5.3 Schema management, 5.4 Tables and columns, 5.5 Status flows (summary) (+17 more)

### Community 83 - "clients-list.ts"
Cohesion: 0.15
Nodes (19): ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerMyClientsPage(), MyClientsSection(), ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage() (+11 more)

### Community 84 - "revalidateEnquiryPages"
Cohesion: 0.24
Nodes (14): Ctx, DELETE(), load(), PATCH(), POST(), revalidateEnquiryPages(), cents(), MAX_QUOTE_LINES (+6 more)

### Community 85 - "UsersClient"
Cohesion: 0.33
Nodes (12): roleName(), UsersClient(), remove(), save(), canManageRole(), createUser(), deleteUser(), parseUser() (+4 more)

### Community 86 - "salesman-report.ts"
Cohesion: 0.24
Nodes (11): GET(), currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth(), prevMonth() (+3 more)

### Community 87 - "SalesPal Architecture"
Cohesion: 0.14
Nodes (12): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 6. Pages (App Router), 7. API routes (`app/api`) (+4 more)

### Community 88 - "salesman-targets.ts"
Cohesion: 0.17
Nodes (19): POST(), POST(), GET(), PATCH(), GET(), POST(), PATCH(), GET() (+11 more)

### Community 89 - "CompanyComparisonCard.tsx"
Cohesion: 0.28
Nodes (8): CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME, statusDotClass

### Community 90 - "newTempPassword"
Cohesion: 0.40
Nodes (4): 4.1 Roles, 4.2 Sign-in, 4. Roles, authentication and data scoping, newTempPassword()

### Community 91 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 92 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 94 - "next"
Cohesion: 0.08
Nodes (34): DELETE(), Params, PATCH(), GET(), POST(), labelMap, DELETE(), load() (+26 more)

### Community 95 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

### Community 96 - "bcryptjs"
Cohesion: 0.40
Nodes (3): prisma, ROLES, bcryptjs

### Community 102 - "admin/clients/page.tsx"
Cohesion: 0.29
Nodes (9): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), AdminEnquiriesPage(), AdminMyClientsPage(), MyClientsSection(), getCachedAdminManagersList, getCachedAdminOrgs (+1 more)

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 597 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Button`, `accountant/page.tsx`, `formatAmount`, `utils.ts`, `ApprovalsView.tsx`, `Skeleton`, `enquiry-fields.ts`, `manager-actions.ts`, `buttonVariants`, `AdminDashboardSections.tsx`, `client.ts`, `formatDate`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `TaskCard.tsx`, `BulkImportClientsModal.tsx`, `leave-actions.ts`, `control-panel/page.tsx`, `CompanyReportForm.tsx`, `getSalesPalSession`, `EmailTemplatesClient.tsx`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `my-overview/page.tsx`, `salesman/page.tsx`, `PageSkeleton`, `EnquiryForm`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `UsersClient`, `CompanyComparisonCard.tsx`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056654456654456654 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Button`, `enquiry-follow-ups.ts`, `accountant/page.tsx`, `admin-drilldown.ts`, `formatAmount`, `utils.ts`, `clients/route.ts`, `ApprovalsView.tsx`, `manager-actions.ts`, `buttonVariants`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `client.ts`, `formatDate`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `MonthlyTrendChart.tsx`, `package.json`, `cn`, `leave-actions.ts`, `scoping.ts`, `control-panel/page.tsx`, `cached-queries.ts`, `enquiries.ts`, `CompanyReportForm.tsx`, `admin/layout.tsx`, `getSalesPalSession`, `EmailTemplatesClient.tsx`, `admin/clients/[id]/page.tsx`, `report-pdf.tsx`, `my-overview/page.tsx`, `salesman/page.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `company-documents.ts`, `Sidebar.tsx`, `agent-quote/[token]/route.ts`, `revalidateEnquiryPages`, `UsersClient`, `salesman-targets.ts`, `orders/[id]/page.tsx`, `next.config.ts`, `proxy.ts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.07731694828469023 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `dashboard-org/page.tsx`, `cn`, `admin/clients/page.tsx`, `leave-actions.ts`, `salesman/page.tsx`, `formatAmount`, `orders/[id]/page.tsx`, `cached-queries.ts`, `PageSkeleton`, `list-params.ts`, `clients-list.ts`, `manager/tasks/page.tsx`, `admin/clients/[id]/page.tsx`, `AdminDashboardSections.tsx`, `ManagerDashboardSections.tsx`, `my-overview/page.tsx`, `SearchParams`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._