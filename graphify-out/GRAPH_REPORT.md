# Graph Report - salespal  (2026-10-14)

## Corpus Check
- 370 files · ~212,143 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 1946 nodes · 7394 edges · 69 communities (63 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f52ff845`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- OrderList
- CompanyReportPdf.tsx
- isOwnerRole
- next
- Button
- react
- clients/route.ts
- getTokenUserId
- Skeleton
- getSalesPalSession
- freight.ts
- salesman/clients/[id]/page.tsx
- OrderList.tsx
- ThemeToggle.tsx
- seed.ts
- orders-list.ts
- enquiry-flow.ts
- cn
- enquiry.ts
- salesman/page.tsx
- accountant/page.tsx
- ManagerDashboardSections.tsx
- prisma.ts
- MonthlyTrendChart.tsx
- admin-dashboard.ts
- EnquiryDetailSheet.tsx
- hasRole
- scoping.ts
- dependencies
- enquiry-follow-ups.ts
- package.json
- formatDate
- compilerOptions
- EnquiriesClient.tsx
- enquiryRef
- orderStatsScope
- ShippingRateTable.tsx
- performance.ts
- PageSkeleton
- dashboard-org/page.tsx
- cached-queries.ts
- UsersClient
- types/auth.ts
- ApprovalsView.tsx
- EnquiryForm
- TaskOverview.tsx
- admin/layout.tsx
- tasks-list.ts
- CompanyDocumentsPanel.tsx
- kpi.ts
- manager-dashboard.ts
- devDependencies
- client.ts
- buildEnquiryFormPdf
- client-history.ts
- scripts
- app/layout.tsx
- LoginForm.tsx
- Frontend Design
- README.md
- SalesPal UI Rules
- AGENTS.md
- bench.sh
- postcss.config.mjs
- check-errors.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 213 edges
2. `next` - 136 edges
3. `getSalesPalSession()` - 109 edges
4. `Skeleton()` - 102 edges
5. `prisma` - 99 edges
6. `react` - 97 edges
7. `lucide-react` - 93 edges
8. `PageHeader()` - 75 edges
9. `Button` - 74 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `num()`  [EXTRACTED]
  app/api/shipping-rates/route.ts → lib/decimal.ts
- `DashboardIndex()` --calls--> `getSalesPalSession()`  [EXTRACTED]
  app/dashboard/page.tsx → lib/auth.ts
- `DropdownMenuSubTrigger` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuSubContent` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (69 total, 6 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.06
Nodes (56): DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), CommandPalette(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups() (+48 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.08
Nodes (51): DELETE(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org, User, ManagerTeamClient() (+43 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.05
Nodes (79): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), handleReset(), ManagerClientsListProps, SalesmanItem, Client (+71 more)

### Community 3 - "OrderList"
Cohesion: 0.23
Nodes (12): ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), OrderList(), flash() (+4 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.08
Nodes (56): GET(), runtime, GET(), runtime, CompanyReportPdf(), Cut(), Footer(), PdfLogo (+48 more)

### Community 5 - "isOwnerRole"
Cohesion: 0.12
Nodes (39): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+31 more)

### Community 6 - "next"
Cohesion: 0.07
Nodes (30): GET(), POST(), labelMap, PATCH(), GET(), GET(), POST(), DELETE() (+22 more)

### Community 7 - "Button"
Cohesion: 0.06
Nodes (75): Error(), OrderDetail(), DocumentDialog(), ClientHistory(), Empty(), RecordLink(), Route(), ContactDetailsDialog() (+67 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (63): EMPTY, ROLE_TONE, UserRow, COUNTRIES, EMPTY, ACTION_LABEL, ApprovalTimeline(), CreditRequestPanel() (+55 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.16
Nodes (29): PATCH(), PATCH(), POST(), handleStatusChange(), handleStatusChange(), cleanText(), ContactFields, contactRequiredMessage() (+21 more)

### Community 10 - "getTokenUserId"
Cohesion: 0.22
Nodes (17): POST(), POST(), GET(), PATCH(), ACTIONS, POST(), POST(), FOLLOW_UP_CATEGORIES (+9 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (25): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+17 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.11
Nodes (28): handler, AgentsPage(), ApprovalsPage(), AccountantLayout(), AgentsPage(), ApprovalsPage(), AdminEnquiriesPage(), AdminSalesmenPage() (+20 more)

### Community 13 - "freight.ts"
Cohesion: 0.17
Nodes (21): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), Summary(), validLines(), CargoPackage, cargoTotals (+13 more)

### Community 14 - "salesman/clients/[id]/page.tsx"
Cohesion: 0.36
Nodes (7): ClientOverviewLoading(), ClientDetailContent(), ClientDetailPage(), HistorySection(), SearchParams, ClientHistorySkeleton(), getCachedClientDetail

### Community 15 - "OrderList.tsx"
Cohesion: 0.07
Nodes (52): FollowUpsSection(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+44 more)

### Community 16 - "ThemeToggle.tsx"
Cohesion: 0.19
Nodes (11): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+3 more)

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (37): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+29 more)

### Community 18 - "orders-list.ts"
Cohesion: 0.13
Nodes (30): AdminOrdersPage(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), SalesmanDrilldownPage(), ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage() (+22 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.13
Nodes (26): POST(), ACTIONS, POST(), enquiryNeedsApproval(), statusAfterOrder(), ACTION_VERB, Actor, applyEnquiryAction() (+18 more)

### Community 20 - "cn"
Cohesion: 0.08
Nodes (56): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, AdminDashboardPage(), PeriodKey, CardSkeleton(), CardSmallSkeleton() (+48 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.09
Nodes (42): PackageLineInput, EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, ENQUIRY_FIELD_LABELS, EnquiryDetails (+34 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.15
Nodes (22): actualProfit(), ChartSkeleton(), day(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES (+14 more)

### Community 23 - "accountant/page.tsx"
Cohesion: 0.14
Nodes (28): GET(), AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo() (+20 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.15
Nodes (28): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+20 more)

### Community 25 - "prisma.ts"
Cohesion: 0.14
Nodes (25): POST(), PATCH(), POST(), SENDABLE, GET(), POST(), POST(), POST() (+17 more)

### Community 26 - "MonthlyTrendChart.tsx"
Cohesion: 0.31
Nodes (6): COLORS, compactMoney, fullMoney, TrendPoint, TrendSeries, MonthlyTrendChartLazy

### Community 27 - "admin-dashboard.ts"
Cohesion: 0.17
Nodes (16): CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), clientScope(), COHORT_DAYS, cohortFunnel() (+8 more)

### Community 28 - "EnquiryDetailSheet.tsx"
Cohesion: 0.10
Nodes (34): CargoSection(), EnquiryDetailSheet(), EVENT_TEXT, Field(), figures(), History(), QUOTED_NOTES, Section() (+26 more)

### Community 29 - "hasRole"
Cohesion: 0.12
Nodes (23): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+15 more)

### Community 30 - "scoping.ts"
Cohesion: 0.12
Nodes (25): GET(), GET(), safeName(), POST(), ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+17 more)

### Community 31 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, bcryptjs, class-variance-authority, clsx, fflate, @fontsource/inter, lucide-react, @mantine/charts (+21 more)

### Community 32 - "enquiry-follow-ups.ts"
Cohesion: 0.16
Nodes (18): POST(), POST(), POST(), POST(), revalidateClientViews(), sweepDormantClients(), closeFollowUpTasks(), dueForFollowUp() (+10 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (30): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+22 more)

### Community 34 - "formatDate"
Cohesion: 0.12
Nodes (24): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+16 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "EnquiriesClient.tsx"
Cohesion: 0.11
Nodes (30): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+22 more)

### Community 37 - "enquiryRef"
Cohesion: 0.24
Nodes (14): AgentQuotePage(), metadata, Notice(), ClientEnquiryFormPage(), metadata, Notice(), AgentQuoteForm(), CompanyLogo() (+6 more)

### Community 38 - "orderStatsScope"
Cohesion: 0.36
Nodes (7): GET(), OrderStatsSection(), ManagerOrderStatsSection(), OrderMonthlyChart(), OrderMonthlyChartPoint, getMonthlyOrderStats, orderStatsScope

### Community 39 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (31): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+23 more)

### Community 40 - "performance.ts"
Cohesion: 0.27
Nodes (13): GET(), ReportsPage(), MonthHeroSection(), CompanyReportForm(), iso(), getAdminLeaderboard, groupStatusCounts(), byPerformance() (+5 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.23
Nodes (10): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton(), KpiSkeleton() (+2 more)

### Community 42 - "dashboard-org/page.tsx"
Cohesion: 0.20
Nodes (17): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+9 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.17
Nodes (19): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), OrderDetailLoading(), OrderDetailContent() (+11 more)

### Community 44 - "UsersClient"
Cohesion: 0.30
Nodes (13): roleName(), UsersClient(), remove(), save(), canManageRole(), createUser(), deleteUser(), parseUser() (+5 more)

### Community 45 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 46 - "ApprovalsView.tsx"
Cohesion: 0.14
Nodes (23): ApprovalDecision(), decide(), ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), decideApprovalAction(), applyOutcome() (+15 more)

### Community 47 - "EnquiryForm"
Cohesion: 0.23
Nodes (11): packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), emptyEnquiryForm(), EnquiryForm(), GroupLabel(), Section() (+3 more)

### Community 48 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 49 - "admin/layout.tsx"
Cohesion: 0.29
Nodes (8): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), MonthlyActivityChartProps, EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.16
Nodes (17): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), CLOSED, getTasksPage() (+9 more)

