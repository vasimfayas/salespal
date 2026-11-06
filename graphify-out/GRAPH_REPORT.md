# Graph Report - salespal  (2026-11-06)

## Corpus Check
- 473 files · ~280,006 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2571 nodes · 9779 edges · 107 communities (101 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f1f150a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ApprovalsView.tsx
- UsersClient.tsx
- ManagerClientsList.tsx
- PageSkeleton
- cn
- SalesmenTargetsClient.tsx
- [kind]/page.tsx
- tasks-list.ts
- ClientOverview.tsx
- clients/route.ts
- formatAmount
- Skeleton
- orders-list.ts
- freight.ts
- list-params.ts
- SalesmanTasksList.tsx
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- AdminDashboardSections.tsx
- company.ts
- EnquiriesClient.tsx
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- next
- ThemeToggle.tsx
- Changelog
- utils.ts
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- EnquiryForm.tsx
- package.json
- PageHeader
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- leave-actions.ts
- 1.2.0 - 2026-10-28
- scoping.ts
- 1.7.0 - 2026-10-29
- buttonVariants
- proxy.ts
- client.ts
- company-actions.ts
- email-queue.ts
- client-history.ts
- getSalesPalSession
- enquiry-follow-ups.ts
- task.ts
- accountant/page.tsx
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- Enquiries and quotes
- ManagerClientsList
- scripts
- app/layout.tsx
- accountant/shipping-rates/page.tsx
- Frontend Design
- buildEnquiryFormPdf
- 1.5.0 - 2026-10-29
- README.md
- SalesPal UI Rules
- 1.6.0 - 2026-10-29
- enquiries.ts
- AGENTS.md
- bench.sh
- my-overview/page.tsx
- BulkImportClientsModal.tsx
- company-report.ts
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- enquiry-agent.ts
- EnquiryDetailSheet.tsx
- company-documents.ts
- locations.ts
- Bug log
- SendToAgentDialog.tsx
- agents.ts
- TaskOverview.tsx
- 1.11.0 - 2026-11-02
- SalesPal Architecture
- salesman-report.ts
- EmailTemplatesClient.tsx
- getEnquiriesPage
- cached-queries.ts
- types/auth.ts
- report-pdf.tsx
- admin/clients/page.tsx
- dashboard-org/page.tsx
- kpi.ts
- ClientSwitcher.tsx
- ui/Badge.tsx
- orders/[id]/page.tsx
- accounts/page.tsx
- TaskCard.tsx
- ClientDocumentsCard
- next.config.ts
- 1.12.0 - 2026-11-04
- 1.13.0 - 2026-11-05
- agent-quote/[token]/page.tsx
- Modal

## God Nodes (most connected - your core abstractions)
1. `cn()` - 256 edges
2. `next` - 172 edges
3. `getSalesPalSession()` - 140 edges
4. `prisma` - 131 edges
5. `react` - 121 edges
6. `Skeleton()` - 114 edges
7. `lucide-react` - 114 edges
8. `Button` - 99 edges
9. `PageHeader()` - 93 edges
10. `isOwnerRole()` - 82 edges

## Surprising Connections (you probably didn't know these)
- `3. Folder map` --references--> `useShippingRates()`  [INFERRED]
  docs/ARCHITECTURE.md → hooks/useShippingRates.ts
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.3 Schema management` --references--> `parentIdsWithCr()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/clients-list.ts
- `2026-11-03: A client can't be linked to more than one company (postponed)` --references--> `resolveEnquiryClient()`  [INFERRED]
  docs/bugs/BUGS.md → lib/enquiries.ts

## Import Cycles
- None detected.

## Communities (107 total, 6 thin omitted)

### Community 0 - "ApprovalsView.tsx"
Cohesion: 0.10
Nodes (39): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalCard(), CreditDetails(), EnquiryDetails() (+31 more)

### Community 1 - "UsersClient.tsx"
Cohesion: 0.14
Nodes (18): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), save(), ManagerTeamClient(), handleAddSubmit() (+10 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.09
Nodes (30): Client, dropdownItemColors, ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors, pickableStatuses, Action() (+22 more)

### Community 3 - "PageSkeleton"
Cohesion: 0.19
Nodes (13): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+5 more)

