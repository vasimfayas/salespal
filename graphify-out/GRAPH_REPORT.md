# Graph Report - salespal  (2026-10-14)

## Corpus Check
- 377 files · ~214,510 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 1977 nodes · 7537 edges · 79 communities (73 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3831dd1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- isOwnerRole
- ManagerClientsList.tsx
- enquiries.ts
- CompanyReportPdf.tsx
- ShippingRateModal.tsx
- SalesmenTargetsClient.tsx
- formatAmount
- Button
- clients/route.ts
- scoping.ts
- Skeleton
- PageHeader
- freight.ts
- accountant/page.tsx
- SalesmanTasksList.tsx
- cn
- seed.ts
- list-params.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- enquiry.ts
- orderStatsScope
- @prisma/client
- ManagerDashboardSections.tsx
- EnquiryDetailSheet.tsx
- accounts/page.tsx
- salesman/page.tsx
- next
- hasRole
- ApprovalsView.tsx
- dependencies
- client-status-flow.ts
- package.json
- OrderList.tsx
- compilerOptions
- EnquiryForm.tsx
- company-documents.ts
- CompanyDocumentsPanel.tsx
- utils.ts
- my-overview/page.tsx
- PageSkeleton
- dashboard-org/page.tsx
- cached-queries.ts
- getSalesPalSession
- client.ts
- manager/clients/[id]/page.tsx
- react
- order.ts
- admin/layout.tsx
- salesman/tasks/page.tsx
- clients/[id]/documents/[docId]/route.ts
- BulkImportClientsModal.tsx
- enquiry-form/[token]/route.ts
- devDependencies
- shipping-rate.ts
- buildEnquiryFormPdf
- [salesmanId]/page.tsx
- scripts
- EnquiriesClient
- types/auth.ts
- Frontend Design
- TaskCard.tsx
- TaskOverview.tsx
- README.md
- SalesPal UI Rules
- OrderDetail
- logo/route.ts
- AGENTS.md
- bench.sh
- admin/clients/page.tsx
- manager/orders/page.tsx
- manager/tasks/page.tsx
- postcss.config.mjs
- check-errors.sh
- StatCard.tsx
- eslint.config.mjs
- prisma

## God Nodes (most connected - your core abstractions)
1. `cn()` - 213 edges
2. `next` - 137 edges
3. `getSalesPalSession()` - 113 edges
4. `Skeleton()` - 106 edges
5. `prisma` - 101 edges
6. `react` - 100 edges
7. `lucide-react` - 95 edges
8. `PageHeader()` - 79 edges
9. `Button` - 77 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `DashboardIndex()` --calls--> `getSalesPalSession()`  [EXTRACTED]
  app/dashboard/page.tsx → lib/auth.ts
- `DeltaBadge()` --calls--> `cn()`  [EXTRACTED]
  components/dashboard/AdminDashboardSections.tsx → lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/Card.tsx → lib/utils.ts
- `AuthLayout()` --calls--> `ThemeToggle()`  [EXTRACTED]
  app/(auth)/layout.tsx → components/shared/ThemeToggle.tsx
- `LoginForm()` --calls--> `cn()`  [EXTRACTED]
  app/(auth)/login/LoginForm.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (79 total, 6 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.06
Nodes (58): DashboardLayout(), DashboardIndex(), appFont, metadata, RootLayout(), viewport, Providers(), AppShell() (+50 more)

### Community 1 - "isOwnerRole"
Cohesion: 0.06
Nodes (64): DELETE(), POST(), DELETE(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User (+56 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.06
Nodes (58): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverview() (+50 more)

### Community 3 - "enquiries.ts"
Cohesion: 0.10
Nodes (38): POST(), PATCH(), POST(), SENDABLE, GET(), POST(), POST(), CONTACT_FIELD_LABELS (+30 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.07
Nodes (62): GET(), runtime, GET(), runtime, CompanyReportPdf(), Cut(), Footer(), PdfLogo (+54 more)

### Community 5 - "ShippingRateModal.tsx"
Cohesion: 0.11
Nodes (27): EMPTY, Latest, ClientStatusDropdown(), KIND, LocationPicker(), choose(), CompanyReportForm(), iso() (+19 more)

### Community 6 - "SalesmenTargetsClient.tsx"
Cohesion: 0.24
Nodes (13): currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths(), ProgressBar(), SalesmenTargetsClient() (+5 more)

### Community 7 - "formatAmount"
Cohesion: 0.11
Nodes (37): availableActions(), ConfirmDialog(), EnquiryStageActions(), FiguresDialog(), FiguresForm(), META, orderToReopen(), primaryAction() (+29 more)

### Community 8 - "Button"
Cohesion: 0.09
Nodes (41): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), Error(), AgentsClient(), save() (+33 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.15
Nodes (30): PATCH(), PATCH(), GET(), POST(), handleStatusChange(), handleStatusChange(), cleanText(), ContactFields (+22 more)

### Community 10 - "scoping.ts"
Cohesion: 0.17
Nodes (21): POST(), POST(), POST(), GET(), PATCH(), GET(), POST(), POST() (+13 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (25): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+17 more)

### Community 12 - "PageHeader"
Cohesion: 0.14
Nodes (19): AgentsPage(), ApprovalsPage(), AgentsPage(), ApprovalsPage(), AdminSalesmenPage(), AgentsPage(), ApprovalsPage(), ManagerEnquiriesPage() (+11 more)

### Community 13 - "freight.ts"
Cohesion: 0.14
Nodes (23): CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, packageLinesPayload(), Summary(), validLines(), submit() (+15 more)

### Community 14 - "accountant/page.tsx"
Cohesion: 0.15
Nodes (25): GET(), AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo() (+17 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.10
Nodes (38): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), ClientPicker() (+30 more)

### Community 16 - "cn"
Cohesion: 0.14
Nodes (17): AuthLayout(), ApprovalBadge(), CompanyCheckboxes(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuLabel (+9 more)

### Community 17 - "seed.ts"
Cohesion: 0.09
Nodes (35): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+27 more)

### Community 18 - "list-params.ts"
Cohesion: 0.12
Nodes (33): AdminTasksPage(), clientFilterWhere(), ClientListItem, ClientListRow, clientListSelect, dateRange(), intParam(), literal() (+25 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.12
Nodes (26): ACTIONS, POST(), ACTIONS, POST(), enquiryNeedsApproval(), statusAfterOrder(), ACTION_VERB, Actor (+18 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (37): AdminDashboardPage(), PeriodKey, clientStatusDot, CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getPeriodRange() (+29 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.11
Nodes (28): ENQUIRY_FIELD_LABELS, EnquiryDetails, measurement(), packingList(), parseEnquiryDetails(), unNumbers(), round3(), ACTIVE_ENQUIRY_STATUSES (+20 more)

### Community 22 - "orderStatsScope"
Cohesion: 0.36
Nodes (7): GET(), OrderStatsSection(), ManagerOrderStatsSection(), OrderMonthlyChart(), OrderMonthlyChartPoint, getMonthlyOrderStats, orderStatsScope

### Community 23 - "@prisma/client"
Cohesion: 0.10
Nodes (23): DELETE(), PATCH(), GET(), GET(), POST(), createLeadTasks(), Db, describe() (+15 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.13
Nodes (32): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+24 more)

### Community 25 - "EnquiryDetailSheet.tsx"
Cohesion: 0.11
Nodes (23): EVENT_TEXT, figures(), History(), QUOTED_NOTES, Action, AGENT_LINK_VALID_DAYS, AgentEnquiry, agentEnquirySelect (+15 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.14
Nodes (16): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), Org, COLORS, compactMoney (+8 more)

### Community 27 - "salesman/page.tsx"
Cohesion: 0.13
Nodes (31): ChartSkeleton(), FollowUpsSection(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection(), ORDER_MONTH_NAMES (+23 more)

### Community 28 - "next"
Cohesion: 0.08
Nodes (27): GET(), labelMap, PATCH(), DELETE(), load(), Params, PATCH(), POST() (+19 more)

### Community 29 - "hasRole"
Cohesion: 0.17
Nodes (18): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), PATCH(), GET() (+10 more)

### Community 30 - "ApprovalsView.tsx"
Cohesion: 0.12
Nodes (26): ApprovalDecision(), decide(), ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL, decideApprovalAction() (+18 more)

### Community 31 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, bcryptjs, class-variance-authority, clsx, fflate, @fontsource/inter, lucide-react, @mantine/charts (+21 more)

### Community 32 - "client-status-flow.ts"
Cohesion: 0.13
Nodes (22): POST(), POST(), POST(), POST(), POST(), BLACKLISTED_ERROR, revalidateClientViews(), StatusSource (+14 more)

### Community 33 - "package.json"
Cohesion: 0.08
Nodes (25): name, private, version, class-variance-authority, clsx, @fontsource/inter, @mantine/hooks, prisma (+17 more)

### Community 34 - "OrderList.tsx"
Cohesion: 0.18
Nodes (18): EnquiryDetailSheet(), Field(), OrderRole, OrderList(), openPayment(), OrderListProps, orderNo(), OrderPayments() (+10 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "EnquiryForm.tsx"
Cohesion: 0.14
Nodes (19): emptyPackageLine(), openEdit(), CargoSection(), Section(), emptyEnquiryForm(), enquiryFormFrom(), EnquiryFormState, GroupLabel() (+11 more)

### Community 37 - "company-documents.ts"
Cohesion: 0.19
Nodes (20): DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), GET(), safeName() (+12 more)

### Community 38 - "CompanyDocumentsPanel.tsx"
Cohesion: 0.19
Nodes (16): Org, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, DocumentExpiryBadge(), styles (+8 more)

### Community 39 - "utils.ts"
Cohesion: 0.12
Nodes (23): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+15 more)

### Community 40 - "my-overview/page.tsx"
Cohesion: 0.14
Nodes (25): GET(), ReportsPage(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), PerformanceCardsSection() (+17 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.23
Nodes (10): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton(), KpiSkeleton() (+2 more)

### Community 42 - "dashboard-org/page.tsx"
Cohesion: 0.20
Nodes (17): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+9 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.27
Nodes (13): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), ManagerTeamClientProps, getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs (+5 more)

### Community 44 - "getSalesPalSession"
Cohesion: 0.17
Nodes (15): handler, AccountantLayout(), AdminEnquiriesPage(), AdminOrdersPage(), AdminShippingRatesPage(), UsersPage(), OperationsLayout(), OrdersListSection() (+7 more)

### Community 45 - "client.ts"
Cohesion: 0.17
Nodes (16): ClientDocumentsCard(), remove(), DialogState, DocumentDialog(), submit(), fileUrl(), ClientCategory, ClientDocumentItem (+8 more)

### Community 46 - "manager/clients/[id]/page.tsx"
Cohesion: 0.06
Nodes (55): ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams, ClientOverviewLoading(), ClientDetailContent(), ClientDetailPage(), HistorySection() (+47 more)

### Community 47 - "react"
Cohesion: 0.08
Nodes (36): AgentQuotePage(), metadata, Notice(), LoginForm(), LoginPage(), ClientEnquiryFormPage(), metadata, Notice() (+28 more)

### Community 48 - "order.ts"
Cohesion: 0.14
Nodes (13): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, orderModes, OrderPaymentItem, orderPaymentMethods (+5 more)

### Community 49 - "admin/layout.tsx"
Cohesion: 0.36
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "salesman/tasks/page.tsx"
Cohesion: 0.83
Nodes (3): SalesmanTasksPage(), TasksListSection(), TasksListSkeleton()

### Community 51 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.28
Nodes (14): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+6 more)

### Community 52 - "BulkImportClientsModal.tsx"
Cohesion: 0.12
Nodes (22): handleReset(), exportAgents(), handleFile(), downloadAgentTemplate(), split(), BulkImportClientsModal(), close(), handleFile() (+14 more)

### Community 53 - "enquiry-form/[token]/route.ts"
Cohesion: 0.25
Nodes (9): POST(), POST(), storeUploadedFile(), agentLinkExpired(), clientFormExpired(), allowAttempt(), clearAttempts(), clientIp() (+1 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "shipping-rate.ts"
Cohesion: 0.16
Nodes (11): ShippingRateModalProps, ShippingRateTableProps, ExchangeRates, airCarriers, carriersByMode, commonCarriers, CONTAINER_LABELS, ContainerType (+3 more)

### Community 56 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 57 - "[salesmanId]/page.tsx"
Cohesion: 0.21
Nodes (12): ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerMyClientsPage(), MyClientsSection(), SalesmanDrilldownPage(), ClientsListSection(), ClientsTableSkeleton() (+4 more)

### Community 58 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+2 more)

### Community 59 - "EnquiriesClient"
Cohesion: 0.21
Nodes (12): AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash(), post(), submitCreate() (+4 more)

### Community 60 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 63 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 66 - "OrderDetail"
Cohesion: 0.52
Nodes (5): OrderDetailLoading(), OrderDetail(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 67 - "logo/route.ts"
Cohesion: 0.38
Nodes (6): DELETE(), LOGO_TYPES, Params, POST(), revalidateCompanyViews(), COMPANY_LOGO_MAX_BYTES

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 71 - "manager/orders/page.tsx"
Cohesion: 0.83
Nodes (3): ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton()

### Community 73 - "manager/tasks/page.tsx"
Cohesion: 0.83
Nodes (3): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton()

### Community 76 - "StatCard.tsx"
Cohesion: 0.50
Nodes (3): chip, StatCardTheme, tone

### Community 77 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 469 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Sidebar.tsx`, `isOwnerRole`, `ManagerClientsList.tsx`, `enquiries.ts`, `CompanyReportPdf.tsx`, `ShippingRateModal.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `Button`, `clients/route.ts`, `scoping.ts`, `PageHeader`, `SalesmanTasksList.tsx`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `orderStatsScope`, `@prisma/client`, `ManagerDashboardSections.tsx`, `EnquiryDetailSheet.tsx`, `accounts/page.tsx`, `salesman/page.tsx`, `hasRole`, `ApprovalsView.tsx`, `client-status-flow.ts`, `package.json`, `OrderList.tsx`, `company-documents.ts`, `CompanyDocumentsPanel.tsx`, `utils.ts`, `my-overview/page.tsx`, `cached-queries.ts`, `getSalesPalSession`, `client.ts`, `manager/clients/[id]/page.tsx`, `react`, `admin/layout.tsx`, `clients/[id]/documents/[docId]/route.ts`, `enquiry-form/[token]/route.ts`, `[salesmanId]/page.tsx`, `OrderDetail`, `logo/route.ts`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05661005661005661 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Sidebar.tsx`, `isOwnerRole`, `ManagerClientsList.tsx`, `ShippingRateModal.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `Button`, `Skeleton`, `PageHeader`, `freight.ts`, `accountant/page.tsx`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `ManagerDashboardSections.tsx`, `EnquiryDetailSheet.tsx`, `accounts/page.tsx`, `salesman/page.tsx`, `ApprovalsView.tsx`, `OrderList.tsx`, `EnquiryForm.tsx`, `CompanyDocumentsPanel.tsx`, `utils.ts`, `my-overview/page.tsx`, `PageSkeleton`, `client.ts`, `manager/clients/[id]/page.tsx`, `react`, `BulkImportClientsModal.tsx`, `EnquiriesClient`, `TaskOverview.tsx`, `StatCard.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `isOwnerRole` be split into smaller, more focused modules?**
  _Cohesion score 0.0636030636030636 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `Sidebar.tsx`, `isOwnerRole`, `ManagerClientsList.tsx`, `ShippingRateModal.tsx`, `SalesmenTargetsClient.tsx`, `formatAmount`, `Button`, `freight.ts`, `accountant/page.tsx`, `SalesmanTasksList.tsx`, `cn`, `AdminDashboardSections.tsx`, `ManagerDashboardSections.tsx`, `EnquiryDetailSheet.tsx`, `accounts/page.tsx`, `salesman/page.tsx`, `ApprovalsView.tsx`, `package.json`, `OrderList.tsx`, `EnquiryForm.tsx`, `CompanyDocumentsPanel.tsx`, `utils.ts`, `my-overview/page.tsx`, `dashboard-org/page.tsx`, `client.ts`, `manager/clients/[id]/page.tsx`, `BulkImportClientsModal.tsx`, `TaskOverview.tsx`, `StatCard.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059097127222982215 - nodes in this community are weakly interconnected._