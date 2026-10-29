# Graph Report - salespal  (2026-10-29)

## Corpus Check
- 435 files · ~256,161 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2347 nodes · 8771 edges · 83 communities (79 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0361e0a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- formatDate
- CompaniesClient.tsx
- ManagerClientsList.tsx
- TaskCalendar.tsx
- CompanyReportPdf.tsx
- SalesPal Architecture
- admin-drilldown.ts
- Button
- BulkImportClientsModal.tsx
- enquiries.ts
- prisma.ts
- Skeleton
- getSalesPalSession
- enquiry-fields.ts
- accountant/page.tsx
- buttonVariants
- enquiry-follow-ups.ts
- seed.ts
- clients/[id]/documents/[docId]/route.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- EnquiriesClient.tsx
- accounts/page.tsx
- Changelog
- order.ts
- salesman-target.ts
- UsersClient.tsx
- dependencies
- scoping.ts
- package.json
- next
- compilerOptions
- index.mjs
- isOwnerRole
- company-report.ts
- accountant/shipping-rates/page.tsx
- report-pdf.tsx
- PageSkeleton
- admin/clients/[id]/page.tsx
- cached-queries.ts
- salesman-report.ts
- client-history.ts
- app/layout.tsx
- dashboard-org/page.tsx
- TaskCard.tsx
- admin/layout.tsx
- tasks-list.ts
- admin/clients/page.tsx
- ApprovalsView.tsx
- orders/[id]/page.tsx
- devDependencies
- SearchParams
- TasksSection.tsx
- @prisma/client
- scripts
- email-queue.ts
- react
- Frontend Design
- buildEnquiryFormPdf
- cn
- README.md
- SalesPal UI Rules
- manager/clients/page.tsx
- AgentsClient
- AGENTS.md
- bench.sh
- client.ts
- list-params.ts
- ClientEnquiryForm.tsx
- postcss.config.mjs
- check-errors.sh
- salesman/clients/page.tsx
- salesman/orders/page.tsx
- eslint.config.mjs
- Sidebar.tsx
- Bug log
- clientStatusLabel
- revalidateEnquiryPages

## God Nodes (most connected - your core abstractions)
1. `cn()` - 236 edges
2. `next` - 163 edges
3. `getSalesPalSession()` - 134 edges
4. `prisma` - 123 edges
5. `react` - 110 edges
6. `Skeleton()` - 108 edges
7. `lucide-react` - 102 edges
8. `Button` - 90 edges
9. `PageHeader()` - 89 edges
10. `formatDate()` - 73 edges

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

## Communities (83 total, 4 thin omitted)

### Community 0 - "formatDate"
Cohesion: 0.10
Nodes (38): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), ClientTable() (+30 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.08
Nodes (50): POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org, User, ManagerTeamClient(), handleAddSubmit() (+42 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.05
Nodes (59): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverview() (+51 more)

### Community 3 - "TaskCalendar.tsx"
Cohesion: 0.10
Nodes (39): GET(), PATCH(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel() (+31 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.21
Nodes (27): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+19 more)

### Community 5 - "SalesPal Architecture"
Cohesion: 0.06
Nodes (28): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 4.1 Roles, 4.2 Sign-in (+20 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.16
Nodes (21): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), DrilldownPager(), clientsEntering(), countLostEnquiries() (+13 more)

### Community 7 - "Button"
Cohesion: 0.10
Nodes (45): Error(), OrderDetail(), TaskForm(), DocumentDialog(), ContactDetailsDialog(), ContactForm(), EmailTemplateEditor(), availableActions() (+37 more)

### Community 8 - "BulkImportClientsModal.tsx"
Cohesion: 0.12
Nodes (22): handleReset(), exportAgents(), handleFile(), downloadAgentTemplate(), split(), BulkImportClientsModal(), close(), handleFile() (+14 more)

### Community 9 - "enquiries.ts"
Cohesion: 0.10
Nodes (44): PATCH(), PATCH(), GET(), POST(), POST(), POST(), handleStatusChange(), handleStatusChange() (+36 more)

### Community 10 - "prisma.ts"
Cohesion: 0.08
Nodes (43): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+35 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (23): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+15 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.12
Nodes (27): handler, DELETE(), POST(), DELETE(), POST(), ApprovalsPage(), AccountantLayout(), ApprovalsPage() (+19 more)

### Community 13 - "enquiry-fields.ts"
Cohesion: 0.12
Nodes (35): CargoDimensionsField(), DIMENSIONS, PackageLineInput, Summary(), openEdit(), CargoSection(), enquiryFormFrom(), ENQUIRY_FIELD_LABELS (+27 more)

### Community 14 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (21): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+13 more)

### Community 15 - "buttonVariants"
Cohesion: 0.10
Nodes (33): NotFound(), ClientPicker(), Option, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState (+25 more)

### Community 16 - "enquiry-follow-ups.ts"
Cohesion: 0.18
Nodes (16): POST(), POST(), FOLLOW_UP_CATEGORIES, POST(), sweepDormantClients(), dueForFollowUp(), ensureEnquiryFollowUpTasks(), extendFollowUpTasks() (+8 more)

### Community 17 - "seed.ts"
Cohesion: 0.09
Nodes (35): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+27 more)

### Community 18 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.25
Nodes (17): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+9 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.09
Nodes (40): POST(), GET(), ACTIONS, POST(), POST(), GET(), PATCH(), ACTIONS (+32 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.09
Nodes (41): AdminDashboardPage(), PeriodKey, clientStatusDot, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge() (+33 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.09
Nodes (35): EnquiryFormState, GroupLabel(), JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, EnquiryEventItem, EnquiryFollowUpItem (+27 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.12
Nodes (34): CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), ChartSkeleton(), FollowUpsSection(), HeroSkeleton() (+26 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (33): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+25 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (35): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+27 more)

### Community 25 - "EnquiriesClient.tsx"
Cohesion: 0.06
Nodes (60): PremiumBadge(), ClientHistory(), Empty(), RecordLink(), Route(), ApprovalChip(), CHIP, AwaitingClient() (+52 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.11
Nodes (21): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), COLORS, compactMoney, fullMoney (+13 more)

### Community 27 - "Changelog"
Cohesion: 0.05
Nodes (37): 1.0.0 - 2026-10-28, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.2.0 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.0 - 2026-10-28, 1.4.1 - 2026-10-28 (+29 more)

### Community 28 - "order.ts"
Cohesion: 0.09
Nodes (20): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User, MonthlyOrderStat (+12 more)

### Community 29 - "salesman-target.ts"
Cohesion: 0.40
Nodes (4): ManagerTeamClientProps, SalesmanTargetRow, SalesmanTargetView, TargetState

### Community 30 - "UsersClient.tsx"
Cohesion: 0.10
Nodes (41): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), EMPTY, ROLE_TONE, roleName() (+33 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "scoping.ts"
Cohesion: 0.09
Nodes (38): GET(), POST(), labelMap, PATCH(), GET(), GET(), POST(), GET() (+30 more)

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (28): nextConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+20 more)

### Community 34 - "next"
Cohesion: 0.06
Nodes (57): AgentQuotePage(), metadata, Notice(), DELETE(), GET(), PUT(), POST(), SENDABLE (+49 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.12
Nodes (26): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+18 more)

### Community 37 - "isOwnerRole"
Cohesion: 0.12
Nodes (33): DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), GET(), safeName() (+25 more)

### Community 38 - "company-report.ts"
Cohesion: 0.15
Nodes (18): GET(), 9. Background work, caching and scheduled jobs, placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n() (+10 more)

### Community 39 - "accountant/shipping-rates/page.tsx"
Cohesion: 0.30
Nodes (11): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+3 more)

### Community 40 - "report-pdf.tsx"
Cohesion: 0.19
Nodes (16): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+8 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 42 - "admin/clients/[id]/page.tsx"
Cohesion: 0.15
Nodes (27): DELETE(), AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage() (+19 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.20
Nodes (17): GET(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), OrderStatsSection(), ManagerOrderStatsSection(), OrderMonthlyChart(), OrderMonthlyChartPoint (+9 more)

### Community 44 - "salesman-report.ts"
Cohesion: 0.27
Nodes (11): GET(), runtime, currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth() (+3 more)

### Community 45 - "client-history.ts"
Cohesion: 0.19
Nodes (12): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientOrdersPage(), getClientSummary() (+4 more)

### Community 46 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 47 - "dashboard-org/page.tsx"
Cohesion: 0.52
Nodes (6): CompanySection(), CompanySkeleton(), SalesmanDashboardOrgPage(), ShippingRatesSection(), ShippingRatesSkeleton(), getCompanyProfiles()

### Community 48 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 49 - "admin/layout.tsx"
Cohesion: 0.36
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.14
Nodes (20): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), CLOSED (+12 more)

### Community 51 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 52 - "ApprovalsView.tsx"
Cohesion: 0.06
Nodes (50): POST(), ApprovalDecision(), decide(), ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL (+42 more)

### Community 53 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "SearchParams"
Cohesion: 0.31
Nodes (7): GET(), AdminEnquiriesPage(), ManagerEnquiriesPage(), SalesmanEnquiriesPage(), enquirySearchWhere(), getEnquiriesPage(), SearchParams

### Community 56 - "TasksSection.tsx"
Cohesion: 0.50
Nodes (4): getDueDateColor(), TaskOverview(), TasksSection(), TasksSkeleton()

### Community 57 - "@prisma/client"
Cohesion: 0.16
Nodes (18): CACHE, Counts, getAdminKpiCounts, statusCounts(), clientScope(), COHORT_DAYS, cohortFunnel(), currentStatusCounts() (+10 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "email-queue.ts"
Cohesion: 0.21
Nodes (13): emailLogo(), deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue(), mailConfigured(), sendMail() (+5 more)

### Community 60 - "react"
Cohesion: 0.06
Nodes (68): AgentQuoteForm(), EMPTY, MultiInput(), AGENT_COLUMNS, BulkImportAgentsModal(), EXAMPLE, CreditRequestPanel(), EMPTY (+60 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "cn"
Cohesion: 0.08
Nodes (40): AuthLayout(), LoginForm(), LoginPage(), PremiumToggle(), SmartAlertBanner(), ChoiceChips(), EnquiryForm(), Topbar() (+32 more)

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 65 - "SalesPal UI Rules"
Cohesion: 0.50
Nodes (3): Docs, graphify, SalesPal UI Rules

### Community 66 - "manager/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection()

### Community 67 - "AgentsClient"
Cohesion: 0.20
Nodes (8): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), save(), toBody(), getAgentRows()

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "client.ts"
Cohesion: 0.12
Nodes (25): ClientDocumentsCard(), remove(), DialogState, submit(), fileUrl(), CompanyInfoCard(), docUrl(), DocumentExpiryBadge() (+17 more)

### Community 71 - "list-params.ts"
Cohesion: 0.13
Nodes (31): ManagerMyClientsPage(), MyClientsSection(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), SalesmanDrilldownPage(), clientFilterWhere(), ClientListItem (+23 more)

### Community 73 - "ClientEnquiryForm.tsx"
Cohesion: 0.24
Nodes (10): emptyPackageLine(), isBlank(), packageLinesPayload(), validLines(), ClientEnquiryForm(), submit(), emptyEnquiryForm(), Section() (+2 more)

### Community 76 - "salesman/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage()

### Community 77 - "salesman/orders/page.tsx"
Cohesion: 0.83
Nodes (3): OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage()

### Community 78 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 80 - "Sidebar.tsx"
Cohesion: 0.09
Nodes (37): DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups(), getNavItems() (+29 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "clientStatusLabel"
Cohesion: 0.20
Nodes (11): flash(), post(), submitCreate(), calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS (+3 more)

### Community 84 - "revalidateEnquiryPages"
Cohesion: 0.11
Nodes (21): POST(), PATCH(), POST(), POST(), Clients, onRequestError(), register(), revalidateEnquiryPages() (+13 more)

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 562 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `formatDate`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `admin-drilldown.ts`, `Button`, `enquiries.ts`, `prisma.ts`, `getSalesPalSession`, `buttonVariants`, `enquiry-follow-ups.ts`, `clients/[id]/documents/[docId]/route.ts`, `enquiry-flow.ts`, `salesman/page.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `UsersClient.tsx`, `scoping.ts`, `package.json`, `isOwnerRole`, `report-pdf.tsx`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `salesman-report.ts`, `app/layout.tsx`, `admin/layout.tsx`, `ApprovalsView.tsx`, `orders/[id]/page.tsx`, `@prisma/client`, `react`, `cn`, `client.ts`, `list-params.ts`, `Sidebar.tsx`, `revalidateEnquiryPages`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `formatDate` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `formatDate`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `Button`, `BulkImportClientsModal.tsx`, `Skeleton`, `getSalesPalSession`, `enquiry-fields.ts`, `accountant/page.tsx`, `buttonVariants`, `AdminDashboardSections.tsx`, `enquiry.ts`, `salesman/page.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `accounts/page.tsx`, `UsersClient.tsx`, `next`, `PageSkeleton`, `ApprovalsView.tsx`, `TasksSection.tsx`, `react`, `AgentsClient`, `client.ts`, `Sidebar.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07667900581702802 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `formatDate`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `SalesPal Architecture`, `Button`, `BulkImportClientsModal.tsx`, `getSalesPalSession`, `accountant/page.tsx`, `buttonVariants`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `EnquiriesClient.tsx`, `UsersClient.tsx`, `package.json`, `next`, `index.mjs`, `accountant/shipping-rates/page.tsx`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `dashboard-org/page.tsx`, `admin/layout.tsx`, `tasks-list.ts`, `admin/clients/page.tsx`, `ApprovalsView.tsx`, `orders/[id]/page.tsx`, `cn`, `manager/clients/page.tsx`, `client.ts`, `list-params.ts`, `ClientEnquiryForm.tsx`, `salesman/clients/page.tsx`, `salesman/orders/page.tsx`, `Sidebar.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._