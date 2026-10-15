# Graph Report - salespal  (2026-10-15)

## Corpus Check
- 383 files · ~221,397 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2028 nodes · 7673 edges · 84 communities (77 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `39240d7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- @prisma/client
- ManagerClientsList.tsx
- enquiry-agent.ts
- CompanyReportPdf.tsx
- Input.tsx
- SalesmenTargetsClient.tsx
- Button
- Modal
- clients/route.ts
- next
- Skeleton
- getSalesPalSession
- EnquiryDetailSheet.tsx
- accountant/page.tsx
- buttonVariants
- cn
- seed.ts
- list-params.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- task.ts
- ManagerDashboardSections.tsx
- EnquiriesClient.tsx
- accounts/page.tsx
- pipeline-metrics.ts
- proxy.ts
- hasRole
- CreditRequestPanel.tsx
- dependencies
- enquiry-follow-ups.ts
- package.json
- formatDate
- compilerOptions
- EnquiryForm.tsx
- isOwnerRole
- CompaniesClient.tsx
- ShippingRateTable.tsx
- formatAmount
- PageSkeleton
- manager/clients/[id]/page.tsx
- cached-queries.ts
- index.mjs
- client.ts
- ClientHistory.tsx
- utils.ts
- order.ts
- admin/layout.tsx
- tasks-list.ts
- client-history.ts
- ShippingRateTable
- agent-quote/[token]/route.ts
- devDependencies
- app/layout.tsx
- buildEnquiryFormPdf
- prisma.ts
- scripts
- report-pdf.tsx
- UsersClient.tsx
- Frontend Design
- UserMenu.tsx
- Badge
- README.md
- SalesPal UI Rules
- ClientOverview.tsx
- salesman-report.ts
- AGENTS.md
- bench.sh
- ClientTable.tsx
- orders-list.ts
- Topbar.tsx
- postcss.config.mjs
- check-errors.sh
- company-report.ts
- LocationPicker.tsx
- types/auth.ts
- OrderDetail
- ClientContactsCard
- ApprovalDecision.tsx
- LoginForm
- salesman/clients/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 213 edges
2. `next` - 139 edges
3. `getSalesPalSession()` - 118 edges
4. `Skeleton()` - 106 edges
5. `prisma` - 104 edges
6. `react` - 101 edges
7. `lucide-react` - 95 edges
8. `PageHeader()` - 79 edges
9. `Button` - 77 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `CompanyReportPdf()` --indirect_call--> `Cut()`  [INFERRED]
  .worker/index.mjs → components/reports/CompanyReportPdf.tsx
- `PATCH()` --indirect_call--> `parseDateOnly()`  [INFERRED]
  app/api/orders/[id]/route.ts → lib/salesman-targets.ts
- `GET()` --calls--> `getSalesPalSession()`  [EXTRACTED]
  app/api/reports/jobs/route.ts → lib/auth.ts
- `handleAddSubmit()` --calls--> `createSalesmanAction()`  [EXTRACTED]
  app/dashboard/manager/team/ManagerTeamClient.tsx → lib/actions/manager-actions.ts
- `saveCompanies()` --calls--> `setSalesmanCompaniesAction()`  [EXTRACTED]
  app/dashboard/manager/team/ManagerTeamClient.tsx → lib/actions/manager-actions.ts

## Import Cycles
- None detected.

## Communities (84 total, 7 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.08
Nodes (40): DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), DashboardContentWrapper(), getNavGroups(), getNavItems(), GROUPS (+32 more)

### Community 1 - "@prisma/client"
Cohesion: 0.15
Nodes (19): DELETE(), POST(), DELETE(), POST(), POST(), createSalesmanAction(), setSalesmanCompaniesAction(), verifyManager() (+11 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.09
Nodes (35): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), handleReset(), ManagerClientsListProps, SalesmanItem, Client (+27 more)

### Community 3 - "enquiry-agent.ts"
Cohesion: 0.12
Nodes (25): POST(), AGENT_LINK_VALID_DAYS, AgentEnquiry, agentEnquirySelect, agentShipmentRows(), MODE, qty(), sendAgentRequestEmail() (+17 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.23
Nodes (26): CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col, compact() (+18 more)

### Community 5 - "Input.tsx"
Cohesion: 0.21
Nodes (12): CompanyReportForm(), iso(), Job, Progress(), controlBase, controlHeight, errorClass, hintClass (+4 more)

### Community 6 - "SalesmenTargetsClient.tsx"
Cohesion: 0.18
Nodes (17): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+9 more)

### Community 7 - "Button"
Cohesion: 0.14
Nodes (33): Error(), DocumentDialog(), ContactDetailsDialog(), ContactForm(), availableActions(), ConfirmDialog(), EnquiryStageActions(), FiguresDialog() (+25 more)

### Community 8 - "Modal"
Cohesion: 0.09
Nodes (37): AgentsClient(), exportAgents(), save(), COUNTRIES, EMPTY, MultiInput(), toBody(), AGENT_COLUMNS (+29 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.19
Nodes (25): PATCH(), PATCH(), POST(), handleStatusChange(), handleStatusChange(), cleanText(), CONTACT_FIELD_LABELS, ContactFields (+17 more)

### Community 10 - "next"
Cohesion: 0.10
Nodes (32): POST(), POST(), PATCH(), POST(), SENDABLE, GET(), ACTIONS, POST() (+24 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (23): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+15 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.12
Nodes (26): handler, AgentsPage(), ApprovalsPage(), AccountantLayout(), AgentsPage(), ApprovalsPage(), AdminEnquiriesPage(), AdminSalesmenPage() (+18 more)

### Community 13 - "EnquiryDetailSheet.tsx"
Cohesion: 0.09
Nodes (40): CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, packageLinesPayload(), Summary(), validLines(), submit() (+32 more)

### Community 14 - "accountant/page.tsx"
Cohesion: 0.19
Nodes (21): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+13 more)

### Community 15 - "buttonVariants"
Cohesion: 0.11
Nodes (32): NotFound(), ClientPicker(), Option, ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel() (+24 more)

### Community 16 - "cn"
Cohesion: 0.19
Nodes (16): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel (+8 more)

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (36): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+28 more)

### Community 18 - "list-params.ts"
Cohesion: 0.13
Nodes (29): GET(), AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), SalesmanEnquiriesPage() (+21 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.09
Nodes (40): POST(), POST(), GET(), PATCH(), ACTIONS, POST(), GET(), POST() (+32 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (36): AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getPeriodRange() (+28 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.09
Nodes (33): ENQUIRY_FIELD_LABELS, EnquiryDetails, measurement(), packingList(), parseEnquiryDetails(), unNumbers(), round3(), toKg() (+25 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.12
Nodes (25): GET(), ChartSkeleton(), FollowUpsSection(), HeroSkeleton(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection() (+17 more)

### Community 23 - "task.ts"
Cohesion: 0.09
Nodes (27): POST(), DELETE(), PATCH(), GET(), GET(), POST(), createLeadTasks(), Db (+19 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (35): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+27 more)

### Community 25 - "EnquiriesClient.tsx"
Cohesion: 0.14
Nodes (23): PremiumBadge(), ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient() (+15 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.13
Nodes (17): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), Org, COLORS, compactMoney (+9 more)

### Community 27 - "pipeline-metrics.ts"
Cohesion: 0.27
Nodes (12): KpiCardsSection(), clientScope(), COHORT_DAYS, currentStatusCounts(), eventScope(), PipelineScope, Range, statusEntries() (+4 more)

### Community 29 - "hasRole"
Cohesion: 0.16
Nodes (19): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+11 more)

### Community 30 - "CreditRequestPanel.tsx"
Cohesion: 0.23
Nodes (13): ACTION_LABEL, ApprovalTimeline(), EMPTY, Latest, formatDateTime(), APPROVAL_FLOWS, ApprovalLogEntry, ApprovalType (+5 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "enquiry-follow-ups.ts"
Cohesion: 0.19
Nodes (15): POST(), POST(), FOLLOW_UP_CATEGORIES, POST(), APPROVAL_KEEP_MONTHS, dueForFollowUp(), ensureEnquiryFollowUpTasks(), extendFollowUpTasks() (+7 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (31): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+23 more)

### Community 34 - "formatDate"
Cohesion: 0.11
Nodes (31): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), ApprovalCard() (+23 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "EnquiryForm.tsx"
Cohesion: 0.15
Nodes (20): emptyPackageLine(), ClientEnquiryForm(), openEdit(), ChoiceChips(), emptyEnquiryForm(), EnquiryForm(), enquiryFormFrom(), EnquiryFormState (+12 more)

### Community 37 - "isOwnerRole"
Cohesion: 0.11
Nodes (45): DELETE(), GET(), load(), Params, PATCH(), Params, POST(), DELETE() (+37 more)

### Community 38 - "CompaniesClient.tsx"
Cohesion: 0.07
Nodes (60): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org, User, ClientEnquiryFormPage(), metadata, Notice() (+52 more)

### Community 39 - "ShippingRateTable.tsx"
Cohesion: 0.10
Nodes (30): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+22 more)

### Community 40 - "formatAmount"
Cohesion: 0.17
Nodes (26): GET(), ReportsPage(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), SalesmanDrilldownPage() (+18 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.23
Nodes (10): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton(), KpiSkeleton() (+2 more)

### Community 42 - "manager/clients/[id]/page.tsx"
Cohesion: 0.17
Nodes (22): ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams, ClientOverviewLoading(), ClientDetailContent(), ClientDetailPage(), HistorySection() (+14 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 44 - "index.mjs"
Cohesion: 0.16
Nodes (20): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), enquiryRef(), Footer(), getCompanyReport(), getManagerSalesmanIds(), getManagerSalesmanIdsForOrg() (+12 more)

### Community 45 - "client.ts"
Cohesion: 0.08
Nodes (32): clientStatusDot, ClientStatusDropdown(), CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS (+24 more)

### Community 46 - "ClientHistory.tsx"
Cohesion: 0.23
Nodes (14): ClientHistory(), Empty(), RecordLink(), Route(), iconTones, KpiTile(), Tone, AppRole (+6 more)

### Community 47 - "utils.ts"
Cohesion: 0.11
Nodes (19): AgentQuotePage(), metadata, Notice(), AgentQuoteForm(), EMPTY, Main, Lookup, FollowUpForm() (+11 more)

### Community 48 - "order.ts"
Cohesion: 0.14
Nodes (15): OrderStatusBadge(), TONES, MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderListItem, OrderMode (+7 more)

### Community 49 - "admin/layout.tsx"
Cohesion: 0.29
Nodes (8): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), MonthlyActivityChartProps, EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.15
Nodes (18): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), CLOSED (+10 more)

### Community 51 - "client-history.ts"
Cohesion: 0.21
Nodes (13): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientHistory(), getClientOrdersPage() (+5 more)

### Community 52 - "ShippingRateTable"
Cohesion: 0.14
Nodes (23): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+15 more)

### Community 53 - "agent-quote/[token]/route.ts"
Cohesion: 0.30
Nodes (6): POST(), agentLinkExpired(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 56 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 57 - "prisma.ts"
Cohesion: 0.13
Nodes (28): GET(), labelMap, PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+20 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "report-pdf.tsx"
Cohesion: 0.17
Nodes (18): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, writeStoredFile() (+10 more)

### Community 60 - "UsersClient.tsx"
Cohesion: 0.22
Nodes (17): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), remove(), save(), canManageRole() (+9 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "UserMenu.tsx"
Cohesion: 0.20
Nodes (14): ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies(), UserMenu(), PerformanceReportButton(), recentMonths(), Avatar() (+6 more)

### Community 63 - "Badge"
Cohesion: 0.17
Nodes (13): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton(), ApprovalBadge(), getDueDateColor() (+5 more)

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 66 - "ClientOverview.tsx"
Cohesion: 0.15
Nodes (12): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, taskStatuses, clientStatusDotClass(), ClientSwitcher() (+4 more)

### Community 67 - "salesman-report.ts"
Cohesion: 0.23
Nodes (13): GET(), runtime, clientStatusCounts(), currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num (+5 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "ClientTable.tsx"
Cohesion: 0.16
Nodes (13): Action(), ClientReach(), Contact, Option, options(), Client, ClientTable(), Company (+5 more)

### Community 71 - "orders-list.ts"
Cohesion: 0.18
Nodes (15): AdminOrdersPage(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), Paged (+7 more)

### Community 73 - "Topbar.tsx"
Cohesion: 0.24
Nodes (8): PremiumToggle(), CommandPalette(), getBreadcrumbs(), Topbar(), SimpleTooltip(), Tooltip, TooltipContent, TooltipTrigger

### Community 76 - "company-report.ts"
Cohesion: 0.23
Nodes (13): CompanyReport, DETAIL_LIMIT, getCompanyReport(), n(), Num, getCompletedEnquiryProfit(), getSalesmenWithTargets(), getTargetAchievements() (+5 more)

### Community 77 - "LocationPicker.tsx"
Cohesion: 0.26
Nodes (10): KIND, LocationPicker(), choose(), COUNTRIES, CountryDef, FREIGHT_LOCATIONS, FreightLocation, KIND_FOR_MODE (+2 more)

### Community 78 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 79 - "OrderDetail"
Cohesion: 0.52
Nodes (5): OrderDetailLoading(), OrderDetail(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 80 - "ClientContactsCard"
Cohesion: 0.33
Nodes (3): blank(), ClientContactsCard(), ContactRow()

### Community 81 - "ApprovalDecision.tsx"
Cohesion: 0.60
Nodes (4): ApprovalDecision(), decide(), decideApprovalAction(), sonner

### Community 83 - "salesman/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage()

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 480 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Sidebar.tsx`, `@prisma/client`, `ManagerClientsList.tsx`, `SalesmenTargetsClient.tsx`, `Button`, `Modal`, `clients/route.ts`, `getSalesPalSession`, `EnquiryDetailSheet.tsx`, `buttonVariants`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `task.ts`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `proxy.ts`, `hasRole`, `CreditRequestPanel.tsx`, `enquiry-follow-ups.ts`, `package.json`, `formatDate`, `isOwnerRole`, `CompaniesClient.tsx`, `ShippingRateTable.tsx`, `formatAmount`, `manager/clients/[id]/page.tsx`, `cached-queries.ts`, `ClientHistory.tsx`, `utils.ts`, `order.ts`, `admin/layout.tsx`, `tasks-list.ts`, `ShippingRateTable`, `agent-quote/[token]/route.ts`, `app/layout.tsx`, `prisma.ts`, `report-pdf.tsx`, `UsersClient.tsx`, `ClientOverview.tsx`, `salesman-report.ts`, `orders-list.ts`, `Topbar.tsx`, `OrderDetail`, `ApprovalDecision.tsx`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0792156862745098 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Sidebar.tsx`, `ManagerClientsList.tsx`, `Input.tsx`, `SalesmenTargetsClient.tsx`, `Button`, `Modal`, `Skeleton`, `getSalesPalSession`, `EnquiryDetailSheet.tsx`, `accountant/page.tsx`, `buttonVariants`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `CreditRequestPanel.tsx`, `formatDate`, `EnquiryForm.tsx`, `CompaniesClient.tsx`, `ShippingRateTable.tsx`, `formatAmount`, `PageSkeleton`, `manager/clients/[id]/page.tsx`, `client.ts`, `ClientHistory.tsx`, `utils.ts`, `ShippingRateTable`, `UsersClient.tsx`, `UserMenu.tsx`, `Badge`, `ClientOverview.tsx`, `ClientTable.tsx`, `Topbar.tsx`, `LocationPicker.tsx`, `LoginForm`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09292929292929293 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `orders-list.ts`, `formatAmount`, `PageSkeleton`, `manager/clients/[id]/page.tsx`, `cached-queries.ts`, `getSalesPalSession`, `accountant/page.tsx`, `OrderDetail`, `cn`, `list-params.ts`, `tasks-list.ts`, `ShippingRateTable`, `salesman/clients/page.tsx`, `salesman/page.tsx`, `AdminDashboardSections.tsx`, `ManagerDashboardSections.tsx`, `Badge`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `enquiry-agent.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._