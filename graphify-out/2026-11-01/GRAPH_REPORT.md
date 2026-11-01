# Graph Report - salespal  (2026-11-01)

## Corpus Check
- 453 files · ~267,988 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2471 nodes · 9319 edges · 90 communities (85 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `768aba54`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- company-actions.ts
- buttonVariants
- ManagerClientsList.tsx
- Modal
- report-pdf.tsx
- accountant/page.tsx
- admin-drilldown.ts
- Button
- user-actions.ts
- clients/route.ts
- getTokenUserId
- Skeleton
- LocationPicker.tsx
- freight.ts
- ClientOverview.tsx
- SalesmanTasksList.tsx
- TaskCalendar.tsx
- seed.ts
- next
- enquiries.ts
- AdminDashboardSections.tsx
- company.ts
- orderStatsScope
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- formatDate
- accounts/page.tsx
- Changelog
- AgentsClient.tsx
- enquiryRef
- control-panel/page.tsx
- dependencies
- scoping.ts
- package.json
- cn
- compilerOptions
- index.mjs
- types/auth.ts
- leave-actions.ts
- enquiry-form/[token]/page.tsx
- task.ts
- PageSkeleton
- admin/clients/[id]/page.tsx
- cached-queries.ts
- revalidateEnquiryPages
- CompanyReportForm.tsx
- email-queue.ts
- list-params.ts
- admin/layout.tsx
- getSalesPalSession
- email-templates/route.ts
- tasks-list.ts
- dashboard/page.tsx
- enquiry.ts
- devDependencies
- kpi.ts
- company-report.ts
- salesman/page.tsx
- scripts
- proxy.ts
- utils.ts
- Frontend Design
- buildEnquiryFormPdf
- company-documents.ts
- README.md
- SalesPal UI Rules
- app/layout.tsx
- order.ts
- AGENTS.md
- bench.sh
- admin-dashboard.ts
- UserMenu.tsx
- ClientEnquiryForm.tsx
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- dashboard-org/page.tsx
- Sidebar.tsx
- Bug log
- agent-quote/[token]/route.ts
- TaskCard.tsx
- client.ts
- formatAmount
- enquiry-agent.ts
- error-log.ts
- TaskOverview.tsx
- orders/[id]/page.tsx

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
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.5 Status flows (summary)` --references--> `sweepDormantClients()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/client-status-flow.ts
- `Orders and money` --references--> `syncOrderPayments()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/order-payments.ts
- `4.1 Roles` --references--> `isOwnerRole()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/roles.ts

## Import Cycles
- None detected.

## Communities (90 total, 5 thin omitted)

### Community 0 - "company-actions.ts"
Cohesion: 0.10
Nodes (37): DELETE(), POST(), ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies(), assignAccountantToOrg(), assignManagerToOrg() (+29 more)

### Community 1 - "buttonVariants"
Cohesion: 0.11
Nodes (24): LoginForm(), LoginPage(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, Org, User, NotFound() (+16 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.07
Nodes (51): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), handleStatusChange(), ManagerClientsListProps, SalesmanItem, Client (+43 more)

### Community 3 - "Modal"
Cohesion: 0.12
Nodes (22): roleName(), UsersClient(), CreditRequestPanel(), submit(), ClientDetailModal(), StatCardWithDetails(), SendToClientDialog(), LocationsClient() (+14 more)

### Community 4 - "report-pdf.tsx"
Cohesion: 0.19
Nodes (16): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, writeStoredFile() (+8 more)

### Community 5 - "accountant/page.tsx"
Cohesion: 0.14
Nodes (26): GET(), AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo() (+18 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.14
Nodes (25): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), KpiCardsRow(), getAdminLostEnquiryCounts, clientsEntering() (+17 more)

### Community 7 - "Button"
Cohesion: 0.12
Nodes (40): Error(), TaskForm(), ContactDetailsDialog(), ContactForm(), DeleteClientButton(), availableActions(), ConfirmDialog(), EnquiryStageActions() (+32 more)

### Community 8 - "user-actions.ts"
Cohesion: 0.35
Nodes (11): remove(), save(), canManageRole(), createUser(), deleteUser(), parseUser(), Result, revalidateUsers() (+3 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.23
Nodes (22): DELETE(), PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), cleanText(), CONTACT_FIELD_LABELS (+14 more)

### Community 10 - "getTokenUserId"
Cohesion: 0.15
Nodes (19): DELETE(), load(), Params, PATCH(), POST(), POST(), GET(), PATCH() (+11 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (23): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+15 more)

### Community 12 - "LocationPicker.tsx"
Cohesion: 0.22
Nodes (11): KIND, LocationPicker(), choose(), COUNTRIES, CountryDef, FreightLocation, KIND_FOR_MODE, LocationKind (+3 more)

### Community 13 - "freight.ts"
Cohesion: 0.09
Nodes (36): CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, packageLinesPayload(), Summary(), validLines(), submit() (+28 more)

### Community 14 - "ClientOverview.tsx"
Cohesion: 0.11
Nodes (20): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect(), taskStatuses, clientStatusDot (+12 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.11
Nodes (32): FollowUpsSection(), ClientPicker(), ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel(), EMPTY_MESSAGES (+24 more)

### Community 16 - "TaskCalendar.tsx"
Cohesion: 0.11
Nodes (37): GET(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt() (+29 more)

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (36): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+28 more)

### Community 18 - "next"
Cohesion: 0.09
Nodes (33): DELETE(), Params, PATCH(), GET(), POST(), labelMap, GET(), POST() (+25 more)

### Community 19 - "enquiries.ts"
Cohesion: 0.07
Nodes (46): POST(), POST(), POST(), ACTIONS, POST(), enquiryNeedsApproval(), BLACKLISTED_ERROR, statusAfterEnquiry() (+38 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (33): AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo() (+25 more)

### Community 21 - "company.ts"
Cohesion: 0.17
Nodes (15): CompanyInfoCard(), docUrl(), CompanyLogo(), DocumentExpiryBadge(), styles, CompanyProfile, COMPANY_DOCUMENT_ACCEPT, COMPANY_DOCUMENT_MAX_BYTES (+7 more)

### Community 22 - "orderStatsScope"
Cohesion: 0.36
Nodes (7): GET(), OrderStatsSection(), ManagerOrderStatsSection(), OrderMonthlyChart(), OrderMonthlyChartPoint, getMonthlyOrderStats, orderStatsScope

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (38): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+30 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.14
Nodes (30): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+22 more)

### Community 25 - "formatDate"
Cohesion: 0.15
Nodes (25): OrderDetail(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+17 more)

### Community 26 - "accounts/page.tsx"
Cohesion: 0.10
Nodes (21): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, DashboardFilters(), Org, COLORS, compactMoney (+13 more)

### Community 27 - "Changelog"
Cohesion: 0.05
Nodes (42): 1.0.0 - 2026-10-28, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.2.0 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.0 - 2026-10-28, 1.4.1 - 2026-10-28 (+34 more)

### Community 28 - "AgentsClient.tsx"
Cohesion: 0.08
Nodes (36): AgentsPage(), AgentsPage(), AgentsPage(), handleReset(), AgentRow, AgentsClient(), exportAgents(), save() (+28 more)

### Community 29 - "enquiryRef"
Cohesion: 0.13
Nodes (39): GET(), runtime, submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar() (+31 more)

### Community 30 - "control-panel/page.tsx"
Cohesion: 0.06
Nodes (51): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), DeploymentNote(), ErrorActions(), ErrorStatusFilter() (+43 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "scoping.ts"
Cohesion: 0.21
Nodes (22): DELETE(), POST(), CalendarPage(), 4.3 Scoping (who sees which rows), createCreditRequest(), CreditRequestInput, Result, approvalScopeWhere() (+14 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (32): eslintConfig, nextConfig, name, prisma, seed, private, version, class-variance-authority (+24 more)

### Community 34 - "cn"
Cohesion: 0.19
Nodes (15): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioItem (+7 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.12
Nodes (26): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+18 more)

### Community 37 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 38 - "leave-actions.ts"
Cohesion: 0.10
Nodes (34): DashboardLayout(), CoverBanner(), clean(), NavigationContext, NavigationContextType, NavigationProvider(), LeaveButton(), end() (+26 more)

### Community 39 - "enquiry-form/[token]/page.tsx"
Cohesion: 0.23
Nodes (11): ClientEnquiryFormPage(), metadata, Notice(), toListItem(), CLIENT_FORM_VALID_DAYS, clientFormExpired(), clientFormPath(), clientFormUrl() (+3 more)

### Community 40 - "task.ts"
Cohesion: 0.07
Nodes (44): GET(), POST(), PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+36 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 42 - "admin/clients/[id]/page.tsx"
Cohesion: 0.05
Nodes (71): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+63 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.18
Nodes (19): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), AdminEnquiriesPage(), AdminMyClientsPage() (+11 more)

### Community 44 - "revalidateEnquiryPages"
Cohesion: 0.19
Nodes (18): Ctx, DELETE(), load(), PATCH(), POST(), PATCH(), POST(), POST() (+10 more)

### Community 45 - "CompanyReportForm.tsx"
Cohesion: 0.19
Nodes (15): ReportsPage(), Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso() (+7 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.16
Nodes (16): EmailState, emailLogo(), TYPES, deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue() (+8 more)

### Community 47 - "list-params.ts"
Cohesion: 0.11
Nodes (38): EmailTemplatesPage(), AdminOrdersPage(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), SalesmanDrilldownPage(), ClientsListSection(), ClientsTableSkeleton() (+30 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.31
Nodes (8): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), MonthlyActivityChartProps, EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "getSalesPalSession"
Cohesion: 0.13
Nodes (28): handler, ApprovalsPage(), AccountantLayout(), ApprovalsPage(), LocationsPage(), AdminSalesmenPage(), AdminTasksPage(), UsersPage() (+20 more)

### Community 50 - "email-templates/route.ts"
Cohesion: 0.14
Nodes (22): DELETE(), GET(), PUT(), EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard() (+14 more)

### Community 51 - "tasks-list.ts"
Cohesion: 0.15
Nodes (20): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds(), CLOSED (+12 more)

### Community 52 - "dashboard/page.tsx"
Cohesion: 0.40
Nodes (4): DashboardIndex(), navConfig, NavLink, roleHome

### Community 53 - "enquiry.ts"
Cohesion: 0.08
Nodes (57): ChoiceChips(), ContainerChips(), EnquiryForm(), EnquiryFormState, GroupLabel(), JOB_REF_GROUPS, jobRefGroupsFor(), MODE_LABEL (+49 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "kpi.ts"
Cohesion: 0.25
Nodes (8): calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), groupStatusCounts(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem, KpiStatus

### Community 56 - "company-report.ts"
Cohesion: 0.13
Nodes (19): GET(), 9. Background work, caching and scheduled jobs, placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n() (+11 more)

### Community 57 - "salesman/page.tsx"
Cohesion: 0.13
Nodes (32): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), ChartSkeleton(), HeroSkeleton() (+24 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 60 - "utils.ts"
Cohesion: 0.14
Nodes (23): EMPTY, ROLE_TONE, UserRow, EMPTY, Latest, Option, Result, EMPTY (+15 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "company-documents.ts"
Cohesion: 0.09
Nodes (47): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+39 more)

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
Cohesion: 0.11
Nodes (20): OrderStatusBadge(), TONES, STATUS_ICONS, STATUS_TONES, StatusBadge(), StatusTone, TONE_ICONS, toneClasses (+12 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "admin-dashboard.ts"
Cohesion: 0.11
Nodes (27): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), CACHE, DETAIL_LIMIT (+19 more)

### Community 71 - "UserMenu.tsx"
Cohesion: 0.35
Nodes (9): UserMenu(), PerformanceReportButton(), recentMonths(), Avatar(), sizes, Popover, PopoverClose, PopoverContent (+1 more)

### Community 73 - "ClientEnquiryForm.tsx"
Cohesion: 0.33
Nodes (6): emptyPackageLine(), ClientEnquiryForm(), emptyEnquiryForm(), Section(), today(), SignaturePad()

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.17
Nodes (19): ManagerTeamClientProps, CompanyCheckboxes(), currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths() (+11 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.09
Nodes (38): ApprovalChip(), CHIP, AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge(), EnquiriesClient(), flash() (+30 more)

### Community 79 - "dashboard-org/page.tsx"
Cohesion: 0.19
Nodes (18): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+10 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.10
Nodes (36): AppShell(), LogoutOverlay(), CommandPalette(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups(), getNavItems(), GROUPS (+28 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "agent-quote/[token]/route.ts"
Cohesion: 0.36
Nodes (7): POST(), POST(), agentLinkExpired(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 83 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 84 - "client.ts"
Cohesion: 0.13
Nodes (24): ClientDocumentsCard(), remove(), DialogState, DocumentDialog(), submit(), fileUrl(), SimpleTooltip(), Tooltip (+16 more)

### Community 85 - "formatAmount"
Cohesion: 0.21
Nodes (20): AgentQuotes(), remove(), saveDraft(), use(), Draft, Option, sameLines(), send() (+12 more)

### Community 86 - "enquiry-agent.ts"
Cohesion: 0.18
Nodes (17): AgentQuotePage(), metadata, Notice(), POST(), SENDABLE, AgentQuoteForm(), AGENT_LINK_VALID_DAYS, AgentEnquiry (+9 more)

### Community 87 - "error-log.ts"
Cohesion: 0.24
Nodes (6): onRequestError(), register(), cut(), ERROR_KEEP_DAYS, Input, logError()

### Community 89 - "TaskOverview.tsx"
Cohesion: 0.36
Nodes (6): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), TasksSection(), TasksSkeleton()

### Community 93 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 593 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `company-actions.ts`, `buttonVariants`, `ManagerClientsList.tsx`, `Modal`, `accountant/page.tsx`, `Button`, `Skeleton`, `LocationPicker.tsx`, `freight.ts`, `ClientOverview.tsx`, `SalesmanTasksList.tsx`, `TaskCalendar.tsx`, `AdminDashboardSections.tsx`, `company.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatDate`, `accounts/page.tsx`, `AgentsClient.tsx`, `control-panel/page.tsx`, `leave-actions.ts`, `PageSkeleton`, `admin/clients/[id]/page.tsx`, `CompanyReportForm.tsx`, `getSalesPalSession`, `email-templates/route.ts`, `enquiry.ts`, `salesman/page.tsx`, `utils.ts`, `order.ts`, `UserMenu.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `client.ts`, `formatAmount`, `TaskOverview.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `company-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10404040404040404 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `company-actions.ts`, `buttonVariants`, `ManagerClientsList.tsx`, `Modal`, `report-pdf.tsx`, `admin-drilldown.ts`, `Button`, `user-actions.ts`, `clients/route.ts`, `getTokenUserId`, `ClientOverview.tsx`, `SalesmanTasksList.tsx`, `TaskCalendar.tsx`, `enquiries.ts`, `orderStatsScope`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatDate`, `accounts/page.tsx`, `AgentsClient.tsx`, `enquiryRef`, `control-panel/page.tsx`, `scoping.ts`, `package.json`, `leave-actions.ts`, `enquiry-form/[token]/page.tsx`, `task.ts`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `revalidateEnquiryPages`, `list-params.ts`, `admin/layout.tsx`, `getSalesPalSession`, `email-templates/route.ts`, `dashboard/page.tsx`, `salesman/page.tsx`, `proxy.ts`, `utils.ts`, `company-documents.ts`, `app/layout.tsx`, `admin-dashboard.ts`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `dashboard-org/page.tsx`, `Sidebar.tsx`, `agent-quote/[token]/route.ts`, `client.ts`, `enquiry-agent.ts`, `error-log.ts`, `orders/[id]/page.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Should `buttonVariants` be split into smaller, more focused modules?**
  _Cohesion score 0.11290322580645161 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `TaskOverview.tsx`, `cn`, `accountant/page.tsx`, `PageSkeleton`, `admin/clients/[id]/page.tsx`, `cached-queries.ts`, `dashboard-org/page.tsx`, `list-params.ts`, `getSalesPalSession`, `TaskCalendar.tsx`, `tasks-list.ts`, `AdminDashboardSections.tsx`, `ManagerDashboardSections.tsx`, `salesman/page.tsx`, `orders/[id]/page.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._