### Community 4 - "cn"
Cohesion: 0.09
Nodes (33): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, MonthlyChartSection(), ORDER_MONTH_NAMES, QUICK_ACTIONS, STATUS_CARD_CONFIG (+25 more)

### Community 5 - "SalesmenTargetsClient.tsx"
Cohesion: 0.17
Nodes (18): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+10 more)

### Community 6 - "[kind]/page.tsx"
Cohesion: 0.11
Nodes (36): CompanyOverviewPage(), SOURCE_LABELS, ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), DashboardFilters() (+28 more)

### Community 7 - "tasks-list.ts"
Cohesion: 0.13
Nodes (22): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds() (+14 more)

### Community 8 - "ClientOverview.tsx"
Cohesion: 0.11
Nodes (16): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect(), taskStatuses, PremiumBadge() (+8 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.11
Nodes (39): DELETE(), GET(), PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), POST() (+31 more)

### Community 10 - "formatAmount"
Cohesion: 0.05
Nodes (88): addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt(), iso() (+80 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (25): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+17 more)

### Community 12 - "orders-list.ts"
Cohesion: 0.17
Nodes (16): AdminOrdersPage(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), Paged (+8 more)

### Community 13 - "freight.ts"
Cohesion: 0.11
Nodes (32): PATCH(), CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, packageLinesPayload(), Summary(), validLines() (+24 more)

