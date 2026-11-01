# Graph Report - salespal  (2026-11-01)

## Corpus Check
- 456 files · ~269,418 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2487 nodes · 9388 edges · 96 communities (91 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cde13107`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ShippingRateTable
- CompaniesClient.tsx
- ManagerClientsList.tsx
- Button
- report-pdf.tsx
- accountant/page.tsx
- admin-drilldown.ts
- TaskCalendar.tsx
- nav-meta.ts
- clients/route.ts
- jobs/route.ts
- Skeleton
- LocationsClient.tsx
- freight.ts
- 5.4 Tables and columns
- formatDate
- Topbar.tsx
- seed.ts
- leave-badges.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- client.ts
- TaskOverview.tsx
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- TaskCard.tsx
- formatAmount
- Changelog
- BulkImportClientsModal.tsx
- enquiryRef
- SalesPal Architecture
- dependencies
- scoping.ts
- package.json
- cn
- compilerOptions
- index.mjs
- ShellContext.tsx
- leave-actions.ts
- dashboard-org/page.tsx
- task.ts
- PageSkeleton
- ApprovalsView.tsx
- cached-queries.ts
- prisma
- CompanyReportForm.tsx
- email-queue.ts
- list-params.ts
- admin/layout.tsx
- getSalesPalSession
- enquiry-agent.ts
- tasks-list.ts
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 3. Folder map
- company-report.ts
- my-overview/page.tsx
- scripts
- next
- utils.ts
- Frontend Design
- buildEnquiryFormPdf
- clients/[id]/documents/[docId]/route.ts
- README.md
- SalesPal UI Rules
- app/layout.tsx
- order.ts
- AGENTS.md
- bench.sh
- salesman/page.tsx
- UserMenu.tsx
- EnquiryForm
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- prisma.ts
- Sidebar.tsx
- Bug log
- agent-quote/[token]/route.ts
- instrumentation.ts
- sendMail
- AgentQuotes.tsx
- eslint.config.mjs
- error-log.ts
- getTokenUserId
- EnquiryDetailSheet.tsx
- admin-dashboard.ts
- orders/[id]/page.tsx
- hasRole
- [salesmanId]/page.tsx
- next.config.ts
- overrides

## God Nodes (most connected - your core abstractions)
1. `cn()` - 242 edges
2. `next` - 169 edges
3. `getSalesPalSession()` - 138 edges
4. `prisma` - 128 edges
5. `react` - 115 edges
6. `Skeleton()` - 110 edges
7. `lucide-react` - 107 edges
8. `Button` - 97 edges
9. `PageHeader()` - 91 edges
10. `formatDate()` - 81 edges

## Surprising Connections (you probably didn't know these)
- `3. Folder map` --references--> `useShippingRates()`  [INFERRED]
  docs/ARCHITECTURE.md → hooks/useShippingRates.ts
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.5 Status flows (summary)` --references--> `sweepDormantClients()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/client-status-flow.ts
- `5.3 Schema management` --references--> `parentIdsWithCr()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/clients-list.ts

## Import Cycles
- None detected.

## Communities (96 total, 5 thin omitted)

### Community 0 - "ShippingRateTable"
Cohesion: 0.19
Nodes (18): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+10 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.07
Nodes (59): DELETE(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, remove(), ManagerTeamClient() (+51 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.05
Nodes (74): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), handleReset(), handleStatusChange(), ManagerClientsListProps, SalesmanItem (+66 more)

### Community 3 - "Button"
Cohesion: 0.08
Nodes (47): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), save(), AgentsClient(), save() (+39 more)

### Community 4 - "report-pdf.tsx"
Cohesion: 0.36
Nodes (8): GET(), runtime, PdfLogo, parseRange(), ReportFilters, buildCompanyReportPdf(), canReportOn(), ReportActor

### Community 5 - "accountant/page.tsx"
Cohesion: 0.16
Nodes (24): GET(), AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo() (+16 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.15
Nodes (23): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), clientsEntering(), countLostEnquiries(), DrillClient (+15 more)

### Community 7 - "TaskCalendar.tsx"
Cohesion: 0.06
Nodes (73): OrderDetail(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt() (+65 more)

### Community 8 - "nav-meta.ts"
Cohesion: 0.19
Nodes (10): DashboardIndex(), GROUPS, ICONS, isShortcutActive(), NavGroup, NavItem, ROLE_LABELS, navConfig (+2 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.19
Nodes (25): GET(), labelMap, PATCH(), GET(), PATCH(), PATCH(), allowedOrgIdsFor(), GET() (+17 more)

### Community 10 - "jobs/route.ts"
Cohesion: 0.27
Nodes (9): GET(), POST(), runtime, select, 9. Background work, caching and scheduled jobs, filterParams(), parseFilters(), text() (+1 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (25): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+17 more)

### Community 12 - "LocationsClient.tsx"
Cohesion: 0.15
Nodes (18): KIND, LocationPicker(), choose(), EMPTY, KINDS, LocationsClient(), changed(), remove() (+10 more)

### Community 13 - "freight.ts"
Cohesion: 0.12
Nodes (29): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), Summary(), validLines(), openEdit(), enquiryFormFrom() (+21 more)

### Community 14 - "5.4 Tables and columns"
Cohesion: 0.20
Nodes (10): 5.1 Connection, 5.2 Entity relationship diagram, 5.3 Schema management, 5.4 Tables and columns, 5.5 Status flows (summary), 5. Database, Orders and money, Roles, companies, people (+2 more)

### Community 15 - "formatDate"
Cohesion: 0.06
Nodes (62): FollowUpsSection(), NotFound(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions() (+54 more)

### Community 16 - "Topbar.tsx"
Cohesion: 0.39
Nodes (7): getBreadcrumbs(), Topbar(), SimpleTooltip(), Tooltip, TooltipContent, TooltipTrigger, @radix-ui/react-tooltip

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (36): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+28 more)

### Community 18 - "leave-badges.ts"
Cohesion: 0.27
Nodes (8): DashboardLayout(), CoverBanner(), clean(), NavigationContext, NavigationContextType, NavigationProvider(), getCoveringFor(), getLeaveBadges()

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.11
Nodes (28): POST(), ACTIONS, POST(), ACTIONS, POST(), ACTION_VERB, Actor, applyEnquiryAction() (+20 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (35): AdminDashboardPage(), PeriodKey, CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo(), HeroSkeleton() (+27 more)

### Community 21 - "client.ts"
Cohesion: 0.05
Nodes (53): Org, ClientEnquiryFormPage(), metadata, Notice(), DialogState, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal() (+45 more)

### Community 22 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (30): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+22 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.15
Nodes (29): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+21 more)

### Community 25 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 26 - "formatAmount"
Cohesion: 0.13
Nodes (17): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), COLORS, compactMoney, fullMoney (+9 more)

### Community 27 - "Changelog"
Cohesion: 0.04
Nodes (47): 1.0.0 - 2026-10-28, 1.10.0 - 2026-11-01, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.2.0 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.0 - 2026-10-28 (+39 more)

### Community 28 - "BulkImportClientsModal.tsx"
Cohesion: 0.18
Nodes (12): exportAgents(), downloadAgentTemplate(), downloadTemplate(), REQUIRED, Row, RowResult, SalesmanItem, TEMPLATE_EXAMPLE (+4 more)

### Community 29 - "enquiryRef"
Cohesion: 0.13
Nodes (39): GET(), runtime, submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar() (+31 more)

### Community 30 - "SalesPal Architecture"
Cohesion: 0.15
Nodes (12): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 4.1 Roles, 4.2 Sign-in, 4. Roles, authentication and data scoping (+4 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "scoping.ts"
Cohesion: 0.12
Nodes (34): GET(), CalendarPage(), decide(), 4.3 Scoping (who sees which rows), createCreditRequest(), CreditRequestInput, decideApprovalAction(), Result (+26 more)

### Community 33 - "package.json"
Cohesion: 0.08
Nodes (25): name, prisma, seed, private, version, class-variance-authority, clsx, @fontsource/inter (+17 more)

### Community 34 - "cn"
Cohesion: 0.15
Nodes (19): AuthLayout(), LoginForm(), LoginPage(), SmartAlertBanner(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem (+11 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.12
Nodes (26): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+18 more)

### Community 37 - "ShellContext.tsx"
Cohesion: 0.38
Nodes (6): readSidebar(), ShellContext, ShellContextValue, ShellProvider(), sidebarListeners, subscribeSidebar()

### Community 38 - "leave-actions.ts"
Cohesion: 0.20
Nodes (19): authorize(), coverCandidates(), endLeave(), extendLeave(), getLeaveInfo(), iso(), leaveClash(), LeaveInfo (+11 more)

### Community 39 - "dashboard-org/page.tsx"
Cohesion: 0.60
Nodes (5): CompanySection(), CompanySkeleton(), SalesmanDashboardOrgPage(), ShippingRatesSkeleton(), getCompanyProfiles()

### Community 40 - "task.ts"
Cohesion: 0.07
Nodes (35): GET(), POST(), DELETE(), PATCH(), DELETE(), PATCH(), GET(), GET() (+27 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 42 - "ApprovalsView.tsx"
Cohesion: 0.10
Nodes (39): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalCard(), CreditDetails(), EnquiryDetails() (+31 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 44 - "prisma"
Cohesion: 0.11
Nodes (37): Ctx, DELETE(), load(), PATCH(), POST(), PATCH(), POST(), POST() (+29 more)

### Community 45 - "CompanyReportForm.tsx"
Cohesion: 0.20
Nodes (14): ReportsPage(), Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso() (+6 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.21
Nodes (14): EmailState, resolveStoredPath(), writeStoredFile(), deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue() (+6 more)

### Community 47 - "list-params.ts"
Cohesion: 0.11
Nodes (33): EmailTemplatesPage(), AdminOrdersPage(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage() (+25 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.40
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "getSalesPalSession"
Cohesion: 0.13
Nodes (25): handler, AgentsPage(), ApprovalsPage(), AccountantLayout(), AgentsPage(), ApprovalsPage(), AdminEnquiriesPage(), LocationsPage() (+17 more)

### Community 50 - "enquiry-agent.ts"
Cohesion: 0.11
Nodes (35): DELETE(), GET(), PUT(), POST(), SENDABLE, EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE (+27 more)

### Community 51 - "tasks-list.ts"
Cohesion: 0.13
Nodes (22): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds() (+14 more)

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.06
Nodes (65): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+57 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.09
Nodes (44): PackageLineInput, EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, ReeferTemps(), resizeTemps() (+36 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "3. Folder map"
Cohesion: 0.33
Nodes (4): 3. Folder map, useKpi(), useTasks(), TaskListItem

### Community 56 - "company-report.ts"
Cohesion: 0.13
Nodes (21): GET(), placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n(), Num (+13 more)

### Community 57 - "my-overview/page.tsx"
Cohesion: 0.18
Nodes (19): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), PerformanceCardsSection(), chip (+11 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "next"
Cohesion: 0.12
Nodes (4): POST(), MIN_PASSWORD_LENGTH, config, next

### Community 60 - "utils.ts"
Cohesion: 0.11
Nodes (25): AgentQuotePage(), metadata, Notice(), Error(), AgentQuoteForm(), ApprovalDecision(), EMPTY, Latest (+17 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.18
Nodes (22): DELETE(), load(), Params, PATCH(), POST(), DELETE(), GET(), load() (+14 more)

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 65 - "SalesPal UI Rules"
Cohesion: 0.50
Nodes (3): Docs, graphify, SalesPal UI Rules

### Community 66 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 67 - "order.ts"
Cohesion: 0.15
Nodes (12): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, OrderPaymentItem, orderPaymentMethods, OrderPaymentMode (+4 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.14
Nodes (22): GET(), ChartSkeleton(), HeroSkeleton(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection() (+14 more)

### Community 71 - "UserMenu.tsx"
Cohesion: 0.31
Nodes (10): UserMenu(), PerformanceReportButton(), recentMonths(), Avatar(), sizes, Popover, PopoverClose, PopoverContent (+2 more)

### Community 73 - "EnquiryForm"
Cohesion: 0.18
Nodes (13): packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), ContainerChips(), emptyEnquiryForm(), EnquiryForm(), GroupLabel() (+5 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.15
Nodes (20): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+12 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.14
Nodes (24): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+16 more)

### Community 79 - "prisma.ts"
Cohesion: 0.09
Nodes (41): DELETE(), DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), GET() (+33 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.25
Nodes (16): AppShell(), LogoutOverlay(), DashboardContentWrapper(), getNavGroups(), getNavItems(), isNavActive(), useNavigation(), RouteProgress() (+8 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "agent-quote/[token]/route.ts"
Cohesion: 0.35
Nodes (8): POST(), POST(), POST(), agentLinkExpired(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 83 - "instrumentation.ts"
Cohesion: 0.40
Nodes (3): Clients, onRequestError(), register()

### Community 84 - "sendMail"
Cohesion: 0.50
Nodes (3): mailConfigured(), sendMail(), nodemailer

### Community 85 - "AgentQuotes.tsx"
Cohesion: 0.17
Nodes (19): AgentOption, AgentQuotes(), remove(), saveDraft(), use(), Draft, Option, sameLines() (+11 more)

### Community 86 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 87 - "error-log.ts"
Cohesion: 0.36
Nodes (5): POST(), cut(), ERROR_KEEP_DAYS, Input, logError()

### Community 88 - "getTokenUserId"
Cohesion: 0.11
Nodes (38): POST(), POST(), POST(), POST(), POST(), GET(), PATCH(), GET() (+30 more)

### Community 90 - "EnquiryDetailSheet.tsx"
Cohesion: 0.16
Nodes (22): CargoSection(), EnquiryDetailSheet(), EVENT_TEXT, Field(), figures(), History(), QUOTED_NOTES, Section() (+14 more)

### Community 92 - "admin-dashboard.ts"
Cohesion: 0.14
Nodes (25): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminLostEnquiryCounts, getAdminTaskHealth, statusCounts(), CACHE (+17 more)

### Community 93 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 94 - "hasRole"
Cohesion: 0.15
Nodes (18): DELETE(), Params, PATCH(), GET(), POST(), GET(), POST(), DELETE() (+10 more)

### Community 102 - "[salesmanId]/page.tsx"
Cohesion: 0.15
Nodes (19): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), AdminMyClientsPage(), MyClientsSection(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection() (+11 more)

### Community 107 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 597 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `ShippingRateTable`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Button`, `accountant/page.tsx`, `TaskCalendar.tsx`, `Skeleton`, `LocationsClient.tsx`, `freight.ts`, `formatDate`, `Topbar.tsx`, `AdminDashboardSections.tsx`, `client.ts`, `TaskOverview.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatAmount`, `BulkImportClientsModal.tsx`, `PageSkeleton`, `ApprovalsView.tsx`, `CompanyReportForm.tsx`, `getSalesPalSession`, `enquiry-agent.ts`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `my-overview/page.tsx`, `utils.ts`, `salesman/page.tsx`, `UserMenu.tsx`, `EnquiryForm`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `AgentQuotes.tsx`, `EnquiryDetailSheet.tsx`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06664198445020363 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ShippingRateTable`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Button`, `report-pdf.tsx`, `admin-drilldown.ts`, `TaskCalendar.tsx`, `nav-meta.ts`, `clients/route.ts`, `jobs/route.ts`, `LocationsClient.tsx`, `formatDate`, `Topbar.tsx`, `leave-badges.ts`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `client.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatAmount`, `enquiryRef`, `scoping.ts`, `package.json`, `leave-actions.ts`, `task.ts`, `ApprovalsView.tsx`, `cached-queries.ts`, `prisma`, `list-params.ts`, `admin/layout.tsx`, `getSalesPalSession`, `enquiry-agent.ts`, `tasks-list.ts`, `admin/clients/[id]/page.tsx`, `my-overview/page.tsx`, `utils.ts`, `clients/[id]/documents/[docId]/route.ts`, `app/layout.tsx`, `salesman/page.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `prisma.ts`, `Sidebar.tsx`, `agent-quote/[token]/route.ts`, `instrumentation.ts`, `error-log.ts`, `getTokenUserId`, `EnquiryDetailSheet.tsx`, `admin-dashboard.ts`, `orders/[id]/page.tsx`, `hasRole`, `[salesmanId]/page.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04732673267326733 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `ShippingRateTable`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Button`, `accountant/page.tsx`, `TaskCalendar.tsx`, `LocationsClient.tsx`, `formatDate`, `Topbar.tsx`, `leave-badges.ts`, `AdminDashboardSections.tsx`, `client.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `BulkImportClientsModal.tsx`, `package.json`, `cn`, `index.mjs`, `ShellContext.tsx`, `dashboard-org/page.tsx`, `ApprovalsView.tsx`, `cached-queries.ts`, `CompanyReportForm.tsx`, `email-queue.ts`, `list-params.ts`, `admin/layout.tsx`, `getSalesPalSession`, `enquiry-agent.ts`, `tasks-list.ts`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `3. Folder map`, `my-overview/page.tsx`, `salesman/page.tsx`, `UserMenu.tsx`, `EnquiryForm`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `AgentQuotes.tsx`, `orders/[id]/page.tsx`, `[salesmanId]/page.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._