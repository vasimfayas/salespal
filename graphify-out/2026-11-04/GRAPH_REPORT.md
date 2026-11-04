# Graph Report - salespal  (2026-11-04)

## Corpus Check
- 470 files · ~277,532 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2549 nodes · 9679 edges · 119 communities (113 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3d6a7d63`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ApprovalsView.tsx
- tasks-list.ts
- ManagerClientsList.tsx
- PageSkeleton
- manager-actions.ts
- TaskCalendar.tsx
- [kind]/page.tsx
- task.ts
- ClientOverview.tsx
- clients/route.ts
- Button
- Skeleton
- my-overview/page.tsx
- freight.ts
- list-params.ts
- SalesmanTasksList.tsx
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- AdminDashboardSections.tsx
- company.ts
- formatAmount
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- next
- ThemeToggle.tsx
- Changelog
- react
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- getTokenUserId
- package.json
- getSalesPalSession
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- leave-actions.ts
- 1.2.0 - 2026-10-28
- scoping.ts
- 1.7.0 - 2026-10-29
- QuoteLinesField.tsx
- proxy.ts
- bcryptjs
- CompaniesClient.tsx
- email-queue.ts
- lib/auth.ts
- admin/layout.tsx
- enquiry-agent.ts
- agent-quote/[token]/route.ts
- accountant/page.tsx
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- ref_node_assert
- order.ts
- scripts
- tooltip.tsx
- dashboard-org/page.tsx
- Frontend Design
- buildEnquiryFormPdf
- 1.5.0 - 2026-10-29
- README.md
- SalesPal UI Rules
- 1.6.0 - 2026-10-29
- enquiries.ts
- AGENTS.md
- bench.sh
- salesman/page.tsx
- BulkImportClientsModal.tsx
- company-report.ts
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- company-documents.ts
- Topbar.tsx
- Bug log
- CompanyReportForm.tsx
- user-actions.ts
- Sidebar.tsx
- salesman/clients/page.tsx
- SalesPal Architecture
- salesman-report.ts
- EmailTemplatesClient.tsx
- salesman/orders/page.tsx
- cached-queries.ts
- client.ts
- report-pdf.tsx
- types/auth.ts
- cn
- kpi.ts
- buttonVariants
- CompanyComparisonCard.tsx
- orders/[id]/page.tsx
- accounts/page.tsx
- admin/clients/page.tsx
- ui/Badge.tsx
- next.config.ts
- overrides
- ClientTable.tsx
- nav-meta.ts
- formatDate
- 1.11.0 - 2026-11-02
- quote-options.ts
- leave-badges.ts
- UserMenu.tsx
- 5.4 Tables and columns
- error-log.ts
- TaskOverview.tsx
- ClientSwitcher.tsx
- 3. Folder map
- LocationsClient
- instrumentation.ts
- eslint.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 253 edges
2. `next` - 172 edges
3. `getSalesPalSession()` - 140 edges
4. `prisma` - 131 edges
5. `react` - 120 edges
6. `Skeleton()` - 114 edges
7. `lucide-react` - 113 edges
8. `Button` - 99 edges
9. `PageHeader()` - 93 edges
10. `isOwnerRole()` - 82 edges

## Surprising Connections (you probably didn't know these)
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.3 Schema management` --references--> `parentIdsWithCr()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/clients-list.ts
- `2026-11-03: A client can't be linked to more than one company (postponed)` --references--> `resolveEnquiryClient()`  [INFERRED]
  docs/bugs/BUGS.md → lib/enquiries.ts
- `Orders and money` --references--> `syncOrderPayments()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/order-payments.ts

## Import Cycles
- None detected.

## Communities (119 total, 6 thin omitted)

### Community 0 - "ApprovalsView.tsx"
Cohesion: 0.09
Nodes (43): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalDecision(), decide(), ApprovalCard() (+35 more)

### Community 1 - "tasks-list.ts"
Cohesion: 0.13
Nodes (22): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds() (+14 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.10
Nodes (34): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors (+26 more)

### Community 3 - "PageSkeleton"
Cohesion: 0.19
Nodes (13): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+5 more)

### Community 4 - "manager-actions.ts"
Cohesion: 0.20
Nodes (18): DELETE(), POST(), ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies(), unassignSalesmanFromManager(), createSalesmanAction() (+10 more)

### Community 5 - "TaskCalendar.tsx"
Cohesion: 0.19
Nodes (24): addDays(), addMonths(), AddTaskDialog(), Chip(), DayPanel(), fmt(), iso(), KIND_ORDER (+16 more)

### Community 6 - "[kind]/page.tsx"
Cohesion: 0.15
Nodes (25): CompanyOverviewPage(), SOURCE_LABELS, ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), Ctx (+17 more)

### Community 7 - "task.ts"
Cohesion: 0.08
Nodes (31): GET(), POST(), POST(), DELETE(), PATCH(), GET(), GET(), POST() (+23 more)

### Community 8 - "ClientOverview.tsx"
Cohesion: 0.15
Nodes (10): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect(), taskStatuses, PremiumBadge() (+2 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.15
Nodes (32): GET(), PATCH(), GET(), PATCH(), PATCH(), DELETE(), PATCH(), allowedOrgIdsFor() (+24 more)

### Community 10 - "Button"
Cohesion: 0.09
Nodes (49): Error(), TaskForm(), DocumentDialog(), ContactForm(), DeleteClientButton(), EmailTemplateEditor(), AgentOption, AgentQuotes() (+41 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (25): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+17 more)

### Community 12 - "my-overview/page.tsx"
Cohesion: 0.15
Nodes (24): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), PerformanceCardsSection(), StatCard() (+16 more)

### Community 13 - "freight.ts"
Cohesion: 0.12
Nodes (29): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), PackageLineInput, packageLinesPayload(), Summary(), validLines() (+21 more)

### Community 14 - "list-params.ts"
Cohesion: 0.12
Nodes (32): AdminMyClientsPage(), MyClientsSection(), AdminOrdersPage(), ManagerMyClientsPage(), MyClientsSection(), SalesmanDrilldownPage(), clientFilterWhere(), ClientListItem (+24 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.12
Nodes (30): FollowUpsSection(), ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel(), EMPTY_MESSAGES, SalesmanTasksList() (+22 more)

### Community 16 - "1.10.0 - 2026-11-01"
Cohesion: 0.40
Nodes (5): 1.10.0 - 2026-11-01, Added, Changed, Deploy note, Fixed

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (37): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+29 more)

### Community 18 - "1.8.0 - 2026-10-29"
Cohesion: 0.40
Nodes (5): 1.8.0 - 2026-10-29, Added, Changed, Deploy note, Fixed

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.08
Nodes (46): POST(), POST(), POST(), POST(), ACTIONS, POST(), 5.5 Status flows (summary), APPROVAL_KEEP_MONTHS (+38 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.12
Nodes (38): AdminDashboardPage(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo(), HeroSkeleton(), KpiCardsRow() (+30 more)

### Community 21 - "company.ts"
Cohesion: 0.16
Nodes (21): Org, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard(), docUrl() (+13 more)

### Community 22 - "formatAmount"
Cohesion: 0.14
Nodes (28): OrderDetail(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+20 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (34): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+26 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.11
Nodes (37): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+29 more)

### Community 25 - "next"
Cohesion: 0.07
Nodes (43): DELETE(), Params, PATCH(), GET(), POST(), labelMap, DELETE(), load() (+35 more)

### Community 26 - "ThemeToggle.tsx"
Cohesion: 0.23
Nodes (12): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioItem (+4 more)

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "react"
Cohesion: 0.09
Nodes (37): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), AgentsClient(), save(), EMPTY (+29 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.22
Nodes (26): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+18 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "getTokenUserId"
Cohesion: 0.24
Nodes (12): POST(), GET(), PATCH(), ACTIONS, POST(), GET(), OrderAction, orderPaymentsInclude (+4 more)

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (27): name, prisma, seed, private, version, class-variance-authority, clsx, fflate (+19 more)

### Community 34 - "getSalesPalSession"
Cohesion: 0.12
Nodes (28): GET(), AgentsPage(), ApprovalsPage(), AgentsPage(), ApprovalsPage(), EmailTemplatesPage(), AdminEnquiriesPage(), LocationsPage() (+20 more)

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
Cohesion: 0.20
Nodes (19): authorize(), coverCandidates(), endLeave(), extendLeave(), getLeaveInfo(), iso(), leaveClash(), LeaveInfo (+11 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "scoping.ts"
Cohesion: 0.09
Nodes (45): GET(), POST(), DELETE(), POST(), CalendarPage(), submit(), CalendarPerson, 4.3 Scoping (who sees which rows) (+37 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "QuoteLinesField.tsx"
Cohesion: 0.31
Nodes (10): saveDraft(), QuoteLinesField(), quoteLinesPayload(), cents(), emptyQuoteLine(), filledQuoteLines(), MAX_QUOTE_LINES, QuoteLine (+2 more)

### Community 44 - "bcryptjs"
Cohesion: 0.40
Nodes (3): prisma, ROLES, bcryptjs

### Community 45 - "CompaniesClient.tsx"
Cohesion: 0.15
Nodes (28): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, CompanyAccountantsPanel(), initials(), KINDS, Person (+20 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.15
Nodes (19): 9. Background work, caching and scheduled jobs, parseFilters(), text(), emailLogo(), TYPES, deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE (+11 more)

### Community 47 - "lib/auth.ts"
Cohesion: 0.17
Nodes (10): handler, AccountantLayout(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton() (+2 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.40
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "enquiry-agent.ts"
Cohesion: 0.19
Nodes (13): esc(), renderEmail(), AGENT_LINK_VALID_DAYS, AgentEnquiry, agentShipmentRows(), MODE, qty(), sendAgentRequestEmail() (+5 more)

### Community 50 - "agent-quote/[token]/route.ts"
Cohesion: 0.38
Nodes (7): POST(), POST(), agentLinkExpired(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 51 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (23): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+15 more)

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.07
Nodes (56): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+48 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.07
Nodes (57): openEdit(), ChoiceChips(), ContainerChips(), EnquiryForm(), enquiryFormFrom(), EnquiryFormState, GroupLabel(), JOB_REF_GROUPS (+49 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "ref_node_assert"
Cohesion: 0.21
Nodes (6): Enquiries and quotes, enquiryListOrder(), base, containersLabel(), equipmentLabel(), primaryContainer()

### Community 57 - "order.ts"
Cohesion: 0.11
Nodes (17): TONES, STATUS_ICONS, STATUS_TONES, StatusTone, TONE_ICONS, toneClasses, MonthlyOrderStat, OPEN_ORDER_STATUSES (+9 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "tooltip.tsx"
Cohesion: 0.18
Nodes (13): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), SimpleTooltip(), Tooltip (+5 more)

### Community 60 - "dashboard-org/page.tsx"
Cohesion: 0.20
Nodes (17): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+9 more)

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
Cohesion: 0.09
Nodes (44): DELETE(), GET(), PUT(), POST(), PATCH(), POST(), SENDABLE, GET() (+36 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.11
Nodes (29): ChartSkeleton(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection(), ORDER_MONTH_NAMES, QUICK_ACTIONS (+21 more)

### Community 71 - "BulkImportClientsModal.tsx"
Cohesion: 0.12
Nodes (22): handleReset(), exportAgents(), handleFile(), downloadAgentTemplate(), split(), BulkImportClientsModal(), close(), handleFile() (+14 more)

### Community 73 - "company-report.ts"
Cohesion: 0.14
Nodes (20): GET(), placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n(), Num (+12 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.17
Nodes (19): ManagerTeamClientProps, currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths(), ProgressBar() (+11 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.08
Nodes (47): ApprovalChip(), CHIP, DetailsPendingChip(), CopyRefButton(), AwaitingClient(), canEditEnquiry(), CompanyTag(), daysOpen() (+39 more)

### Community 79 - "company-documents.ts"
Cohesion: 0.09
Nodes (48): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+40 more)

### Community 80 - "Topbar.tsx"
Cohesion: 0.18
Nodes (16): AppShell(), LogoutOverlay(), CommandPalette(), DashboardContentWrapper(), getBreadcrumbs(), useNavigation(), RouteProgress(), readSidebar() (+8 more)

### Community 81 - "Bug log"
Cohesion: 0.29
Nodes (6): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), 2026-11-03: A client can't be linked to more than one company (postponed), Bug log, Fixed, Open

### Community 82 - "CompanyReportForm.tsx"
Cohesion: 0.12
Nodes (22): KIND, LocationPicker(), Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote() (+14 more)

### Community 83 - "user-actions.ts"
Cohesion: 0.31
Nodes (11): remove(), save(), canManageRole(), createUser(), deleteUser(), parseUser(), Result, revalidateUsers() (+3 more)

### Community 84 - "Sidebar.tsx"
Cohesion: 0.22
Nodes (14): getNavGroups(), getNavItems(), isNavActive(), Brand(), OWNER_TABS, Sidebar(), SidebarNav(), tabBarItems() (+6 more)

### Community 85 - "salesman/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage()

### Community 86 - "SalesPal Architecture"
Cohesion: 0.15
Nodes (12): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 4.1 Roles, 4.2 Sign-in, 4. Roles, authentication and data scoping (+4 more)

### Community 87 - "salesman-report.ts"
Cohesion: 0.24
Nodes (12): GET(), runtime, currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth() (+4 more)

### Community 88 - "EmailTemplatesClient.tsx"
Cohesion: 0.21
Nodes (13): EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), COMMON, EMAIL_TEMPLATE_EDITOR_ROLES, EMAIL_DEFAULTS, EMAIL_TEMPLATE_KEYS (+5 more)

### Community 89 - "salesman/orders/page.tsx"
Cohesion: 0.83
Nodes (3): OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage()

### Community 90 - "cached-queries.ts"
Cohesion: 0.20
Nodes (17): GET(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), OrderStatsSection(), ManagerOrderStatsSection(), OrderMonthlyChart(), OrderMonthlyChartPoint (+9 more)

### Community 91 - "client.ts"
Cohesion: 0.14
Nodes (17): DialogState, ClientStatusDropdown(), CLIENT_DOC_TYPES, ClientCategory, clientCategoryLabels, ClientDocType, ClientDocumentItem, ClientListItem (+9 more)

### Community 92 - "report-pdf.tsx"
Cohesion: 0.20
Nodes (15): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+7 more)

### Community 93 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 94 - "cn"
Cohesion: 0.11
Nodes (28): AgentQuotePage(), metadata, Notice(), AgentQuoteForm(), CreditRequestPanel(), EMPTY, Latest, Lookup (+20 more)

### Community 95 - "kpi.ts"
Cohesion: 0.29
Nodes (7): calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem, KpiStatus

### Community 96 - "buttonVariants"
Cohesion: 0.20
Nodes (11): LoginForm(), LoginPage(), NotFound(), SmartAlertBanner(), FollowUpForm(), submit(), FollowUpModal(), formatDateTime() (+3 more)

### Community 97 - "CompanyComparisonCard.tsx"
Cohesion: 0.28
Nodes (8): CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME, statusDotClass

### Community 98 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 99 - "accounts/page.tsx"
Cohesion: 0.14
Nodes (15): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, COLORS, compactMoney, fullMoney, TrendPoint (+7 more)

### Community 100 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 101 - "ui/Badge.tsx"
Cohesion: 0.20
Nodes (11): clientStatusDot, ApprovalBadge(), getDueDateColor(), Task, TaskCard(), Task, TaskList(), Badge() (+3 more)

### Community 103 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

### Community 104 - "ClientTable.tsx"
Cohesion: 0.17
Nodes (9): Client, ClientAssignee, ClientTable(), Company, Manager, ManagerSalesman, useDebouncedParam(), useUrlFilters() (+1 more)

### Community 105 - "nav-meta.ts"
Cohesion: 0.19
Nodes (10): DashboardIndex(), GROUPS, ICONS, isShortcutActive(), NavGroup, NavItem, ROLE_LABELS, navConfig (+2 more)

### Community 106 - "formatDate"
Cohesion: 0.27
Nodes (13): FollowUpDialog(), submit(), LeadOutcomeDialog(), submit(), todayPlus(), LeaveButton(), end(), load() (+5 more)

### Community 107 - "1.11.0 - 2026-11-02"
Cohesion: 0.67
Nodes (3): 1.11.0 - 2026-11-02, Added, Changed

### Community 108 - "quote-options.ts"
Cohesion: 0.33
Nodes (9): Ctx, DELETE(), load(), PATCH(), POST(), parseQuoteLines(), OPEN, parseQuoteOption() (+1 more)

### Community 109 - "leave-badges.ts"
Cohesion: 0.29
Nodes (8): DashboardLayout(), CoverBanner(), clean(), NavigationContext, NavigationContextType, NavigationProvider(), getCoveringFor(), activeLeaveWhere()

### Community 110 - "UserMenu.tsx"
Cohesion: 0.42
Nodes (8): UserMenu(), PerformanceReportButton(), recentMonths(), Popover, PopoverClose, PopoverContent, PopoverTrigger, @radix-ui/react-popover

### Community 111 - "5.4 Tables and columns"
Cohesion: 0.22
Nodes (9): 5.1 Connection, 5.2 Entity relationship diagram, 5.3 Schema management, 5.4 Tables and columns, 5. Database, Orders and money, Roles, companies, people, Targets, approvals, reports (+1 more)

### Community 112 - "error-log.ts"
Cohesion: 0.36
Nodes (5): POST(), cut(), ERROR_KEEP_DAYS, Input, logError()

### Community 113 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 114 - "ClientSwitcher.tsx"
Cohesion: 0.52
Nodes (6): clientStatusDotClass(), ClientSwitcher(), go(), readRecent(), rememberClient(), Result

### Community 115 - "3. Folder map"
Cohesion: 0.29
Nodes (5): 3. Folder map, useKpi(), useShippingRates(), useTasks(), TaskListItem

### Community 116 - "LocationsClient"
Cohesion: 0.53
Nodes (5): LocationsClient(), changed(), remove(), save(), resetLocations()

### Community 117 - "instrumentation.ts"
Cohesion: 0.40
Nodes (3): Clients, onRequestError(), register()

### Community 118 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 614 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ApprovalsView.tsx`, `tasks-list.ts`, `ManagerClientsList.tsx`, `manager-actions.ts`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `task.ts`, `ClientOverview.tsx`, `clients/route.ts`, `Button`, `my-overview/page.tsx`, `list-params.ts`, `SalesmanTasksList.tsx`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `company.ts`, `formatAmount`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `react`, `getTokenUserId`, `package.json`, `getSalesPalSession`, `leave-actions.ts`, `scoping.ts`, `proxy.ts`, `CompaniesClient.tsx`, `lib/auth.ts`, `admin/layout.tsx`, `agent-quote/[token]/route.ts`, `admin/clients/[id]/page.tsx`, `tooltip.tsx`, `dashboard-org/page.tsx`, `enquiries.ts`, `salesman/page.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `company-documents.ts`, `Topbar.tsx`, `user-actions.ts`, `Sidebar.tsx`, `salesman-report.ts`, `EmailTemplatesClient.tsx`, `cached-queries.ts`, `client.ts`, `report-pdf.tsx`, `cn`, `buttonVariants`, `CompanyComparisonCard.tsx`, `orders/[id]/page.tsx`, `accounts/page.tsx`, `next.config.ts`, `ClientTable.tsx`, `nav-meta.ts`, `quote-options.ts`, `leave-badges.ts`, `error-log.ts`, `ClientSwitcher.tsx`, `instrumentation.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ApprovalsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08862745098039215 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `ApprovalsView.tsx`, `ManagerClientsList.tsx`, `PageSkeleton`, `manager-actions.ts`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `ClientOverview.tsx`, `Button`, `Skeleton`, `my-overview/page.tsx`, `freight.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `company.ts`, `formatAmount`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `ThemeToggle.tsx`, `react`, `getSalesPalSession`, `QuoteLinesField.tsx`, `CompaniesClient.tsx`, `accountant/page.tsx`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `order.ts`, `tooltip.tsx`, `salesman/page.tsx`, `BulkImportClientsModal.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Topbar.tsx`, `CompanyReportForm.tsx`, `Sidebar.tsx`, `client.ts`, `buttonVariants`, `CompanyComparisonCard.tsx`, `accounts/page.tsx`, `ui/Badge.tsx`, `ClientTable.tsx`, `formatDate`, `UserMenu.tsx`, `TaskOverview.tsx`, `ClientSwitcher.tsx`, `LocationsClient`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Should `tasks-list.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13230769230769232 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ApprovalsView.tsx`, `tasks-list.ts`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `ClientOverview.tsx`, `Button`, `my-overview/page.tsx`, `freight.ts`, `list-params.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `company.ts`, `formatAmount`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `ThemeToggle.tsx`, `package.json`, `getSalesPalSession`, `index.mjs`, `CompaniesClient.tsx`, `lib/auth.ts`, `admin/layout.tsx`, `accountant/page.tsx`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `tooltip.tsx`, `dashboard-org/page.tsx`, `salesman/page.tsx`, `BulkImportClientsModal.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Topbar.tsx`, `CompanyReportForm.tsx`, `Sidebar.tsx`, `salesman/clients/page.tsx`, `EmailTemplatesClient.tsx`, `salesman/orders/page.tsx`, `cached-queries.ts`, `client.ts`, `cn`, `buttonVariants`, `orders/[id]/page.tsx`, `admin/clients/page.tsx`, `ClientTable.tsx`, `leave-badges.ts`, `UserMenu.tsx`, `ClientSwitcher.tsx`, `3. Folder map`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._