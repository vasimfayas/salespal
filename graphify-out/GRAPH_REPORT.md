# Graph Report - salespal  (2026-10-29)

## Corpus Check
- 427 files · ~250,113 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2285 nodes · 8599 edges · 87 communities (83 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `986c6619`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrderList.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- TaskCalendar.tsx
- CompanyReportPdf.tsx
- SalesPal Architecture
- SalesmenTargetsClient.tsx
- formatAmount
- BulkImportClientsModal
- clients/route.ts
- next
- Skeleton
- getSalesPalSession
- freight.ts
- accountant/page.tsx
- SalesmanTasksList.tsx
- getTokenUserId
- seed.ts
- approvals.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- EnquiriesClient.tsx
- MonthlyTrendChart.tsx
- Changelog
- order.ts
- salesman-targets.ts
- control-panel/page.tsx
- dependencies
- task.ts
- package.json
- SendToAgentDialog.tsx
- compilerOptions
- index.mjs
- hasRole
- EnquiryDetailSheet.tsx
- dashboard-org/page.tsx
- my-overview/page.tsx
- clientScopeWhere
- admin/clients/[id]/page.tsx
- cached-queries.ts
- enquiryRef
- UsersClient.tsx
- ShippingRateModal.tsx
- Select
- Button
- admin/layout.tsx
- tasks-list.ts
- enquiry-agent.ts
- ApprovalsView.tsx
- email-templates/route.ts
- devDependencies
- client-status-flow.ts
- error-log.ts
- admin-dashboard.ts
- scripts
- email-queue.ts
- Input.tsx
- Frontend Design
- buildEnquiryFormPdf
- cn
- README.md
- SalesPal UI Rules
- utils.ts
- AgentsClient.tsx
- AGENTS.md
- bench.sh
- formatDate
- enquiries.ts
- EnquiryForm
- postcss.config.mjs
- check-errors.sh
- isOwnerRole
- send-to-client/route.ts
- CompanyComparisonCard.tsx
- RateCard.tsx
- Sidebar.tsx
- Bug log
- kpi.ts
- types/auth.ts
- revalidateEnquiryPages
- LocationsClient
- sendMail

## God Nodes (most connected - your core abstractions)
1. `cn()` - 233 edges
2. `next` - 159 edges
3. `getSalesPalSession()` - 132 edges
4. `prisma` - 121 edges
5. `react` - 110 edges
6. `Skeleton()` - 108 edges
7. `lucide-react` - 101 edges
8. `Button` - 89 edges
9. `PageHeader()` - 87 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `3. Folder map` --references--> `useTasks()`  [INFERRED]
  docs/ARCHITECTURE.md → hooks/useTasks.ts
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.5 Status flows (summary)` --references--> `sweepDormantClients()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/client-status-flow.ts
- `Orders and money` --references--> `syncOrderPayments()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/order-payments.ts

## Import Cycles
- None detected.

## Communities (87 total, 4 thin omitted)

### Community 0 - "OrderList.tsx"
Cohesion: 0.15
Nodes (23): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), OrderRole (+15 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.08
Nodes (50): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org, User, CompanyAccountantsPanel(), initials(), KINDS (+42 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.10
Nodes (42): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors (+34 more)

### Community 3 - "TaskCalendar.tsx"
Cohesion: 0.12
Nodes (33): GET(), addDays(), addMonths(), CalendarPerson, DayPanel(), fmt(), iso(), KIND_ORDER (+25 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.08
Nodes (59): GET(), runtime, GET(), POST(), runtime, select, GET(), submit() (+51 more)

### Community 5 - "SalesPal Architecture"
Cohesion: 0.07
Nodes (26): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 4.1 Roles, 4.2 Sign-in (+18 more)

### Community 6 - "SalesmenTargetsClient.tsx"
Cohesion: 0.21
Nodes (14): CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths(), ProgressBar() (+6 more)

### Community 7 - "formatAmount"
Cohesion: 0.12
Nodes (38): OrderDetail(), AddTaskDialog(), TaskForm(), DocumentDialog(), ContactDetailsDialog(), ContactForm(), availableActions(), ConfirmDialog() (+30 more)

### Community 8 - "BulkImportClientsModal"
Cohesion: 0.43
Nodes (7): handleReset(), BulkImportClientsModal(), close(), handleFile(), reset(), resolveSalesman(), runImport()

### Community 9 - "clients/route.ts"
Cohesion: 0.23
Nodes (22): PATCH(), PATCH(), POST(), handleStatusChange(), handleStatusChange(), cleanText(), CONTACT_FIELD_LABELS, ContactFields (+14 more)

### Community 10 - "next"
Cohesion: 0.08
Nodes (25): labelMap, POST(), GET(), ACTIONS, POST(), Params, PATCH(), GET() (+17 more)

### Community 11 - "Skeleton"
Cohesion: 0.05
Nodes (44): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), AdminClientsPage(), ClientsTableSkeleton() (+36 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.10
Nodes (37): handler, ApprovalsPage(), AccountantLayout(), ApprovalsPage(), AdminEnquiriesPage(), AdminOrdersPage(), AdminSalesmenPage(), AdminShippingRatesPage() (+29 more)

### Community 13 - "freight.ts"
Cohesion: 0.14
Nodes (25): CargoDimensionsField(), DIMENSIONS, isBlank(), packageLinesPayload(), Summary(), validLines(), submit(), CargoSection() (+17 more)

### Community 14 - "accountant/page.tsx"
Cohesion: 0.19
Nodes (20): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+12 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.12
Nodes (27): Chip(), TaskCard(), ClientPicker(), ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel() (+19 more)

### Community 16 - "getTokenUserId"
Cohesion: 0.17
Nodes (19): POST(), POST(), POST(), FOLLOW_UP_CATEGORIES, POST(), POST(), sweepDormantClients(), dueForFollowUp() (+11 more)

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (36): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+28 more)

### Community 18 - "approvals.ts"
Cohesion: 0.16
Nodes (21): POST(), 4.3 Scoping (who sees which rows), createCreditRequest(), CreditRequestInput, Result, applyOutcome(), APPROVAL_KEEP_MONTHS, ApprovalError (+13 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.13
Nodes (26): ACTIONS, POST(), statusAfterOrder(), ACTION_VERB, Actor, applyEnquiryAction(), applyOrderAction(), EnquiryAction (+18 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (38): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton() (+30 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.07
Nodes (48): emptyPackageLine(), PackageLineInput, openEdit(), ChoiceChips(), emptyEnquiryForm(), enquiryFormFrom(), EnquiryFormState, GroupLabel() (+40 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.10
Nodes (30): ChartSkeleton(), FollowUpsSection(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection(), ORDER_MONTH_NAMES (+22 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.20
Nodes (15): Badge(), RateCard(), ShippingRateModal(), formatFx(), formatRatePrice(), MODE_ICON, ShippingRateTable(), handleFindRate() (+7 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.13
Nodes (34): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+26 more)

### Community 25 - "EnquiriesClient.tsx"
Cohesion: 0.13
Nodes (24): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+16 more)

### Community 26 - "MonthlyTrendChart.tsx"
Cohesion: 0.29
Nodes (7): COLORS, compactMoney, fullMoney, TrendPoint, TrendSeries, MonthlyTrendChartLazy, MonthlyTrendChartWrapper()

### Community 27 - "Changelog"
Cohesion: 0.07
Nodes (28): 1.0.0 - 2026-10-28, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.2.0 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.0 - 2026-10-28, 1.4.1 - 2026-10-28 (+20 more)

### Community 28 - "order.ts"
Cohesion: 0.12
Nodes (18): DELETE(), GET(), MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, orderModes (+10 more)

### Community 29 - "salesman-targets.ts"
Cohesion: 0.21
Nodes (15): POST(), GET(), PATCH(), POST(), PATCH(), POST(), num(), orderPaymentsInclude (+7 more)

### Community 30 - "control-panel/page.tsx"
Cohesion: 0.19
Nodes (24): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), DeploymentNote(), ErrorActions(), ErrorStatusFilter() (+16 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "task.ts"
Cohesion: 0.09
Nodes (27): DELETE(), PATCH(), GET(), GET(), POST(), useTasks(), taskScopeWhere(), MOVES_FROM (+19 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (31): eslintConfig, nextConfig, name, prisma, seed, private, version, class-variance-authority (+23 more)

### Community 34 - "SendToAgentDialog.tsx"
Cohesion: 0.17
Nodes (17): EmailTemplateEditor(), SAMPLE, Saved, TemplateCard(), Agent, MailContext, Sent, COMMON (+9 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.14
Nodes (23): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+15 more)

### Community 37 - "hasRole"
Cohesion: 0.07
Nodes (62): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+54 more)

### Community 38 - "EnquiryDetailSheet.tsx"
Cohesion: 0.15
Nodes (19): EnquiryDetailSheet(), EVENT_TEXT, Field(), figures(), History(), QUOTED_NOTES, Section(), Action (+11 more)

### Community 39 - "dashboard-org/page.tsx"
Cohesion: 0.20
Nodes (17): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+9 more)

### Community 40 - "my-overview/page.tsx"
Cohesion: 0.19
Nodes (20): GET(), ReportsPage(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), PerformanceCardsSection() (+12 more)

### Community 41 - "clientScopeWhere"
Cohesion: 0.16
Nodes (16): GET(), POST(), PATCH(), GET(), GET(), POST(), GET(), createLeadTasks() (+8 more)

### Community 42 - "admin/clients/[id]/page.tsx"
Cohesion: 0.06
Nodes (63): DELETE(), PATCH(), AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection() (+55 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.18
Nodes (19): GET(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), ManagerTeamClientProps, OrderStatsSection(), ManagerOrderStatsSection(), OrderMonthlyChart() (+11 more)

### Community 44 - "enquiryRef"
Cohesion: 0.24
Nodes (13): AgentQuotePage(), metadata, Notice(), ClientEnquiryFormPage(), metadata, Notice(), CompanyLogo(), CompanyLogoEditor() (+5 more)

### Community 45 - "UsersClient.tsx"
Cohesion: 0.22
Nodes (17): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), remove(), save(), canManageRole() (+9 more)

### Community 46 - "ShippingRateModal.tsx"
Cohesion: 0.17
Nodes (13): emptyForm, MODES, PLACE, ShippingRateModalProps, ShippingRateTableProps, ExchangeRates, airCarriers, carriersByMode (+5 more)

### Community 47 - "Select"
Cohesion: 0.33
Nodes (6): ClientStatusDropdown(), CompanyReportForm(), iso(), Job, Progress(), Select()

### Community 48 - "Button"
Cohesion: 0.13
Nodes (25): Error(), AgentQuoteForm(), CreditRequestPanel(), submit(), StatCardWithDetails(), CopyLinkButton(), Result, SendToClientDialog() (+17 more)

### Community 49 - "admin/layout.tsx"
Cohesion: 0.38
Nodes (6): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.15
Nodes (20): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), todoPrivacySql(), CLOSED (+12 more)

### Community 51 - "enquiry-agent.ts"
Cohesion: 0.27
Nodes (11): POST(), SENDABLE, AgentEnquiry, agentQuotePath(), agentQuoteUrl(), agentShipmentRows(), MODE, newAgentToken() (+3 more)

### Community 52 - "ApprovalsView.tsx"
Cohesion: 0.14
Nodes (22): ApprovalDecision(), decide(), ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL, ApprovalTimeline() (+14 more)

### Community 53 - "email-templates/route.ts"
Cohesion: 0.32
Nodes (9): DELETE(), GET(), PUT(), EmailTemplatesPage(), EmailTemplatesClient(), EMAIL_TEMPLATE_EDITOR_ROLES, getEmailTemplate(), isTemplateKey() (+1 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "client-status-flow.ts"
Cohesion: 0.23
Nodes (10): GET(), POST(), BLACKLISTED_ERROR, revalidateClientViews(), statusAfterEnquiry(), StatusSource, Tx, resolveEnquiryClient() (+2 more)

### Community 56 - "error-log.ts"
Cohesion: 0.21
Nodes (7): Clients, onRequestError(), register(), cut(), ERROR_KEEP_DAYS, Input, logError()

### Community 57 - "admin-dashboard.ts"
Cohesion: 0.27
Nodes (9): CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), cohortFunnel(), eventScope(), statusEntries() (+1 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "email-queue.ts"
Cohesion: 0.19
Nodes (16): EmailState, writeStoredFile(), emailLogo(), deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue() (+8 more)

### Community 60 - "Input.tsx"
Cohesion: 0.13
Nodes (20): KIND, LocationPicker(), choose(), EMPTY, KINDS, controlBase, controlHeight, errorClass (+12 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "cn"
Cohesion: 0.12
Nodes (19): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), CardHeader(), DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioItem (+11 more)

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 65 - "SalesPal UI Rules"
Cohesion: 0.50
Nodes (3): Docs, graphify, SalesPal UI Rules

### Community 66 - "utils.ts"
Cohesion: 0.06
Nodes (41): LoginForm(), LoginPage(), Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect() (+33 more)

### Community 67 - "AgentsClient.tsx"
Cohesion: 0.11
Nodes (23): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), exportAgents(), save(), EMPTY (+15 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "formatDate"
Cohesion: 0.11
Nodes (24): clientStatusDot, DialogState, getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), ApprovalBadge(), getDueDateColor() (+16 more)

### Community 71 - "enquiries.ts"
Cohesion: 0.13
Nodes (32): GET(), clientFilterWhere(), ClientListItem, ClientListRow, clientListSelect, getClientsPage(), toListItem(), enquiryListInclude (+24 more)

### Community 73 - "EnquiryForm"
Cohesion: 0.52
Nodes (4): ClientEnquiryForm(), EnquiryForm(), Section(), SignaturePad()

### Community 76 - "isOwnerRole"
Cohesion: 0.10
Nodes (33): DELETE(), POST(), DELETE(), POST(), POST(), CalendarPage(), ManagerTeamClient(), handleAddSubmit() (+25 more)

### Community 77 - "send-to-client/route.ts"
Cohesion: 0.44
Nodes (7): POST(), CLIENT_FORM_VALID_DAYS, clientFormPath(), clientFormUrl(), newClientFormToken(), sendClientFormEmail(), publicBaseUrl()

### Community 78 - "CompanyComparisonCard.tsx"
Cohesion: 0.28
Nodes (8): CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME, statusDotClass

### Community 79 - "RateCard.tsx"
Cohesion: 0.25
Nodes (7): BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCardBadge, RateCardProps

### Community 80 - "Sidebar.tsx"
Cohesion: 0.05
Nodes (60): DashboardLayout(), DashboardIndex(), appFont, metadata, RootLayout(), viewport, Providers(), AppShell() (+52 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "kpi.ts"
Cohesion: 0.25
Nodes (8): calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), groupStatusCounts(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem, KpiStatus

### Community 83 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 84 - "revalidateEnquiryPages"
Cohesion: 0.21
Nodes (12): POST(), PATCH(), POST(), POST(), revalidateEnquiryPages(), agentLinkExpired(), clientFormExpired(), enquiryDetailsData() (+4 more)

### Community 85 - "LocationsClient"
Cohesion: 0.53
Nodes (5): LocationsClient(), changed(), remove(), save(), resetLocations()

### Community 86 - "sendMail"
Cohesion: 0.50
Nodes (3): mailConfigured(), sendMail(), nodemailer

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 545 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrderList.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `CompanyReportPdf.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `clients/route.ts`, `Skeleton`, `getSalesPalSession`, `SalesmanTasksList.tsx`, `getTokenUserId`, `approvals.ts`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `MonthlyTrendChart.tsx`, `order.ts`, `salesman-targets.ts`, `control-panel/page.tsx`, `task.ts`, `package.json`, `SendToAgentDialog.tsx`, `hasRole`, `EnquiryDetailSheet.tsx`, `my-overview/page.tsx`, `clientScopeWhere`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `enquiryRef`, `UsersClient.tsx`, `Button`, `admin/layout.tsx`, `enquiry-agent.ts`, `ApprovalsView.tsx`, `email-templates/route.ts`, `client-status-flow.ts`, `error-log.ts`, `admin-dashboard.ts`, `Input.tsx`, `utils.ts`, `AgentsClient.tsx`, `formatDate`, `enquiries.ts`, `isOwnerRole`, `send-to-client/route.ts`, `Sidebar.tsx`, `revalidateEnquiryPages`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrderList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `OrderList.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `BulkImportClientsModal`, `Skeleton`, `getSalesPalSession`, `freight.ts`, `accountant/page.tsx`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `enquiry.ts`, `salesman/page.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `control-panel/page.tsx`, `SendToAgentDialog.tsx`, `EnquiryDetailSheet.tsx`, `my-overview/page.tsx`, `admin/clients/[id]/page.tsx`, `enquiryRef`, `UsersClient.tsx`, `ShippingRateModal.tsx`, `Select`, `Button`, `ApprovalsView.tsx`, `Input.tsx`, `utils.ts`, `AgentsClient.tsx`, `formatDate`, `EnquiryForm`, `isOwnerRole`, `CompanyComparisonCard.tsx`, `RateCard.tsx`, `Sidebar.tsx`, `LocationsClient`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0822746521476104 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `OrderList.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `SalesPal Architecture`, `SalesmenTargetsClient.tsx`, `formatAmount`, `Skeleton`, `getSalesPalSession`, `accountant/page.tsx`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `control-panel/page.tsx`, `task.ts`, `package.json`, `SendToAgentDialog.tsx`, `index.mjs`, `dashboard-org/page.tsx`, `my-overview/page.tsx`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `enquiryRef`, `UsersClient.tsx`, `ShippingRateModal.tsx`, `Select`, `Button`, `admin/layout.tsx`, `tasks-list.ts`, `ApprovalsView.tsx`, `email-queue.ts`, `Input.tsx`, `cn`, `AgentsClient.tsx`, `formatDate`, `EnquiryForm`, `isOwnerRole`, `Sidebar.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._