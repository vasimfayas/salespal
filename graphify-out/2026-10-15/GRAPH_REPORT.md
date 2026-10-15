# Graph Report - salespal  (2026-10-15)

## Corpus Check
- 383 files · ~221,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2027 nodes · 7668 edges · 72 communities (67 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `39240d7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- CompaniesClient.tsx
- utils.ts
- enquiry-agent.ts
- CompanyReportPdf.tsx
- Input.tsx
- SalesmenTargetsClient.tsx
- formatAmount
- react
- clients/route.ts
- getTokenUserId
- Skeleton
- getSalesPalSession
- enquiry-fields.ts
- accountant/page.tsx
- SalesmanTasksList.tsx
- cn
- seed.ts
- enquiries.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- task.ts
- ManagerDashboardSections.tsx
- EnquiriesClient.tsx
- accounts/page.tsx
- admin-dashboard.ts
- next
- hasRole
- ApprovalsView.tsx
- dependencies
- @prisma/client
- package.json
- OrderList.tsx
- compilerOptions
- EnquiryForm
- scoping.ts
- client.ts
- ShippingRateTable.tsx
- my-overview/page.tsx
- PageSkeleton
- manager/clients/[id]/page.tsx
- cached-queries.ts
- index.mjs
- ui/Badge.tsx
- ClientHistory.tsx
- buttonVariants
- order.ts
- admin/layout.tsx
- tasks-list.ts
- client-history.ts
- AgentsClient.tsx
- revalidateEnquiryPages
- devDependencies
- app/layout.tsx
- buildEnquiryFormPdf
- approvals.ts
- scripts
- MonthlyTrendChart.tsx
- Frontend Design
- Card
- Badge
- README.md
- SalesPal UI Rules
- AGENTS.md
- bench.sh
- admin/clients/page.tsx
- manager/orders/page.tsx
- postcss.config.mjs
- check-errors.sh

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
- `GET()` --calls--> `getEnquiriesPage()`  [EXTRACTED]
  app/api/enquiries/route.ts → lib/enquiries.ts
- `PATCH()` --indirect_call--> `parseDateOnly()`  [INFERRED]
  app/api/orders/[id]/route.ts → lib/salesman-targets.ts
- `GET()` --calls--> `getSalesPalSession()`  [EXTRACTED]
  app/api/reports/jobs/route.ts → lib/auth.ts
- `DELETE()` --calls--> `hasRole()`  [EXTRACTED]
  app/api/shipping-rates/[id]/route.ts → lib/scoping.ts

## Import Cycles
- None detected.

## Communities (72 total, 5 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.06
Nodes (57): DashboardLayout(), DashboardIndex(), PremiumToggle(), AppShell(), LogoutOverlay(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups() (+49 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.08
Nodes (47): DELETE(), POST(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, ManagerTeamClient() (+39 more)

### Community 2 - "utils.ts"
Cohesion: 0.07
Nodes (50): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverviewProps (+42 more)

### Community 3 - "enquiry-agent.ts"
Cohesion: 0.13
Nodes (28): AgentQuotePage(), metadata, Notice(), POST(), SENDABLE, POST(), AGENT_LINK_VALID_DAYS, AgentEnquiry (+20 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.09
Nodes (48): GET(), runtime, CompanyReportPdf(), Cut(), Footer(), PdfLogo, TARGET_STATE, Bar() (+40 more)

### Community 5 - "Input.tsx"
Cohesion: 0.18
Nodes (14): KIND, controlBase, controlHeight, errorClass, hintClass, labelClass, InputProps, SelectProps (+6 more)

### Community 6 - "SalesmenTargetsClient.tsx"
Cohesion: 0.16
Nodes (19): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+11 more)

### Community 7 - "formatAmount"
Cohesion: 0.12
Nodes (34): ContactDetailsDialog(), ContactForm(), availableActions(), ConfirmDialog(), EnquiryStageActions(), FiguresDialog(), FiguresForm(), META (+26 more)

### Community 8 - "react"
Cohesion: 0.09
Nodes (44): EMPTY, ROLE_TONE, UserRow, Error(), AgentQuoteForm(), ApprovalDecision(), CreditRequestPanel(), EMPTY (+36 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.19
Nodes (25): PATCH(), PATCH(), GET(), POST(), handleStatusChange(), handleStatusChange(), cleanText(), CONTACT_FIELD_LABELS (+17 more)

### Community 10 - "getTokenUserId"
Cohesion: 0.22
Nodes (14): POST(), POST(), PATCH(), GET(), ACTIONS, POST(), enquiryScopeWhere(), ENQUIRY_FIELD_LABELS (+6 more)

### Community 11 - "Skeleton"
Cohesion: 0.07
Nodes (30): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+22 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.09
Nodes (38): handler, DELETE(), POST(), GET(), runtime, AgentsPage(), ApprovalsPage(), AccountantLayout() (+30 more)

### Community 13 - "enquiry-fields.ts"
Cohesion: 0.13
Nodes (33): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), Summary(), validLines(), CargoSection(), measurement() (+25 more)

### Community 14 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (22): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+14 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.10
Nodes (40): FollowUpsSection(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+32 more)

### Community 16 - "cn"
Cohesion: 0.19
Nodes (15): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+7 more)

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (36): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+28 more)

### Community 18 - "enquiries.ts"
Cohesion: 0.13
Nodes (34): OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), enquiryNeedsApproval(), clientFilterWhere(), ClientListItem, ClientListRow, clientListSelect (+26 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.10
Nodes (31): POST(), POST(), GET(), PATCH(), ACTIONS, POST(), GET(), ACTION_VERB (+23 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.17
Nodes (25): AdminDashboardPage(), PeriodKey, CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getPreviousPeriodRange(), getTimeAgo() (+17 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.10
Nodes (27): PackageLineInput, EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, Switch(), dimensionUnits (+19 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.12
Nodes (24): GET(), ChartSkeleton(), HeroSkeleton(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection() (+16 more)

### Community 23 - "task.ts"
Cohesion: 0.10
Nodes (23): POST(), DELETE(), PATCH(), GET(), POST(), revalidateClientViews(), applyLeadOutcome(), MOVES_FROM (+15 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.16
Nodes (27): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+19 more)

### Community 25 - "EnquiriesClient.tsx"
Cohesion: 0.09
Nodes (40): PremiumBadge(), ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient() (+32 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.16
Nodes (15): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, getPeriodRange(), DashboardFilters(), Org, SectionCard() (+7 more)

### Community 27 - "admin-dashboard.ts"
Cohesion: 0.12
Nodes (26): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), CACHE, DETAIL_LIMIT (+18 more)

### Community 28 - "next"
Cohesion: 0.11
Nodes (13): GET(), labelMap, PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+5 more)

### Community 29 - "hasRole"
Cohesion: 0.17
Nodes (17): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+9 more)

### Community 30 - "ApprovalsView.tsx"
Cohesion: 0.17
Nodes (17): ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL, ApprovalTimeline(), APPROVAL_KEEP_MONTHS, ApprovalView (+9 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "@prisma/client"
Cohesion: 0.11
Nodes (24): POST(), POST(), POST(), sweepDormantClients(), closeFollowUpTasks(), dueForFollowUp(), ensureEnquiryFollowUpTasks(), FOLLOW_UP_AFTER_DAYS (+16 more)

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (29): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+21 more)

### Community 34 - "OrderList.tsx"
Cohesion: 0.14
Nodes (15): ClientOverview(), OrderDetail(), OrderRole, OrderList(), flash(), openPayment(), submitPayment(), OrderListProps (+7 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "EnquiryForm"
Cohesion: 0.24
Nodes (11): packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), emptyEnquiryForm(), EnquiryForm(), GroupLabel(), Section() (+3 more)

### Community 37 - "scoping.ts"
Cohesion: 0.05
Nodes (93): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+85 more)

### Community 38 - "client.ts"
Cohesion: 0.06
Nodes (53): Org, ClientEnquiryFormPage(), metadata, Notice(), ClientDocumentsCard(), remove(), DialogState, DocumentDialog() (+45 more)

### Community 39 - "ShippingRateTable.tsx"
Cohesion: 0.06
Nodes (62): DELETE(), PATCH(), GET(), POST(), AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage() (+54 more)

### Community 40 - "my-overview/page.tsx"
Cohesion: 0.21
Nodes (19): GET(), ReportsPage(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), PerformanceCardsSection() (+11 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.23
Nodes (10): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton(), KpiSkeleton() (+2 more)

### Community 42 - "manager/clients/[id]/page.tsx"
Cohesion: 0.17
Nodes (17): ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams, ClientOverviewLoading(), ClientDetailContent(), ClientDetailPage(), HistorySection() (+9 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 44 - "index.mjs"
Cohesion: 0.16
Nodes (20): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), enquiryRef(), Footer(), getCompanyReport(), getManagerSalesmanIds(), getManagerSalesmanIdsForOrg() (+12 more)

### Community 45 - "ui/Badge.tsx"
Cohesion: 0.21
Nodes (11): clientStatusDot, CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME (+3 more)

### Community 46 - "ClientHistory.tsx"
Cohesion: 0.16
Nodes (20): ClientHistory(), Empty(), RecordLink(), Route(), OrderStatusBadge(), TONES, STATUS_ICONS, STATUS_TONES (+12 more)

### Community 47 - "buttonVariants"
Cohesion: 0.19
Nodes (12): LoginForm(), LoginPage(), NotFound(), CompanyForm(), CompanyFormModal(), FollowUpForm(), submit(), FollowUpModal() (+4 more)

### Community 48 - "order.ts"
Cohesion: 0.15
Nodes (12): MonthlyOrderStat, OPEN_ORDER_STATUSES, orderApprovalStatuses, OrderMode, orderModes, OrderPaymentItem, orderPaymentMethods, OrderPaymentMode (+4 more)

### Community 49 - "admin/layout.tsx"
Cohesion: 0.36
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.15
Nodes (19): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), CLOSED (+11 more)

### Community 51 - "client-history.ts"
Cohesion: 0.21
Nodes (13): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientHistory(), getClientOrdersPage() (+5 more)

### Community 52 - "AgentsClient.tsx"
Cohesion: 0.09
Nodes (31): handleReset(), AgentsClient(), exportAgents(), save(), COUNTRIES, EMPTY, MultiInput(), toBody() (+23 more)

### Community 53 - "revalidateEnquiryPages"
Cohesion: 0.22
Nodes (11): POST(), GET(), POST(), POST(), resolveEnquiryClient(), revalidateEnquiryPages(), enquiryDetailsData(), allowAttempt() (+3 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 56 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 57 - "approvals.ts"
Cohesion: 0.12
Nodes (24): ManagerEnquiriesPage(), ManagerReportsPage(), ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage(), SalesmanEnquiriesPage(), decide(), CreditAgreementCard() (+16 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "MonthlyTrendChart.tsx"
Cohesion: 0.29
Nodes (7): COLORS, compactMoney, fullMoney, TrendPoint, TrendSeries, MonthlyTrendChartLazy, MonthlyTrendChartWrapper()

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "Card"
Cohesion: 0.24
Nodes (9): KpiCard(), KpiCardProps, getDueDateColor(), Task, TaskCard(), Task, TaskList(), Card() (+1 more)

### Community 63 - "Badge"
Cohesion: 0.31
Nodes (7): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), ApprovalBadge(), Badge(), OrderApprovalStatus

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "admin/clients/page.tsx"
Cohesion: 0.31
Nodes (8): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), SalesmanDrilldownPage(), ClientTable(), getCachedAdminManagersList, getCachedAdminRelationsList, clientStatusCounts()

### Community 71 - "manager/orders/page.tsx"
Cohesion: 0.83
Nodes (3): ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton()

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 480 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Sidebar.tsx`, `CompaniesClient.tsx`, `utils.ts`, `enquiry-agent.ts`, `CompanyReportPdf.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `react`, `clients/route.ts`, `getTokenUserId`, `Skeleton`, `getSalesPalSession`, `SalesmanTasksList.tsx`, `enquiries.ts`, `enquiry-flow.ts`, `salesman/page.tsx`, `task.ts`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `admin-dashboard.ts`, `hasRole`, `ApprovalsView.tsx`, `@prisma/client`, `package.json`, `OrderList.tsx`, `scoping.ts`, `client.ts`, `ShippingRateTable.tsx`, `my-overview/page.tsx`, `manager/clients/[id]/page.tsx`, `cached-queries.ts`, `ClientHistory.tsx`, `buttonVariants`, `admin/layout.tsx`, `AgentsClient.tsx`, `revalidateEnquiryPages`, `app/layout.tsx`, `approvals.ts`, `MonthlyTrendChart.tsx`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058596491228070174 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Sidebar.tsx`, `CompaniesClient.tsx`, `utils.ts`, `Input.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `react`, `Skeleton`, `getSalesPalSession`, `enquiry-fields.ts`, `accountant/page.tsx`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `enquiry.ts`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `ApprovalsView.tsx`, `OrderList.tsx`, `EnquiryForm`, `scoping.ts`, `client.ts`, `ShippingRateTable.tsx`, `my-overview/page.tsx`, `PageSkeleton`, `ui/Badge.tsx`, `ClientHistory.tsx`, `buttonVariants`, `AgentsClient.tsx`, `Card`, `Badge`, `admin/clients/page.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07909604519774012 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Sidebar.tsx`, `CompaniesClient.tsx`, `utils.ts`, `Input.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `Skeleton`, `getSalesPalSession`, `accountant/page.tsx`, `SalesmanTasksList.tsx`, `cn`, `enquiries.ts`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `task.ts`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `package.json`, `OrderList.tsx`, `EnquiryForm`, `client.ts`, `ShippingRateTable.tsx`, `my-overview/page.tsx`, `manager/clients/[id]/page.tsx`, `cached-queries.ts`, `index.mjs`, `buttonVariants`, `admin/layout.tsx`, `tasks-list.ts`, `AgentsClient.tsx`, `approvals.ts`, `Card`, `admin/clients/page.tsx`, `manager/orders/page.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07494824016563147 - nodes in this community are weakly interconnected._