# Graph Report - salespal  (2026-10-13)

## Corpus Check
- 369 files · ~211,029 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 1940 nodes · 7362 edges · 73 communities (68 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac17703f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- formatDate
- CompanyReportPdf.tsx
- clients/[id]/documents/[docId]/route.ts
- next-auth
- EnquiriesClient.tsx
- react
- clients/route.ts
- scoping.ts
- Skeleton
- getSalesPalSession
- freight.ts
- manager/clients/[id]/page.tsx
- SalesmanTasksList.tsx
- cn
- seed.ts
- orders-list.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- accountant-dashboard.ts
- ManagerDashboardSections.tsx
- next
- accounts/page.tsx
- admin-dashboard.ts
- enquiry-agent.ts
- hasRole
- prisma.ts
- dependencies
- @prisma/client
- package.json
- EnquiryDetailSheet.tsx
- compilerOptions
- buttonVariants
- BulkImportClientsModal.tsx
- ClientSwitcher.tsx
- ShippingRateTable.tsx
- performance.ts
- PageSkeleton
- dashboard-org/page.tsx
- cached-queries.ts
- user-actions.ts
- AgentsClient
- ApprovalsView.tsx
- EnquiryForm.tsx
- task.ts
- admin/layout.tsx
- tasks-list.ts
- logo/route.ts
- company-documents.ts
- LocationPicker.tsx
- devDependencies
- client.ts
- buildEnquiryFormPdf
- client-history.ts
- scripts
- app/layout.tsx
- CompanyComparisonCard.tsx
- Frontend Design
- manager/clients/page.tsx
- admin/clients/page.tsx
- README.md
- SalesPal UI Rules
- salesman/clients/page.tsx
- salesman/orders/page.tsx
- AGENTS.md
- bench.sh
- postcss.config.mjs
- check-errors.sh

## God Nodes (most connected - your core abstractions)
1. `cn()` - 211 edges
2. `next` - 136 edges
3. `getSalesPalSession()` - 109 edges
4. `Skeleton()` - 102 edges
5. `prisma` - 99 edges
6. `react` - 97 edges
7. `lucide-react` - 92 edges
8. `PageHeader()` - 75 edges
9. `Button` - 74 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `PATCH()` --indirect_call--> `parseDateOnly()`  [INFERRED]
  app/api/orders/[id]/route.ts → lib/salesman-targets.ts
- `DELETE()` --calls--> `hasRole()`  [EXTRACTED]
  app/api/shipping-rates/[id]/route.ts → lib/scoping.ts
- `DashboardIndex()` --calls--> `getSalesPalSession()`  [EXTRACTED]
  app/dashboard/page.tsx → lib/auth.ts
- `DeltaBadge()` --calls--> `cn()`  [EXTRACTED]
  components/dashboard/AdminDashboardSections.tsx → lib/utils.ts
- `submit()` --calls--> `formatDate()`  [EXTRACTED]
  components/tasks/TaskActions.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (73 total, 5 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.06
Nodes (56): DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups(), getNavItems() (+48 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.06
Nodes (69): AgentQuotePage(), metadata, Notice(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org (+61 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.07
Nodes (49): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverview() (+41 more)

### Community 3 - "formatDate"
Cohesion: 0.17
Nodes (25): OrderDetail(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+17 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.09
Nodes (48): GET(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+40 more)

### Community 5 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.27
Nodes (16): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+8 more)

### Community 6 - "next-auth"
Cohesion: 0.12
Nodes (18): GET(), labelMap, PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+10 more)

### Community 7 - "EnquiriesClient.tsx"
Cohesion: 0.05
Nodes (80): Error(), DialogState, DocumentDialog(), ClientHistory(), Empty(), RecordLink(), Route(), ContactDetailsDialog() (+72 more)

### Community 8 - "react"
Cohesion: 0.07
Nodes (50): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), COUNTRIES, EMPTY, CreditRequestPanel() (+42 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.16
Nodes (29): PATCH(), PATCH(), POST(), handleStatusChange(), handleStatusChange(), cleanText(), ContactFields, contactRequiredMessage() (+21 more)

### Community 10 - "scoping.ts"
Cohesion: 0.13
Nodes (28): POST(), DELETE(), PATCH(), GET(), POST(), FOLLOW_UP_CATEGORIES, POST(), CompanyReport (+20 more)

### Community 11 - "Skeleton"
Cohesion: 0.07
Nodes (29): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+21 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.14
Nodes (26): handler, ApprovalsPage(), AccountantEnquiriesPage(), AccountantLayout(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage() (+18 more)

### Community 13 - "freight.ts"
Cohesion: 0.16
Nodes (20): CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, Summary(), validLines(), CargoPackage, cargoTotals (+12 more)

### Community 14 - "manager/clients/[id]/page.tsx"
Cohesion: 0.17
Nodes (19): ClientDetailContent(), ManagerClientDetailPage(), SearchParams, ClientOverviewLoading(), ClientDetailContent(), ClientDetailPage(), SearchParams, CreditAgreementCard() (+11 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.12
Nodes (29): ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel(), EMPTY_MESSAGES, SalesmanTasksList(), SalesmanTasksListProps (+21 more)

### Community 16 - "cn"
Cohesion: 0.09
Nodes (32): AuthLayout(), ManagerTeamClient(), ManagerTeamClientProps, getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), CompanyCheckboxes() (+24 more)

### Community 17 - "seed.ts"
Cohesion: 0.09
Nodes (35): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+27 more)

### Community 18 - "orders-list.ts"
Cohesion: 0.11
Nodes (37): GET(), AdminEnquiriesPage(), AdminOrdersPage(), ManagerEnquiriesPage(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), SalesmanDrilldownPage() (+29 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.09
Nodes (41): POST(), ACTIONS, POST(), POST(), POST(), GET(), PATCH(), ACTIONS (+33 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (34): AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getPeriodRange() (+26 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.07
Nodes (40): ENQUIRY_FIELD_LABELS, EnquiryDetails, measurement(), packingList(), parseEnquiryDetails(), unNumbers(), isDimensionUnit(), round3() (+32 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.10
Nodes (27): GET(), actualProfit(), ChartSkeleton(), day(), FollowUpsSection(), HeroSkeleton(), KpiCardsSkeleton(), MonthlyChartSection() (+19 more)

### Community 23 - "accountant-dashboard.ts"
Cohesion: 0.24
Nodes (11): AWAITING_DETAILS(), AwaitingOrder, DEFAULT_CREDIT_DAYS, getAccountantDashboard(), getPastDuePage(), PAST_DUE_PAGE_SIZE, PastDuePage, ReceivableOrder (+3 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (34): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+26 more)

### Community 25 - "next"
Cohesion: 0.10
Nodes (26): POST(), PATCH(), SENDABLE, GET(), POST(), POST(), POST(), CONTACT_FIELD_LABELS (+18 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.12
Nodes (19): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), COLORS, compactMoney, fullMoney (+11 more)

### Community 27 - "admin-dashboard.ts"
Cohesion: 0.20
Nodes (17): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), clientScope(), cohortFunnel() (+9 more)

### Community 28 - "enquiry-agent.ts"
Cohesion: 0.14
Nodes (21): AGENT_LINK_VALID_DAYS, AgentEnquiry, agentShipmentRows(), MODE, qty(), sendAgentRequestEmail(), CLIENT_FORM_VALID_DAYS, sendClientFormEmail() (+13 more)

### Community 29 - "hasRole"
Cohesion: 0.17
Nodes (17): DELETE(), Params, PATCH(), GET(), POST(), DELETE(), load(), Params (+9 more)

### Community 30 - "prisma.ts"
Cohesion: 0.11
Nodes (33): GET(), DELETE(), POST(), DELETE(), POST(), runtime, POST(), handleAddSubmit() (+25 more)

### Community 31 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, bcryptjs, class-variance-authority, clsx, fflate, @fontsource/inter, lucide-react, @mantine/charts (+21 more)

### Community 32 - "@prisma/client"
Cohesion: 0.10
Nodes (25): POST(), POST(), POST(), POST(), sweepDormantClients(), dueForFollowUp(), ensureEnquiryFollowUpTasks(), extendFollowUpTasks() (+17 more)

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (29): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+21 more)

### Community 34 - "EnquiryDetailSheet.tsx"
Cohesion: 0.17
Nodes (13): CHIP, CargoSection(), EVENT_TEXT, Field(), QUOTED_NOTES, Section(), DEFAULT_DIMENSION_UNIT, formatQuantity() (+5 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "buttonVariants"
Cohesion: 0.20
Nodes (11): LoginForm(), LoginPage(), NotFound(), SmartAlertBanner(), FollowUpForm(), submit(), FollowUpModal(), formatDateTime() (+3 more)

### Community 37 - "BulkImportClientsModal.tsx"
Cohesion: 0.14
Nodes (17): handleReset(), BulkImportClientsModal(), close(), handleFile(), reset(), resolveSalesman(), runImport(), csvCell() (+9 more)

### Community 38 - "ClientSwitcher.tsx"
Cohesion: 0.60
Nodes (5): ClientSwitcher(), go(), readRecent(), rememberClient(), Result

### Community 39 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (35): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+27 more)

### Community 40 - "performance.ts"
Cohesion: 0.17
Nodes (19): GET(), ReportsPage(), MonthHeroSection(), PerformanceCardsSection(), KpiCard(), KpiCardProps, CompanyReportForm(), iso() (+11 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.23
Nodes (10): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton(), KpiSkeleton() (+2 more)

### Community 42 - "dashboard-org/page.tsx"
Cohesion: 0.19
Nodes (18): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+10 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 44 - "user-actions.ts"
Cohesion: 0.35
Nodes (11): remove(), save(), canManageRole(), createUser(), deleteUser(), parseUser(), Result, revalidateUsers() (+3 more)

### Community 45 - "AgentsClient"
Cohesion: 0.26
Nodes (6): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), getAgentRows()

### Community 46 - "ApprovalsView.tsx"
Cohesion: 0.12
Nodes (29): ApprovalDecision(), decide(), ApprovalCard(), ApprovalsView(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL (+21 more)

### Community 47 - "EnquiryForm.tsx"
Cohesion: 0.13
Nodes (23): emptyPackageLine(), packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), emptyEnquiryForm(), EnquiryForm(), enquiryFormFrom() (+15 more)

### Community 48 - "task.ts"
Cohesion: 0.14
Nodes (17): POST(), DELETE(), PATCH(), GET(), GET(), revalidateClientViews(), taskScopeWhere(), LEAD_TASK_CATEGORY (+9 more)

### Community 49 - "admin/layout.tsx"
Cohesion: 0.36
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "tasks-list.ts"
Cohesion: 0.14
Nodes (19): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), CLOSED (+11 more)

### Community 51 - "logo/route.ts"
Cohesion: 0.17
Nodes (14): GET(), safeName(), DELETE(), GET(), LOGO_TYPES, Params, POST(), revalidateCompanyViews() (+6 more)

### Community 52 - "company-documents.ts"
Cohesion: 0.26
Nodes (14): DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), POST(), canViewCompanyDocuments() (+6 more)

### Community 53 - "LocationPicker.tsx"
Cohesion: 0.26
Nodes (10): KIND, LocationPicker(), choose(), COUNTRIES, CountryDef, FREIGHT_LOCATIONS, FreightLocation, KIND_FOR_MODE (+2 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "client.ts"
Cohesion: 0.18
Nodes (10): ClientStatusDropdown(), ClientCategory, ClientDocumentItem, ClientListItem, ClientLogItem, clientStatuses, DORMANT_AFTER_DAYS, KYC_DOC_TYPES (+2 more)

### Community 56 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 57 - "client-history.ts"
Cohesion: 0.17
Nodes (15): HistorySection(), HistorySection(), CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage() (+7 more)

### Community 58 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+1 more)

### Community 59 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 60 - "CompanyComparisonCard.tsx"
Cohesion: 0.28
Nodes (8): CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME, statusDotClass

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "manager/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection()

### Community 63 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 66 - "salesman/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage()

### Community 67 - "salesman/orders/page.tsx"
Cohesion: 0.83
Nodes (3): OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage()

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 465 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Sidebar.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `formatDate`, `clients/[id]/documents/[docId]/route.ts`, `next-auth`, `EnquiriesClient.tsx`, `react`, `clients/route.ts`, `scoping.ts`, `Skeleton`, `getSalesPalSession`, `manager/clients/[id]/page.tsx`, `SalesmanTasksList.tsx`, `cn`, `orders-list.ts`, `enquiry-flow.ts`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `accounts/page.tsx`, `admin-dashboard.ts`, `hasRole`, `prisma.ts`, `@prisma/client`, `package.json`, `EnquiryDetailSheet.tsx`, `buttonVariants`, `ClientSwitcher.tsx`, `ShippingRateTable.tsx`, `performance.ts`, `dashboard-org/page.tsx`, `cached-queries.ts`, `user-actions.ts`, `ApprovalsView.tsx`, `task.ts`, `admin/layout.tsx`, `tasks-list.ts`, `logo/route.ts`, `company-documents.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06164383561643835 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Sidebar.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `formatDate`, `EnquiriesClient.tsx`, `react`, `Skeleton`, `getSalesPalSession`, `freight.ts`, `manager/clients/[id]/page.tsx`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `accounts/page.tsx`, `EnquiryDetailSheet.tsx`, `buttonVariants`, `BulkImportClientsModal.tsx`, `ClientSwitcher.tsx`, `ShippingRateTable.tsx`, `performance.ts`, `PageSkeleton`, `AgentsClient`, `ApprovalsView.tsx`, `EnquiryForm.tsx`, `LocationPicker.tsx`, `CompanyComparisonCard.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058115025594700394 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `salesman/clients/page.tsx`, `salesman/orders/page.tsx`, `PageSkeleton`, `dashboard-org/page.tsx`, `cached-queries.ts`, `getSalesPalSession`, `manager/clients/[id]/page.tsx`, `cn`, `orders-list.ts`, `tasks-list.ts`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `manager/clients/page.tsx`, `admin/clients/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06736842105263158 - nodes in this community are weakly interconnected._