# Graph Report - salespal  (2026-10-14)

## Corpus Check
- 375 files · ~213,658 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 1968 nodes · 7470 edges · 70 communities (64 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3831dd1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Sidebar.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- salesman-targets.ts
- CompanyReportPdf.tsx
- react
- SalesmenTargetsClient.tsx
- Button
- Modal
- client.ts
- orderScopeWhere
- Skeleton
- getSalesPalSession
- enquiry-fields.ts
- lucide-react
- SalesmanTasksList.tsx
- cn
- seed.ts
- orders-list.ts
- enquiries.ts
- AdminDashboardSections.tsx
- enquiry.ts
- salesman/page.tsx
- EnquiryForm
- ManagerDashboardSections.tsx
- enquiry-agent.ts
- accounts/page.tsx
- admin-dashboard.ts
- next
- hasRole
- ApprovalsView.tsx
- dependencies
- enquiry-follow-ups.ts
- package.json
- utils.ts
- compilerOptions
- EnquiryDetailSheet.tsx
- app/layout.tsx
- LocationPicker.tsx
- ShippingRateTable.tsx
- performance.ts
- PageSkeleton
- accountant/shipping-rates/page.tsx
- cached-queries.ts
- UsersClient.tsx
- PastDueTable.tsx
- company-documents.ts
- EnquiriesClient.tsx
- order.ts
- manager/layout.tsx
- salesman/tasks/page.tsx
- proxy.ts
- BulkImportClientsModal.tsx
- ClientOverview.tsx
- devDependencies
- shipping-rate.ts
- buildEnquiryFormPdf
- AgentsClient.tsx
- scripts
- dashboard-org/page.tsx
- Frontend Design
- ui/Badge.tsx
- README.md
- SalesPal UI Rules
- orders/[id]/page.tsx
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
6. `react` - 98 edges
7. `lucide-react` - 94 edges
8. `Button` - 77 edges
9. `PageHeader()` - 75 edges
10. `formatDate()` - 71 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `clientScopeWhere()`  [EXTRACTED]
  app/api/clients/[id]/route.ts → lib/scoping.ts
- `PATCH()` --indirect_call--> `parseDateOnly()`  [INFERRED]
  app/api/orders/[id]/route.ts → lib/salesman-targets.ts
- `handleAddSubmit()` --calls--> `createSalesmanAction()`  [EXTRACTED]
  app/dashboard/manager/team/ManagerTeamClient.tsx → lib/actions/manager-actions.ts
- `saveCompanies()` --calls--> `setSalesmanCompaniesAction()`  [EXTRACTED]
  app/dashboard/manager/team/ManagerTeamClient.tsx → lib/actions/manager-actions.ts
- `submit()` --calls--> `createCreditRequest()`  [EXTRACTED]
  components/approvals/CreditRequestPanel.tsx → lib/actions/approval-actions.ts

## Import Cycles
- None detected.

## Communities (70 total, 6 thin omitted)

### Community 0 - "Sidebar.tsx"
Cohesion: 0.08
Nodes (45): AppShell(), LogoutOverlay(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups(), getNavItems(), GROUPS, ICONS (+37 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.06
Nodes (65): AgentQuotePage(), metadata, Notice(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org, User (+57 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.09
Nodes (44): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors (+36 more)

### Community 3 - "salesman-targets.ts"
Cohesion: 0.12
Nodes (31): GET(), runtime, GET(), runtime, POST(), CompanyReport, DETAIL_LIMIT, getCompanyReport() (+23 more)

### Community 4 - "CompanyReportPdf.tsx"
Cohesion: 0.12
Nodes (40): CompanyReportPdf(), Cut(), Footer(), PdfLogo, TARGET_STATE, Bar(), C, Col (+32 more)

### Community 5 - "react"
Cohesion: 0.14
Nodes (17): ClientStatusDropdown(), Org, CompanyReportForm(), iso(), emptyForm, MODES, PLACE, controlBase (+9 more)

### Community 6 - "SalesmenTargetsClient.tsx"
Cohesion: 0.13
Nodes (23): ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies(), ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period() (+15 more)

### Community 7 - "Button"
Cohesion: 0.11
Nodes (40): Error(), DocumentDialog(), ContactForm(), availableActions(), ConfirmDialog(), EnquiryStageActions(), FiguresDialog(), FiguresForm() (+32 more)

### Community 8 - "Modal"
Cohesion: 0.09
Nodes (35): BulkImportAgentsModal(), handleFile(), EXAMPLE, split(), CreditRequestPanel(), submit(), EMPTY, Latest (+27 more)

### Community 9 - "client.ts"
Cohesion: 0.06
Nodes (59): GET(), PATCH(), PATCH(), POST(), POST(), handleStatusChange(), handleStatusChange(), cleanText() (+51 more)

### Community 10 - "orderScopeWhere"
Cohesion: 0.31
Nodes (8): POST(), GET(), PATCH(), GET(), orderPaymentsInclude, PaymentRow, serializeOrder(), orderScopeWhere()

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (26): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+18 more)

### Community 12 - "getSalesPalSession"
Cohesion: 0.09
Nodes (39): handler, GET(), ApprovalsPage(), AccountantEnquiriesPage(), AccountantLayout(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton() (+31 more)

### Community 13 - "enquiry-fields.ts"
Cohesion: 0.12
Nodes (35): PATCH(), CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), Summary(), validLines(), ENQUIRY_FIELD_LABELS (+27 more)

### Community 14 - "lucide-react"
Cohesion: 0.24
Nodes (11): LoginForm(), LoginPage(), UserMenu(), PerformanceReportButton(), recentMonths(), ButtonProps, Popover, PopoverClose (+3 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.07
Nodes (47): FollowUpsSection(), ClientPicker(), Option, ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel() (+39 more)

### Community 16 - "cn"
Cohesion: 0.16
Nodes (15): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+7 more)

### Community 17 - "seed.ts"
Cohesion: 0.09
Nodes (35): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+27 more)

### Community 18 - "orders-list.ts"
Cohesion: 0.08
Nodes (50): AccountantDashboardPage(), dynamic, orderNo(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerOrdersPage(), ManagerOrdersSection() (+42 more)

### Community 19 - "enquiries.ts"
Cohesion: 0.07
Nodes (62): POST(), GET(), POST(), POST(), SENDABLE, GET(), ACTIONS, POST() (+54 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.14
Nodes (29): AdminDashboardPage(), PeriodKey, CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getPeriodRange(), getPreviousPeriodRange() (+21 more)

### Community 21 - "enquiry.ts"
Cohesion: 0.10
Nodes (27): PackageLineInput, EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, EnquiryEventItem, EnquiryFollowUpItem (+19 more)

### Community 22 - "salesman/page.tsx"
Cohesion: 0.11
Nodes (28): GET(), actualProfit(), ChartSkeleton(), day(), HeroSkeleton(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection() (+20 more)

### Community 23 - "EnquiryForm"
Cohesion: 0.23
Nodes (11): packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), emptyEnquiryForm(), EnquiryForm(), GroupLabel(), Section() (+3 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.14
Nodes (28): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+20 more)

### Community 25 - "enquiry-agent.ts"
Cohesion: 0.14
Nodes (19): AGENT_LINK_VALID_DAYS, AgentEnquiry, agentShipmentRows(), MODE, qty(), sendAgentRequestEmail(), CLIENT_FORM_VALID_DAYS, sendClientFormEmail() (+11 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.14
Nodes (17): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), COLORS, compactMoney, fullMoney (+9 more)

### Community 27 - "admin-dashboard.ts"
Cohesion: 0.16
Nodes (21): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), getManagerKpiCards, clientScope() (+13 more)

### Community 28 - "next"
Cohesion: 0.08
Nodes (44): GET(), labelMap, PATCH(), GET(), POST(), DELETE(), PATCH(), POST() (+36 more)

### Community 29 - "hasRole"
Cohesion: 0.17
Nodes (18): DELETE(), Params, PATCH(), GET(), POST(), POST(), DELETE(), PATCH() (+10 more)

### Community 30 - "ApprovalsView.tsx"
Cohesion: 0.13
Nodes (28): ApprovalDecision(), decide(), ApprovalCard(), ApprovalsView(), CreditDetails(), EnquiryDetails(), Fields(), ACTION_LABEL (+20 more)

### Community 31 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, bcryptjs, class-variance-authority, clsx, fflate, @fontsource/inter, lucide-react, @mantine/charts (+21 more)

### Community 32 - "enquiry-follow-ups.ts"
Cohesion: 0.14
Nodes (19): POST(), POST(), POST(), FOLLOW_UP_CATEGORIES, POST(), sweepDormantClients(), closeFollowUpTasks(), dueForFollowUp() (+11 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (30): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+22 more)

### Community 34 - "utils.ts"
Cohesion: 0.10
Nodes (37): OrderDetail(), ClientHistory(), Empty(), RecordLink(), Route(), OrderRole, OrderList(), flash() (+29 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "EnquiryDetailSheet.tsx"
Cohesion: 0.17
Nodes (21): ApprovalChip(), CHIP, CargoSection(), EnquiryDetailSheet(), EVENT_TEXT, Field(), figures(), History() (+13 more)

### Community 37 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 38 - "LocationPicker.tsx"
Cohesion: 0.26
Nodes (10): KIND, LocationPicker(), choose(), COUNTRIES, CountryDef, FREIGHT_LOCATIONS, FreightLocation, KIND_FOR_MODE (+2 more)

### Community 39 - "ShippingRateTable.tsx"
Cohesion: 0.14
Nodes (20): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+12 more)

### Community 40 - "performance.ts"
Cohesion: 0.30
Nodes (12): GET(), ReportsPage(), getAdminLeaderboard, groupStatusCounts(), CACHE, DETAIL_LIMIT, getManagerTeam, byPerformance() (+4 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.23
Nodes (10): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton(), KpiSkeleton() (+2 more)

### Community 42 - "accountant/shipping-rates/page.tsx"
Cohesion: 0.30
Nodes (11): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage(), ShippingRatesSection() (+3 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.24
Nodes (15): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts (+7 more)

### Community 44 - "UsersClient.tsx"
Cohesion: 0.22
Nodes (17): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), remove(), save(), canManageRole() (+9 more)

### Community 45 - "PastDueTable.tsx"
Cohesion: 0.40
Nodes (8): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), Pagination()

### Community 46 - "company-documents.ts"
Cohesion: 0.06
Nodes (70): POST(), DELETE(), load(), Params, PATCH(), DELETE(), GET(), load() (+62 more)

### Community 47 - "EnquiriesClient.tsx"
Cohesion: 0.12
Nodes (28): NotFound(), SmartAlertBanner(), AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+20 more)

### Community 48 - "order.ts"
Cohesion: 0.14
Nodes (13): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, orderModes, OrderPaymentItem, orderPaymentMethods (+5 more)

### Community 49 - "manager/layout.tsx"
Cohesion: 0.40
Nodes (6): ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 50 - "salesman/tasks/page.tsx"
Cohesion: 0.83
Nodes (3): SalesmanTasksPage(), TasksListSection(), TasksListSkeleton()

### Community 52 - "BulkImportClientsModal.tsx"
Cohesion: 0.18
Nodes (13): handleReset(), BulkImportClientsModal(), close(), handleFile(), reset(), resolveSalesman(), runImport(), REQUIRED (+5 more)

### Community 53 - "ClientOverview.tsx"
Cohesion: 0.14
Nodes (13): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, taskStatuses, clientStatusDotClass(), PremiumBadge() (+5 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "shipping-rate.ts"
Cohesion: 0.09
Nodes (18): ShippingRateModalProps, ShippingRateTableProps, ExchangeRates, JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser (+10 more)

### Community 56 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 57 - "AgentsClient.tsx"
Cohesion: 0.14
Nodes (18): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), exportAgents(), save(), COUNTRIES (+10 more)

### Community 58 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+2 more)

### Community 60 - "dashboard-org/page.tsx"
Cohesion: 0.42
Nodes (7): CompanySection(), CompanySkeleton(), SalesmanDashboardOrgPage(), ShippingRatesSection(), ShippingRatesSkeleton(), EmptyState(), getCompanyProfiles()

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "ui/Badge.tsx"
Cohesion: 0.10
Nodes (23): clientStatusDot, CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME (+15 more)

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 66 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 469 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Sidebar.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `salesman-targets.ts`, `react`, `SalesmenTargetsClient.tsx`, `Button`, `Modal`, `client.ts`, `orderScopeWhere`, `getSalesPalSession`, `enquiry-fields.ts`, `lucide-react`, `SalesmanTasksList.tsx`, `orders-list.ts`, `enquiries.ts`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `accounts/page.tsx`, `admin-dashboard.ts`, `hasRole`, `ApprovalsView.tsx`, `enquiry-follow-ups.ts`, `package.json`, `utils.ts`, `EnquiryDetailSheet.tsx`, `app/layout.tsx`, `ShippingRateTable.tsx`, `performance.ts`, `cached-queries.ts`, `UsersClient.tsx`, `company-documents.ts`, `EnquiriesClient.tsx`, `manager/layout.tsx`, `proxy.ts`, `ClientOverview.tsx`, `AgentsClient.tsx`, `orders/[id]/page.tsx`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07597402597402597 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Sidebar.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `react`, `SalesmenTargetsClient.tsx`, `Button`, `Modal`, `Skeleton`, `enquiry-fields.ts`, `lucide-react`, `SalesmanTasksList.tsx`, `orders-list.ts`, `AdminDashboardSections.tsx`, `enquiry.ts`, `salesman/page.tsx`, `EnquiryForm`, `ManagerDashboardSections.tsx`, `accounts/page.tsx`, `ApprovalsView.tsx`, `utils.ts`, `EnquiryDetailSheet.tsx`, `LocationPicker.tsx`, `ShippingRateTable.tsx`, `PageSkeleton`, `UsersClient.tsx`, `PastDueTable.tsx`, `EnquiriesClient.tsx`, `BulkImportClientsModal.tsx`, `ClientOverview.tsx`, `AgentsClient.tsx`, `dashboard-org/page.tsx`, `ui/Badge.tsx`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06296656929568321 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `orders/[id]/page.tsx`, `PageSkeleton`, `accountant/shipping-rates/page.tsx`, `cached-queries.ts`, `getSalesPalSession`, `company-documents.ts`, `cn`, `orders-list.ts`, `salesman/tasks/page.tsx`, `AdminDashboardSections.tsx`, `salesman/page.tsx`, `ManagerDashboardSections.tsx`, `dashboard-org/page.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09016393442622951 - nodes in this community are weakly interconnected._