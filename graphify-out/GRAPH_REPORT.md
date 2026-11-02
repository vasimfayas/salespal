# Graph Report - salespal  (2026-11-02)

## Corpus Check
- 456 files · ~269,617 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2490 nodes · 9397 edges · 88 communities (83 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `579d0968`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard-org/page.tsx
- company-actions.ts
- utils.ts
- react
- formatAmount
- accountant/page.tsx
- admin-drilldown.ts
- EnquiryStageActions.tsx
- TaskCalendar.tsx
- clients/route.ts
- ApprovalsView.tsx
- Skeleton
- enquiry-agent.ts
- freight.ts
- parseEnquiryDetails
- formatDate
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- AdminDashboardSections.tsx
- client.ts
- TaskOverview.tsx
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- TaskCard.tsx
- MonthlyTrendChart.tsx
- Changelog
- AgentsClient
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- approvals.ts
- package.json
- cn
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- leave-actions.ts
- 1.2.0 - 2026-10-28
- task.ts
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
- tasks-list.ts
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- company-report.ts
- my-overview/page.tsx
- scripts
- proxy.ts
- buttonVariants
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
- EnquiryForm.tsx
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- isOwnerRole
- Sidebar.tsx
- Bug log
- agent-quote/[token]/route.ts
- sendMail
- AgentQuotes
- next
- EnquiryDetailSheet.tsx
- hasRole
- [salesmanId]/page.tsx

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

## Communities (88 total, 5 thin omitted)

### Community 0 - "dashboard-org/page.tsx"
Cohesion: 0.19
Nodes (18): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+10 more)

### Community 1 - "company-actions.ts"
Cohesion: 0.05
Nodes (64): DELETE(), POST(), remove(), save(), handleRemove(), saveCompanies(), CompanyForm(), 10. Environment variables (+56 more)

### Community 2 - "utils.ts"
Cohesion: 0.07
Nodes (56): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverview() (+48 more)

### Community 3 - "react"
Cohesion: 0.07
Nodes (65): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), Error(), EMPTY, MultiInput() (+57 more)

### Community 4 - "formatAmount"
Cohesion: 0.16
Nodes (27): OrderDetail(), EnquiryDetails(), DetailsForm(), OPEN, OrderActions(), act(), OrderDetailsDialog(), OrderRole (+19 more)

### Community 5 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (23): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+15 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.16
Nodes (20): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), DrilldownPager(), clientsEntering(), DrillClient (+12 more)

### Community 7 - "EnquiryStageActions.tsx"
Cohesion: 0.11
Nodes (33): TaskForm(), ContactDetailsDialog(), ContactForm(), DeleteClientButton(), availableActions(), ConfirmDialog(), EnquiryStageActions(), FiguresDialog() (+25 more)

### Community 8 - "TaskCalendar.tsx"
Cohesion: 0.16
Nodes (27): addDays(), addMonths(), AddTaskDialog(), CalendarPerson, DayPanel(), fmt(), iso(), KIND_ORDER (+19 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.12
Nodes (37): DELETE(), PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), handleStatusChange(), handleStatusChange() (+29 more)

### Community 10 - "ApprovalsView.tsx"
Cohesion: 0.16
Nodes (18): ApprovalDecision(), decide(), ApprovalCard(), CreditDetails(), Fields(), ACTION_LABEL, ApprovalTimeline(), decideApprovalAction() (+10 more)

### Community 11 - "Skeleton"
Cohesion: 0.06
Nodes (36): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+28 more)

### Community 12 - "enquiry-agent.ts"
Cohesion: 0.18
Nodes (17): Enquiries and quotes, toListItem(), AGENT_LINK_VALID_DAYS, AgentEnquiry, agentQuotePath(), agentQuoteUrl(), agentShipmentRows(), MODE (+9 more)

### Community 13 - "freight.ts"
Cohesion: 0.17
Nodes (23): CargoDimensionsField(), DIMENSIONS, isBlank(), packageLinesPayload(), Summary(), validLines(), CargoSection(), CargoPackage (+15 more)

### Community 14 - "parseEnquiryDetails"
Cohesion: 0.18
Nodes (9): measurement(), packingList(), parseEnquiryDetails(), unNumbers(), isWeightUnit(), round3(), base, firstReeferTemp() (+1 more)