### Community 14 - "list-params.ts"
Cohesion: 0.14
Nodes (27): EmailTemplatesPage(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerMyClientsPage(), MyClientsSection(), SalesmanDrilldownPage(), ClientsListSection() (+19 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.13
Nodes (24): FollowUpsSection(), ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel(), EMPTY_MESSAGES, SalesmanTasksList() (+16 more)

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
Cohesion: 0.10
Nodes (34): ACTIONS, POST(), POST(), GET(), PATCH(), ACTIONS, POST(), GET() (+26 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.15
Nodes (27): AdminDashboardPage(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo(), HeroSkeleton(), KpiCardsRow() (+19 more)

### Community 21 - "company.ts"
Cohesion: 0.15
Nodes (22): Org, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard(), docUrl() (+14 more)

### Community 22 - "EnquiriesClient.tsx"
Cohesion: 0.06
Nodes (65): OrderDetail(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+57 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.08
Nodes (37): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+29 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.15
Nodes (29): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+21 more)

### Community 25 - "next"
Cohesion: 0.08
Nodes (40): DELETE(), Params, PATCH(), GET(), POST(), labelMap, DELETE(), load() (+32 more)

### Community 26 - "ThemeToggle.tsx"
Cohesion: 0.21
Nodes (13): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioItem (+5 more)

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "utils.ts"
Cohesion: 0.08
Nodes (43): Error(), AgentQuoteForm(), EMPTY, AGENT_COLUMNS, ApprovalDecision(), decide(), EMPTY, Latest (+35 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.21
Nodes (27): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+19 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "EnquiryForm.tsx"
Cohesion: 0.11
Nodes (31): emptyPackageLine(), ClientEnquiryForm(), openEdit(), ChoiceChips(), ContainerChips(), emptyEnquiryForm(), EnquiryForm(), enquiryFormFrom() (+23 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (32): eslintConfig, name, nodemailer, overrides, next-auth, prisma, seed, private (+24 more)

### Community 34 - "PageHeader"
Cohesion: 0.17
Nodes (18): AgentsPage(), ApprovalsPage(), AgentsPage(), ApprovalsPage(), AdminEnquiriesPage(), AdminMyClientsPage(), MyClientsSection(), ReportsPage() (+10 more)

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
Cohesion: 0.05
Nodes (64): DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), CoverBanner(), DashboardContentWrapper(), getNavGroups(), getNavItems() (+56 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "scoping.ts"
Cohesion: 0.12
Nodes (42): GET(), GET(), POST(), PATCH(), POST(), POST(), CalendarPage(), CreditAgreementCard() (+34 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "buttonVariants"
Cohesion: 0.15
Nodes (16): LoginForm(), LoginPage(), NotFound(), CompanyAccountantsPanel(), initials(), KINDS, Person, SmartAlertBanner() (+8 more)

### Community 44 - "client.ts"
Cohesion: 0.16
Nodes (15): DialogState, ClientStatusDropdown(), CLIENT_DOC_TYPES, ClientCategory, ClientDocType, ClientDocumentItem, ClientListItem, ClientLogItem (+7 more)

### Community 45 - "company-actions.ts"
Cohesion: 0.08
Nodes (48): DELETE(), POST(), DELETE(), POST(), remove(), handleRemove(), saveCompanies(), assignAccountantToOrg() (+40 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.18
Nodes (15): emailLogo(), TYPES, deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue(), queueEmail() (+7 more)

### Community 47 - "client-history.ts"
Cohesion: 0.21
Nodes (13): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientHistory(), getClientOrdersPage() (+5 more)

### Community 48 - "getSalesPalSession"
Cohesion: 0.15
Nodes (20): handler, AccountantLayout(), AdminLayout(), AdminSalesmenPage(), UsersPage(), ManagerLayout(), TeamPage(), TeamSection() (+12 more)

### Community 49 - "enquiry-follow-ups.ts"
Cohesion: 0.13
Nodes (20): POST(), POST(), POST(), 5.5 Status flows (summary), APPROVAL_KEEP_MONTHS, sweepDormantClients(), enquiryListInclude(), closeFollowUpTasks() (+12 more)

### Community 50 - "task.ts"
Cohesion: 0.10
Nodes (27): GET(), DELETE(), PATCH(), DELETE(), PATCH(), GET(), GET(), POST() (+19 more)

### Community 51 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (23): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+15 more)

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.17
Nodes (21): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+13 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.07
Nodes (39): EnquiryPdfButton(), download(), downloadEnquiryFormPdf(), ACTIVE_ENQUIRY_STATUSES, ContainerCount, EnquiryFollowUpItem, enquiryPriorities, EnquiryPriority (+31 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "Enquiries and quotes"
Cohesion: 0.18
Nodes (9): Enquiries and quotes, enquiryListOrder(), base, containersLabel(), equipmentLabel(), firstReeferTemp(), formatTemp(), primaryContainer() (+1 more)

### Community 57 - "ManagerClientsList"
Cohesion: 0.21
Nodes (13): ManagerClientsList(), handleAddSubmit(), handleStatusChange(), SalesmanClientsList(), handleAddSubmit(), handleStatusChange(), ClientNameField(), defaultCompanyId() (+5 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 60 - "accountant/shipping-rates/page.tsx"
Cohesion: 0.30
Nodes (11): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+3 more)

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

### Community 67 - "enquiries.ts"
Cohesion: 0.10
Nodes (43): DELETE(), GET(), PUT(), POST(), POST(), Ctx, DELETE(), load() (+35 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "my-overview/page.tsx"
Cohesion: 0.09
Nodes (45): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), KpiCardsSection(), MonthHeroSection() (+37 more)

### Community 71 - "BulkImportClientsModal.tsx"
Cohesion: 0.13
Nodes (19): handleReset(), SalesmanClientsListProps, handleFile(), split(), BulkImportClientsModal(), close(), handleFile(), reset() (+11 more)

### Community 73 - "company-report.ts"
Cohesion: 0.15
Nodes (17): 9. Background work, caching and scheduled jobs, placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n(), Num (+9 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "enquiry-agent.ts"
Cohesion: 0.17
Nodes (14): renderEmail(), AGENT_LINK_VALID_DAYS, AgentEnquiry, agentShipmentRows(), MODE, qty(), sendAgentRequestEmail(), DimensionUnit (+6 more)

### Community 78 - "EnquiryDetailSheet.tsx"
Cohesion: 0.16
Nodes (19): ApprovalChip(), CHIP, DetailsPendingChip(), CargoSection(), EnquiryDetailSheet(), EVENT_TEXT, Field(), figures() (+11 more)

### Community 79 - "company-documents.ts"
Cohesion: 0.09
Nodes (47): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+39 more)

### Community 80 - "locations.ts"
Cohesion: 0.21
Nodes (11): GET(), LocationsPage(), COUNTRIES, CountryDef, getLocations(), KINDS, LOCATION_EDITOR_ROLES, FreightLocation (+3 more)

### Community 81 - "Bug log"
Cohesion: 0.29
Nodes (6): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), 2026-11-03: A client can't be linked to more than one company (postponed), Bug log, Fixed, Open

### Community 82 - "SendToAgentDialog.tsx"
Cohesion: 0.10
Nodes (24): ClientPicker(), Agent, MailContext, Sent, CopyLinkButton(), Result, SendToClientDialog(), Chip() (+16 more)

### Community 83 - "agents.ts"
Cohesion: 0.33
Nodes (7): NetworkPicker(), AGENT_LOCK_ROLES, agentNetworks(), distinctNetworks(), networkSuggestions(), typedNetwork(), base

### Community 84 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 85 - "1.11.0 - 2026-11-02"
Cohesion: 0.67
Nodes (3): 1.11.0 - 2026-11-02, Added, Changed

### Community 86 - "SalesPal Architecture"
Cohesion: 0.05
Nodes (39): POST(), POST(), POST(), 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview (+31 more)

### Community 87 - "salesman-report.ts"
Cohesion: 0.25
Nodes (12): GET(), runtime, currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth() (+4 more)

### Community 88 - "EmailTemplatesClient.tsx"
Cohesion: 0.18
Nodes (13): EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), COMMON, EMAIL_TEMPLATE_EDITOR_ROLES, EMAIL_DEFAULTS (+5 more)

### Community 89 - "getEnquiriesPage"
Cohesion: 0.38
Nodes (5): GET(), ManagerEnquiriesPage(), SalesmanEnquiriesPage(), enquirySearchWhere(), getEnquiriesPage()

### Community 90 - "cached-queries.ts"
Cohesion: 0.14
Nodes (22): GET(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), ChartSkeleton(), HeroSkeleton(), KpiCardsSkeleton(), OrderStatsSection() (+14 more)

### Community 91 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 92 - "report-pdf.tsx"
Cohesion: 0.21
Nodes (15): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+7 more)

### Community 93 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 94 - "dashboard-org/page.tsx"
Cohesion: 0.52
Nodes (6): CompanySection(), CompanySkeleton(), SalesmanDashboardOrgPage(), ShippingRatesSection(), ShippingRatesSkeleton(), getCompanyProfiles()

### Community 95 - "kpi.ts"
Cohesion: 0.29
Nodes (7): calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem, KpiStatus

### Community 96 - "ClientSwitcher.tsx"
Cohesion: 0.52
Nodes (6): clientStatusDotClass(), ClientSwitcher(), go(), readRecent(), rememberClient(), Result

### Community 97 - "ui/Badge.tsx"
Cohesion: 0.16
Nodes (14): clientStatusDot, CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME (+6 more)

### Community 98 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 99 - "accounts/page.tsx"
Cohesion: 0.14
Nodes (15): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, COLORS, compactMoney, fullMoney, TrendPoint (+7 more)

### Community 100 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 101 - "ClientDocumentsCard"
Cohesion: 0.67
Nodes (4): ClientDocumentsCard(), remove(), submit(), fileUrl()

### Community 103 - "1.12.0 - 2026-11-04"
Cohesion: 0.67
Nodes (3): 1.12.0 - 2026-11-04, Added, Changed

### Community 107 - "1.13.0 - 2026-11-05"
Cohesion: 0.50
Nodes (4): 1.13.0 - 2026-11-05, Added, Changed, Removed

### Community 111 - "agent-quote/[token]/page.tsx"
Cohesion: 0.30
Nodes (10): AgentQuotePage(), metadata, Notice(), ClientEnquiryFormPage(), metadata, Notice(), CompanyLogo(), agentLinkExpired() (+2 more)

### Community 116 - "Modal"
Cohesion: 0.09
Nodes (35): AgentsClient(), exportAgents(), save(), CheckPill(), MultiInput(), toBody(), BulkImportAgentsModal(), downloadAgentTemplate() (+27 more)

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 621 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ApprovalsView.tsx`, `UsersClient.tsx`, `ManagerClientsList.tsx`, `cn`, `SalesmenTargetsClient.tsx`, `[kind]/page.tsx`, `tasks-list.ts`, `ClientOverview.tsx`, `clients/route.ts`, `formatAmount`, `orders-list.ts`, `freight.ts`, `list-params.ts`, `SalesmanTasksList.tsx`, `enquiry-flow.ts`, `company.ts`, `EnquiriesClient.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `utils.ts`, `package.json`, `PageHeader`, `leave-actions.ts`, `scoping.ts`, `buttonVariants`, `proxy.ts`, `client.ts`, `company-actions.ts`, `getSalesPalSession`, `enquiry-follow-ups.ts`, `task.ts`, `admin/clients/[id]/page.tsx`, `app/layout.tsx`, `enquiries.ts`, `my-overview/page.tsx`, `EnquiryDetailSheet.tsx`, `company-documents.ts`, `locations.ts`, `SalesPal Architecture`, `salesman-report.ts`, `EmailTemplatesClient.tsx`, `cached-queries.ts`, `report-pdf.tsx`, `ClientSwitcher.tsx`, `ui/Badge.tsx`, `orders/[id]/page.tsx`, `accounts/page.tsx`, `next.config.ts`, `agent-quote/[token]/page.tsx`, `Modal`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ApprovalsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09805735430157261 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `ApprovalsView.tsx`, `UsersClient.tsx`, `ManagerClientsList.tsx`, `PageSkeleton`, `SalesmenTargetsClient.tsx`, `[kind]/page.tsx`, `ClientOverview.tsx`, `formatAmount`, `Skeleton`, `freight.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `company.ts`, `EnquiriesClient.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `ThemeToggle.tsx`, `utils.ts`, `EnquiryForm.tsx`, `PageHeader`, `leave-actions.ts`, `buttonVariants`, `client.ts`, `accountant/page.tsx`, `ManagerClientsList`, `my-overview/page.tsx`, `BulkImportClientsModal.tsx`, `EnquiryDetailSheet.tsx`, `SendToAgentDialog.tsx`, `agents.ts`, `TaskOverview.tsx`, `EmailTemplatesClient.tsx`, `ClientSwitcher.tsx`, `ui/Badge.tsx`, `accounts/page.tsx`, `ClientDocumentsCard`, `agent-quote/[token]/page.tsx`, `Modal`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Should `UsersClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `ApprovalsView.tsx`, `UsersClient.tsx`, `ManagerClientsList.tsx`, `cn`, `SalesmenTargetsClient.tsx`, `[kind]/page.tsx`, `tasks-list.ts`, `ClientOverview.tsx`, `formatAmount`, `orders-list.ts`, `list-params.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `company.ts`, `EnquiriesClient.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `ThemeToggle.tsx`, `EnquiryForm.tsx`, `package.json`, `PageHeader`, `index.mjs`, `leave-actions.ts`, `buttonVariants`, `client.ts`, `getSalesPalSession`, `accountant/page.tsx`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `accountant/shipping-rates/page.tsx`, `my-overview/page.tsx`, `BulkImportClientsModal.tsx`, `SendToAgentDialog.tsx`, `SalesPal Architecture`, `EmailTemplatesClient.tsx`, `cached-queries.ts`, `admin/clients/page.tsx`, `dashboard-org/page.tsx`, `ClientSwitcher.tsx`, `orders/[id]/page.tsx`, `Modal`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._