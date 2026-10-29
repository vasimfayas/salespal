# Graph Report - salespal  (2026-10-29)

## Corpus Check
- 423 files · ~248,718 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2269 nodes · 8551 edges · 81 communities (75 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `986c6619`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrderList.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- hasRole
- CompanyReportPdf.tsx
- SalesPal Architecture
- SalesmenTargetsClient.tsx
- formatAmount
- AgentsClient.tsx
- clients/route.ts
- next
- Skeleton
- getSalesPalSession
- freight.ts
- accountant-dashboard.ts
- SalesmanTasksList.tsx
- enquiry-follow-ups.ts
- seed.ts
- admin/clients/page.tsx
- enquiries.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- clients/[id]/documents/[docId]/route.ts
- ManagerDashboardSections.tsx
- EnquiriesClient.tsx
- accounts/page.tsx
- Changelog
- order.ts
- next-auth
- ApprovalsView.tsx
- dependencies
- scoping.ts
- package.json
- enquiry-agent.ts
- compilerOptions
- index.mjs
- prisma.ts
- buttonVariants
- ShippingRateTable.tsx
- my-overview/page.tsx
- PageSkeleton
- admin/clients/[id]/page.tsx
- cached-queries.ts
- SectionCard
- user-actions.ts
- TaskCard.tsx
- utils.ts
- react
- admin/layout.tsx
- tasks-list.ts
- salesman-report.ts
- lucide-react
- orders/[id]/page.tsx
- devDependencies
- app/layout.tsx
- manager/clients/page.tsx
- [...nextauth]/route.ts
- scripts
- report-pdf.tsx
- LocationsClient.tsx
- Frontend Design
- buildEnquiryFormPdf
- cn
- README.md
- SalesPal UI Rules
- ClientOverview.tsx
- AgentsClient
- AGENTS.md
- bench.sh
- client.ts
- list-params.ts
- EnquiryForm
- postcss.config.mjs
- check-errors.sh
- company-report.ts
- Sidebar.tsx
- Bug log
- agent-quote/[token]/route.ts
- salesman/clients/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 233 edges
2. `next` - 158 edges
3. `getSalesPalSession()` - 132 edges
4. `prisma` - 119 edges
5. `react` - 109 edges
6. `Skeleton()` - 108 edges
7. `lucide-react` - 101 edges
8. `Button` - 89 edges
9. `PageHeader()` - 87 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `3. Folder map` --references--> `useShippingRates()`  [INFERRED]
  docs/ARCHITECTURE.md → hooks/useShippingRates.ts
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

## Communities (81 total, 6 thin omitted)

### Community 0 - "OrderList.tsx"
Cohesion: 0.18
Nodes (16): OrderRole, OrderList(), flash(), openPayment(), submitPayment(), OrderListProps, orderNo(), PaidBar() (+8 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.08
Nodes (49): DELETE(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, ManagerTeamClient(), handleAddSubmit() (+41 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.08
Nodes (52): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors (+44 more)

### Community 3 - "hasRole"
Cohesion: 0.14
Nodes (21): DELETE(), Params, PATCH(), GET(), POST(), POST(), DELETE(), Params (+13 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.22
Nodes (26): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+18 more)

### Community 5 - "SalesPal Architecture"
Cohesion: 0.05
Nodes (34): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 4.1 Roles, 4.2 Sign-in (+26 more)

### Community 6 - "SalesmenTargetsClient.tsx"
Cohesion: 0.17
Nodes (18): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+10 more)

### Community 7 - "formatAmount"
Cohesion: 0.06
Nodes (72): GET(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt() (+64 more)

### Community 8 - "AgentsClient.tsx"
Cohesion: 0.11
Nodes (26): handleReset(), exportAgents(), EMPTY, AGENT_COLUMNS, BulkImportAgentsModal(), handleFile(), downloadAgentTemplate(), EXAMPLE (+18 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.15
Nodes (29): GET(), labelMap, PATCH(), GET(), PATCH(), PATCH(), GET(), DELETE() (+21 more)

### Community 11 - "Skeleton"
Cohesion: 0.07
Nodes (28): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+20 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.13
Nodes (33): GET(), ApprovalsPage(), AccountantEnquiriesPage(), AccountantLayout(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage() (+25 more)

### Community 13 - "freight.ts"
Cohesion: 0.14
Nodes (23): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), PackageLineInput, Summary(), validLines(), CargoPackage (+15 more)

### Community 14 - "accountant-dashboard.ts"
Cohesion: 0.24
Nodes (11): AWAITING_DETAILS(), AwaitingOrder, DEFAULT_CREDIT_DAYS, getAccountantDashboard(), getPastDuePage(), PAST_DUE_PAGE_SIZE, PastDuePage, ReceivableOrder (+3 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.11
Nodes (29): OrderDetail(), FollowUpsSection(), OrderPayments(), ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel() (+21 more)

### Community 16 - "enquiry-follow-ups.ts"
Cohesion: 0.23
Nodes (13): POST(), FOLLOW_UP_CATEGORIES, POST(), dueForFollowUp(), ensureEnquiryFollowUpTasks(), extendFollowUpTasks(), FOLLOW_UP_AFTER_DAYS, nextFollowUpDate() (+5 more)

### Community 17 - "seed.ts"
Cohesion: 0.09
Nodes (35): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+27 more)

### Community 18 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 19 - "enquiries.ts"
Cohesion: 0.09
Nodes (45): POST(), PATCH(), ACTIONS, POST(), POST(), ACTIONS, enquiryNeedsApproval(), submitApproval() (+37 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (36): AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getPreviousPeriodRange() (+28 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.09
Nodes (38): EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, ENQUIRY_FIELD_LABELS, EnquiryDetails, measurement() (+30 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.12
Nodes (28): ChartSkeleton(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES, QUICK_ACTIONS, SalesmanDashboardPage() (+20 more)

### Community 23 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.18
Nodes (22): DELETE(), load(), Params, PATCH(), POST(), DELETE(), GET(), load() (+14 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (34): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+26 more)

### Community 25 - "EnquiriesClient.tsx"
Cohesion: 0.09
Nodes (42): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+34 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.14
Nodes (17): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, getPeriodRange(), DashboardFilters(), Org, COLORS (+9 more)

### Community 27 - "Changelog"
Cohesion: 0.07
Nodes (28): 1.0.0 - 2026-10-28, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.2.0 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.0 - 2026-10-28, 1.4.1 - 2026-10-28 (+20 more)

### Community 28 - "order.ts"
Cohesion: 0.13
Nodes (14): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderListItem, OrderMode, orderModes, OrderPaymentItem (+6 more)

### Community 29 - "next-auth"
Cohesion: 0.16
Nodes (24): POST(), POST(), POST(), GET(), PATCH(), POST(), GET(), POST() (+16 more)

### Community 30 - "ApprovalsView.tsx"
Cohesion: 0.08
Nodes (49): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalCard(), ApprovalsView(), CreditDetails() (+41 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "scoping.ts"
Cohesion: 0.07
Nodes (41): POST(), POST(), POST(), DELETE(), PATCH(), GET(), GET(), createLeadTasks() (+33 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (31): eslintConfig, nextConfig, name, prisma, seed, private, version, class-variance-authority (+23 more)

### Community 34 - "enquiry-agent.ts"
Cohesion: 0.06
Nodes (64): AgentQuotePage(), metadata, Notice(), DELETE(), GET(), PUT(), POST(), SENDABLE (+56 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.16
Nodes (20): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), enquiryRef(), Footer(), getCompanyReport(), getManagerSalesmanIds(), getManagerSalesmanIdsForOrg() (+12 more)

### Community 37 - "prisma.ts"
Cohesion: 0.10
Nodes (44): DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), GET(), safeName() (+36 more)

### Community 38 - "buttonVariants"
Cohesion: 0.20
Nodes (11): LoginForm(), LoginPage(), NotFound(), SmartAlertBanner(), FollowUpForm(), submit(), FollowUpModal(), formatDateTime() (+3 more)

### Community 39 - "ShippingRateTable.tsx"
Cohesion: 0.07
Nodes (53): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+45 more)

### Community 40 - "my-overview/page.tsx"
Cohesion: 0.13
Nodes (28): GET(), ReportsPage(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), PerformanceCardsSection() (+20 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 42 - "admin/clients/[id]/page.tsx"
Cohesion: 0.06
Nodes (64): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+56 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 44 - "SectionCard"
Cohesion: 0.29
Nodes (8): GET(), OrderStatsSection(), ManagerOrderStatsSection(), SectionCard(), OrderMonthlyChart(), OrderMonthlyChartPoint, getMonthlyOrderStats, orderStatsScope

### Community 45 - "user-actions.ts"
Cohesion: 0.35
Nodes (11): remove(), save(), canManageRole(), createUser(), deleteUser(), parseUser(), Result, revalidateUsers() (+3 more)

### Community 46 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 47 - "utils.ts"
Cohesion: 0.14
Nodes (19): EMPTY, Latest, ClientStatusDropdown(), CompanyReportForm(), iso(), Job, Progress(), emptyForm (+11 more)

### Community 48 - "react"
Cohesion: 0.11
Nodes (37): Error(), AgentQuoteForm(), MultiInput(), ApprovalDecision(), decide(), CreditRequestPanel(), ContactRow(), EMPTY (+29 more)

### Community 49 - "admin/layout.tsx"
Cohesion: 0.36
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.14
Nodes (20): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), todoPrivacySql(), CLOSED (+12 more)

### Community 51 - "salesman-report.ts"
Cohesion: 0.23
Nodes (13): GET(), runtime, currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth() (+5 more)

### Community 52 - "lucide-react"
Cohesion: 0.17
Nodes (15): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), orderNo(), overdueClass(), PastDueTable() (+7 more)

### Community 53 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 56 - "manager/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection()

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "report-pdf.tsx"
Cohesion: 0.17
Nodes (18): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, writeStoredFile() (+10 more)

### Community 60 - "LocationsClient.tsx"
Cohesion: 0.14
Nodes (19): KIND, LocationPicker(), choose(), EMPTY, KINDS, LocationsClient(), changed(), remove() (+11 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "cn"
Cohesion: 0.15
Nodes (18): AuthLayout(), getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), subscribe(), ThemeToggle(), useMounted() (+10 more)

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 65 - "SalesPal UI Rules"
Cohesion: 0.50
Nodes (3): Docs, graphify, SalesPal UI Rules

### Community 66 - "ClientOverview.tsx"
Cohesion: 0.15
Nodes (12): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect(), taskStatuses, ClientSwitcher() (+4 more)

### Community 67 - "AgentsClient"
Cohesion: 0.20
Nodes (8): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), save(), toBody(), getAgentRows()

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "client.ts"
Cohesion: 0.06
Nodes (50): Org, DialogState, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard() (+42 more)

### Community 71 - "list-params.ts"
Cohesion: 0.11
Nodes (35): AdminOrdersPage(), ManagerMyClientsPage(), MyClientsSection(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), SalesmanDrilldownPage(), OrdersListSection() (+27 more)

### Community 73 - "EnquiryForm"
Cohesion: 0.27
Nodes (10): packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), emptyEnquiryForm(), EnquiryForm(), GroupLabel(), Section() (+2 more)

### Community 76 - "company-report.ts"
Cohesion: 0.21
Nodes (14): MonthHeroSection(), CompanyReport, DETAIL_LIMIT, getCompanyReport(), n(), Num, getCompletedEnquiryProfit(), getSalesmenWithTargets() (+6 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.07
Nodes (52): DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups(), getNavItems() (+44 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 84 - "agent-quote/[token]/route.ts"
Cohesion: 0.28
Nodes (6): POST(), POST(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 95 - "salesman/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage()

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 544 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `OrderList.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `AgentsClient.tsx`, `Skeleton`, `getSalesPalSession`, `freight.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `enquiry.ts`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `ApprovalsView.tsx`, `enquiry-agent.ts`, `buttonVariants`, `ShippingRateTable.tsx`, `my-overview/page.tsx`, `PageSkeleton`, `admin/clients/[id]/page.tsx`, `SectionCard`, `utils.ts`, `react`, `lucide-react`, `LocationsClient.tsx`, `ClientOverview.tsx`, `AgentsClient`, `client.ts`, `EnquiryForm`, `company-report.ts`, `Sidebar.tsx`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08032786885245902 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `OrderList.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `hasRole`, `SalesPal Architecture`, `SalesmenTargetsClient.tsx`, `formatAmount`, `AgentsClient.tsx`, `clients/route.ts`, `getSalesPalSession`, `SalesmanTasksList.tsx`, `enquiry-follow-ups.ts`, `enquiries.ts`, `salesman/page.tsx`, `clients/[id]/documents/[docId]/route.ts`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `next-auth`, `ApprovalsView.tsx`, `scoping.ts`, `package.json`, `enquiry-agent.ts`, `prisma.ts`, `buttonVariants`, `ShippingRateTable.tsx`, `my-overview/page.tsx`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `SectionCard`, `user-actions.ts`, `utils.ts`, `react`, `admin/layout.tsx`, `salesman-report.ts`, `lucide-react`, `orders/[id]/page.tsx`, `app/layout.tsx`, `report-pdf.tsx`, `LocationsClient.tsx`, `ClientOverview.tsx`, `client.ts`, `list-params.ts`, `Sidebar.tsx`, `agent-quote/[token]/route.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07603603603603604 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `ShippingRateTable.tsx`, `list-params.ts`, `my-overview/page.tsx`, `formatAmount`, `cached-queries.ts`, `getSalesPalSession`, `admin/clients/[id]/page.tsx`, `PageSkeleton`, `admin/clients/page.tsx`, `tasks-list.ts`, `AdminDashboardSections.tsx`, `orders/[id]/page.tsx`, `salesman/page.tsx`, `manager/clients/page.tsx`, `ManagerDashboardSections.tsx`, `cn`, `salesman/clients/page.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._