### Community 15 - "formatDate"
Cohesion: 0.08
Nodes (46): AgentQuotePage(), metadata, Notice(), FollowUpsSection(), AgentQuoteForm(), Chip(), ClientPicker(), Option (+38 more)

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
Cohesion: 0.08
Nodes (41): POST(), POST(), POST(), ACTIONS, POST(), APPROVAL_KEEP_MONTHS, enquiryNeedsApproval(), sweepDormantClients() (+33 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.08
Nodes (46): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, AdminDashboardPage(), PeriodKey, CardSkeleton(), CardSmallSkeleton() (+38 more)

### Community 21 - "client.ts"
Cohesion: 0.05
Nodes (56): Org, ClientEnquiryFormPage(), metadata, Notice(), ClientDocumentsCard(), remove(), DialogState, DocumentDialog() (+48 more)

### Community 22 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.08
Nodes (42): ClientStatusDropdown(), Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard() (+34 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.13
Nodes (32): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+24 more)

### Community 25 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 26 - "MonthlyTrendChart.tsx"
Cohesion: 0.31
Nodes (6): COLORS, compactMoney, fullMoney, TrendPoint, TrendSeries, MonthlyTrendChartLazy

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "AgentsClient"
Cohesion: 0.08
Nodes (28): handleReset(), SalesmanClientsListProps, AgentsClient(), exportAgents(), save(), toBody(), handleFile(), downloadAgentTemplate() (+20 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.12
Nodes (39): submit(), CompanyReportPdf(), Cut(), Footer(), PdfLogo, TARGET_STATE, Bar(), C (+31 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "approvals.ts"
Cohesion: 0.12
Nodes (30): GET(), CalendarPage(), submit(), 4.3 Scoping (who sees which rows), createCreditRequest(), CreditRequestInput, Result, applyOutcome() (+22 more)

### Community 33 - "package.json"
Cohesion: 0.05
Nodes (36): eslintConfig, nextConfig, securityHeaders, name, nodemailer, overrides, next-auth, prisma (+28 more)

### Community 34 - "cn"
Cohesion: 0.13
Nodes (21): AuthLayout(), Action(), Contact, Option, options(), Org, subscribe(), ThemeToggle() (+13 more)

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
Cohesion: 0.13
Nodes (29): CoverBanner(), LeaveButton(), end(), load(), save(), saveExtend(), show(), today() (+21 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "task.ts"
Cohesion: 0.07
Nodes (39): GET(), POST(), PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+31 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "control-panel/page.tsx"
Cohesion: 0.08
Nodes (40): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), DeploymentNote(), ErrorActions(), ErrorStatusFilter() (+32 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.18
Nodes (18): GET(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), OrderStatsSection() (+10 more)

### Community 44 - "enquiries.ts"
Cohesion: 0.10
Nodes (42): DELETE(), GET(), PUT(), POST(), Ctx, DELETE(), load(), PATCH() (+34 more)

### Community 45 - "CompanyReportForm.tsx"
Cohesion: 0.18
Nodes (15): Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso(), Job (+7 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.20
Nodes (14): EmailState, emailLogo(), TYPES, deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue() (+6 more)

### Community 47 - "list-params.ts"
Cohesion: 0.12
Nodes (31): GET(), EmailTemplatesPage(), AdminEnquiriesPage(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), clientFilterWhere(), ClientListItem (+23 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.31
Nodes (8): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), MonthlyActivityChartProps, EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "getSalesPalSession"
Cohesion: 0.09
Nodes (36): handler, GET(), AgentsPage(), ApprovalsPage(), AccountantLayout(), AgentsPage(), ApprovalsPage(), LocationsPage() (+28 more)

### Community 50 - "EmailTemplatesClient.tsx"
Cohesion: 0.13
Nodes (21): EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), COMMON, EMAIL_TEMPLATE_EDITOR_ROLES, EMAIL_DEFAULTS (+13 more)

### Community 51 - "tasks-list.ts"
Cohesion: 0.14
Nodes (22): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds(), CLOSED (+14 more)

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.09
Nodes (44): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+36 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.11
Nodes (28): ENQUIRY_FIELD_LABELS, EnquiryDetails, DEFAULT_WEIGHT_UNIT, ContainerCount, EnquiryFollowUpItem, EnquiryListItem, gaugeCodes, gauges (+20 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "company-report.ts"
Cohesion: 0.14
Nodes (26): GET(), runtime, POST(), runtime, select, placeCountry(), DEFAULT_PARTS, DETAIL_LIMIT (+18 more)

### Community 57 - "my-overview/page.tsx"
Cohesion: 0.11
Nodes (35): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), MonthHeroSection(), PerformanceCardsSection() (+27 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 60 - "buttonVariants"
Cohesion: 0.12
Nodes (20): LoginForm(), LoginPage(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, NotFound(), CompanyAccountantsPanel() (+12 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.29
Nodes (11): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+3 more)

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
Cohesion: 0.11
Nodes (19): OrderStatusBadge(), TONES, STATUS_ICONS, STATUS_TONES, StatusBadge(), StatusTone, TONE_ICONS, toneClasses (+11 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.13
Nodes (27): ChartSkeleton(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES, QUICK_ACTIONS, SalesmanDashboardPage() (+19 more)

### Community 73 - "EnquiryForm.tsx"
Cohesion: 0.12
Nodes (27): emptyPackageLine(), PackageLineInput, ClientEnquiryForm(), submit(), ChoiceChips(), ContainerChips(), emptyEnquiryForm(), EnquiryForm() (+19 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.12
Nodes (27): ManagerTeamClient(), handleAddSubmit(), ManagerTeamClientProps, orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman() (+19 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.11
Nodes (30): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+22 more)

### Community 79 - "isOwnerRole"
Cohesion: 0.09
Nodes (50): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+42 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.05
Nodes (60): DashboardLayout(), DashboardIndex(), appFont, metadata, RootLayout(), viewport, Providers(), AppShell() (+52 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "agent-quote/[token]/route.ts"
Cohesion: 0.32
Nodes (8): POST(), POST(), POST(), agentLinkExpired(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 84 - "sendMail"
Cohesion: 0.50
Nodes (3): mailConfigured(), sendMail(), nodemailer

### Community 85 - "AgentQuotes"
Cohesion: 0.47
Nodes (6): AgentQuotes(), remove(), saveDraft(), use(), sameLines(), send()

### Community 88 - "next"
Cohesion: 0.11
Nodes (25): labelMap, POST(), POST(), GET(), PATCH(), GET(), POST(), PATCH() (+17 more)

### Community 90 - "EnquiryDetailSheet.tsx"
Cohesion: 0.12
Nodes (22): EnquiryDetailSheet(), EVENT_TEXT, Field(), figures(), History(), QUOTED_NOTES, Section(), EnquiryPdfButton() (+14 more)

### Community 94 - "hasRole"
Cohesion: 0.10
Nodes (31): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+23 more)

### Community 102 - "[salesmanId]/page.tsx"
Cohesion: 0.17
Nodes (16): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), AdminMyClientsPage(), MyClientsSection(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection() (+8 more)

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 597 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `utils.ts`, `react`, `formatAmount`, `accountant/page.tsx`, `EnquiryStageActions.tsx`, `TaskCalendar.tsx`, `ApprovalsView.tsx`, `Skeleton`, `freight.ts`, `formatDate`, `AdminDashboardSections.tsx`, `client.ts`, `TaskOverview.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `AgentsClient`, `leave-actions.ts`, `control-panel/page.tsx`, `CompanyReportForm.tsx`, `getSalesPalSession`, `EmailTemplatesClient.tsx`, `admin/clients/[id]/page.tsx`, `my-overview/page.tsx`, `buttonVariants`, `order.ts`, `salesman/page.tsx`, `EnquiryForm.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `AgentQuotes`, `EnquiryDetailSheet.tsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `company-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052982456140350874 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `dashboard-org/page.tsx`, `company-actions.ts`, `utils.ts`, `react`, `formatAmount`, `admin-drilldown.ts`, `EnquiryStageActions.tsx`, `TaskCalendar.tsx`, `clients/route.ts`, `ApprovalsView.tsx`, `formatDate`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `client.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `MonthlyTrendChart.tsx`, `approvals.ts`, `package.json`, `cn`, `leave-actions.ts`, `task.ts`, `control-panel/page.tsx`, `cached-queries.ts`, `enquiries.ts`, `list-params.ts`, `admin/layout.tsx`, `getSalesPalSession`, `EmailTemplatesClient.tsx`, `admin/clients/[id]/page.tsx`, `company-report.ts`, `my-overview/page.tsx`, `proxy.ts`, `buttonVariants`, `salesman/page.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `isOwnerRole`, `Sidebar.tsx`, `agent-quote/[token]/route.ts`, `EnquiryDetailSheet.tsx`, `hasRole`, `[salesmanId]/page.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06569133677567413 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `dashboard-org/page.tsx`, `company-actions.ts`, `utils.ts`, `formatAmount`, `accountant/page.tsx`, `EnquiryStageActions.tsx`, `TaskCalendar.tsx`, `formatDate`, `AdminDashboardSections.tsx`, `client.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `AgentsClient`, `package.json`, `cn`, `index.mjs`, `control-panel/page.tsx`, `cached-queries.ts`, `CompanyReportForm.tsx`, `email-queue.ts`, `list-params.ts`, `admin/layout.tsx`, `getSalesPalSession`, `EmailTemplatesClient.tsx`, `tasks-list.ts`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `my-overview/page.tsx`, `buttonVariants`, `salesman/page.tsx`, `EnquiryForm.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `EnquiryDetailSheet.tsx`, `[salesmanId]/page.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._