### Community 51 - "CompanyDocumentsPanel.tsx"
Cohesion: 0.16
Nodes (20): CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard(), docUrl(), DocumentExpiryBadge() (+12 more)

### Community 52 - "kpi.ts"
Cohesion: 0.29
Nodes (7): calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem, KpiStatus

### Community 53 - "manager-dashboard.ts"
Cohesion: 0.33
Nodes (6): CACHE, DETAIL_LIMIT, getManagerKpiCards, getManagerPendingTasks, TeamMember, recentEntries()

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "client.ts"
Cohesion: 0.18
Nodes (14): ClientDocumentsCard(), remove(), DialogState, submit(), fileUrl(), ClientCategory, ClientDocumentItem, ClientListItem (+6 more)

### Community 56 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 57 - "client-history.ts"
Cohesion: 0.21
Nodes (13): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientHistory(), getClientOrdersPage() (+5 more)

### Community 58 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+1 more)

### Community 59 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 467 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Sidebar.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `CompanyReportPdf.tsx`, `isOwnerRole`, `Button`, `react`, `clients/route.ts`, `getTokenUserId`, `getSalesPalSession`, `salesman/clients/[id]/page.tsx`, `OrderList.tsx`, `orders-list.ts`, `enquiry-flow.ts`, `cn`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `prisma.ts`, `MonthlyTrendChart.tsx`, `admin-dashboard.ts`, `EnquiryDetailSheet.tsx`, `hasRole`, `scoping.ts`, `enquiry-follow-ups.ts`, `package.json`, `formatDate`, `EnquiriesClient.tsx`, `enquiryRef`, `orderStatsScope`, `ShippingRateTable.tsx`, `performance.ts`, `cached-queries.ts`, `UsersClient`, `ApprovalsView.tsx`, `admin/layout.tsx`, `CompanyDocumentsPanel.tsx`, `manager-dashboard.ts`, `client.ts`, `app/layout.tsx`, `LoginForm.tsx`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05945945945945946 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Sidebar.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `OrderList`, `Button`, `react`, `Skeleton`, `getSalesPalSession`, `freight.ts`, `OrderList.tsx`, `ThemeToggle.tsx`, `enquiry.ts`, `salesman/page.tsx`, `accountant/page.tsx`, `ManagerDashboardSections.tsx`, `EnquiryDetailSheet.tsx`, `formatDate`, `EnquiriesClient.tsx`, `enquiryRef`, `ShippingRateTable.tsx`, `performance.ts`, `PageSkeleton`, `UsersClient`, `ApprovalsView.tsx`, `EnquiryForm`, `TaskOverview.tsx`, `CompanyDocumentsPanel.tsx`, `client.ts`, `LoginForm.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07680491551459294 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `OrderList`, `PageSkeleton`, `dashboard-org/page.tsx`, `cached-queries.ts`, `getSalesPalSession`, `salesman/clients/[id]/page.tsx`, `TaskOverview.tsx`, `orders-list.ts`, `tasks-list.ts`, `cn`, `salesman/page.tsx`, `accountant/page.tsx`, `ManagerDashboardSections.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04708164344912714 - nodes in this community are weakly interconnected._