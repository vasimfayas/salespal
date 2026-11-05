# Graph Report - salespal  (2026-11-05)

## Corpus Check
- 471 files · ~277,884 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2554 nodes · 9698 edges · 106 communities (100 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4fe51628`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ApprovalsView.tsx
- admin-dashboard.ts
- ManagerClientsList.tsx
- PageSkeleton
- salesman/page.tsx
- TaskCalendar.tsx
- [kind]/page.tsx
- tasks-list.ts
- Topbar.tsx
- clients/route.ts
- Button
- Skeleton
- orders-list.ts
- freight.ts
- list-params.ts
- SalesmanTasksList.tsx
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- AdminDashboardSections.tsx
- client.ts
- utils.ts
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- next
- cn
- Changelog
- react
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- ClientEnquiryForm.tsx
- package.json
- PageHeader
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- leave-actions.ts
- 1.2.0 - 2026-10-28
- company-documents.ts
- 1.7.0 - 2026-10-29
- AgentQuotes.tsx
- proxy.ts
- clients/[id]/documents/[docId]/route.ts
- isOwnerRole
- email-queue.ts
- client-history.ts
- getSalesPalSession
- enquiry-follow-ups.ts
- task.ts
- accountant/page.tsx
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- EnquiryForm
- order.ts
- scripts
- app/layout.tsx
- dashboard-org/page.tsx
- Frontend Design
- buildEnquiryFormPdf
- 1.5.0 - 2026-10-29
- README.md
- SalesPal UI Rules
- 1.6.0 - 2026-10-29
- enquiries.ts
- AGENTS.md
- bench.sh
- my-overview/page.tsx
- BulkImportClientsModal.tsx
- company-report.ts
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- revalidateEnquiryPages
- EnquiriesClient.tsx
- removeDocumentFile
- Sidebar.tsx
- Bug log
- CompanyReportForm.tsx
- leave-badges.ts
- RateCard.tsx
- 1.11.0 - 2026-11-02
- SalesPal Architecture
- salesman-report.ts
- EmailTemplatesClient.tsx
- UserMenu.tsx
- cached-queries.ts
- types/auth.ts
- report-pdf.tsx
- admin/clients/page.tsx
- ShellContext.tsx
- kpi.ts
- eslint.config.mjs
- CompanyComparisonCard.tsx
- orders/[id]/page.tsx
- accounts/page.tsx
- next.config.ts
- overrides
- nav-meta.ts
- 1.12.0 - 2026-11-04
- enquiry-form/[token]/route.ts
- LocationsClient

## God Nodes (most connected - your core abstractions)
1. `cn()` - 253 edges
2. `next` - 172 edges
3. `getSalesPalSession()` - 140 edges
4. `prisma` - 131 edges
5. `react` - 120 edges
6. `Skeleton()` - 114 edges
7. `lucide-react` - 113 edges
8. `Button` - 99 edges
9. `PageHeader()` - 93 edges
10. `isOwnerRole()` - 82 edges

## Surprising Connections (you probably didn't know these)
- `2. System overview` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `7. API routes (`app/api`)` --references--> `getSalesPalSession()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/auth.ts
- `5.3 Schema management` --references--> `parentIdsWithCr()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/clients-list.ts
- `2026-11-03: A client can't be linked to more than one company (postponed)` --references--> `resolveEnquiryClient()`  [INFERRED]
  docs/bugs/BUGS.md → lib/enquiries.ts
- `Orders and money` --references--> `syncOrderPayments()`  [INFERRED]
  docs/ARCHITECTURE.md → lib/order-payments.ts

## Import Cycles
- None detected.

## Communities (106 total, 6 thin omitted)

### Community 0 - "ApprovalsView.tsx"
Cohesion: 0.09
Nodes (43): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalDecision(), decide(), ApprovalCard() (+35 more)

### Community 1 - "admin-dashboard.ts"
Cohesion: 0.13
Nodes (25): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminLostEnquiryCounts, getAdminTaskHealth, statusCounts(), countLostEnquiries() (+17 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.05
Nodes (68): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverview() (+60 more)

### Community 3 - "PageSkeleton"
Cohesion: 0.20
Nodes (8): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), PageSkeleton()

### Community 4 - "salesman/page.tsx"
Cohesion: 0.12
Nodes (23): GET(), ChartSkeleton(), FollowUpsSection(), HeroSkeleton(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection() (+15 more)

### Community 5 - "TaskCalendar.tsx"
Cohesion: 0.11
Nodes (38): GET(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt() (+30 more)

### Community 6 - "[kind]/page.tsx"
Cohesion: 0.12
Nodes (28): CompanyOverviewPage(), SOURCE_LABELS, ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), Ctx (+20 more)

### Community 7 - "tasks-list.ts"
Cohesion: 0.14
Nodes (22): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), pageParam() (+14 more)

### Community 8 - "Topbar.tsx"
Cohesion: 0.27
Nodes (8): CommandPalette(), getBreadcrumbs(), Topbar(), SimpleTooltip(), Tooltip, TooltipContent, TooltipTrigger, @radix-ui/react-tooltip

### Community 9 - "clients/route.ts"
Cohesion: 0.12
Nodes (38): PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), handleStatusChange(), handleStatusChange(), cleanText() (+30 more)

### Community 10 - "Button"
Cohesion: 0.08
Nodes (47): Error(), TaskForm(), DocumentDialog(), ContactDetailsDialog(), ContactForm(), DeleteClientButton(), availableActions(), ConfirmDialog() (+39 more)

### Community 11 - "Skeleton"
Cohesion: 0.07
Nodes (32): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+24 more)

### Community 12 - "orders-list.ts"
Cohesion: 0.16
Nodes (17): AdminOrdersPage(), ManagerOrdersPage(), ManagerOrdersSection(), OrdersListSkeleton(), OrdersListSection(), OrdersListSkeleton(), SalesmanOrdersPage(), Paged (+9 more)

### Community 13 - "freight.ts"
Cohesion: 0.11
Nodes (34): CargoDimensionsField(), DIMENSIONS, isBlank(), PackageLineInput, Summary(), validLines(), openEdit(), CargoSection() (+26 more)

### Community 14 - "list-params.ts"
Cohesion: 0.13
Nodes (25): AdminEnquiriesPage(), AdminMyClientsPage(), MyClientsSection(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerMyClientsPage(), MyClientsSection() (+17 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.10
Nodes (37): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), ClientPicker() (+29 more)

### Community 16 - "1.10.0 - 2026-11-01"
Cohesion: 0.40
Nodes (5): 1.10.0 - 2026-11-01, Added, Changed, Deploy note, Fixed

### Community 17 - "seed.ts"
Cohesion: 0.08
Nodes (37): AIR_ORIGINS, between(), CANCEL_REASONS, chance(), CLIENT_PREFIX, CLIENT_SECTOR, dateOnly(), daysAgo() (+29 more)

### Community 18 - "1.8.0 - 2026-10-29"
Cohesion: 0.40
Nodes (5): 1.8.0 - 2026-10-29, Added, Changed, Deploy note, Fixed

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.10
Nodes (38): POST(), GET(), ACTIONS, POST(), POST(), POST(), GET(), PATCH() (+30 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.14
Nodes (33): AdminDashboardPage(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo(), HeroSkeleton(), KpiCardsRow() (+25 more)

### Community 21 - "client.ts"
Cohesion: 0.09
Nodes (33): ClientDocumentsCard(), remove(), DialogState, submit(), fileUrl(), CompanyInfoCard(), docUrl(), CompanyLogo() (+25 more)

### Community 22 - "utils.ts"
Cohesion: 0.08
Nodes (47): OrderDetail(), ClientHistory(), Empty(), RecordLink(), Route(), OrderRole, OrderList(), flash() (+39 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.12
Nodes (29): emptyForm, MODES, PLACE, ShippingRateModal(), ShippingRateModalProps, formatFx(), formatRatePrice(), MODE_ICON (+21 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (33): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+25 more)

### Community 25 - "next"
Cohesion: 0.09
Nodes (38): DELETE(), Params, PATCH(), GET(), POST(), labelMap, DELETE(), load() (+30 more)

### Community 26 - "cn"
Cohesion: 0.10
Nodes (25): AuthLayout(), LoginForm(), LoginPage(), CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState (+17 more)

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "react"
Cohesion: 0.07
Nodes (73): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), ManagerTeamClient(), handleAddSubmit(), ManagerTeamClientProps (+65 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.18
Nodes (29): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+21 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "ClientEnquiryForm.tsx"
Cohesion: 0.31
Nodes (8): emptyPackageLine(), packageLinesPayload(), ClientEnquiryForm(), submit(), emptyEnquiryForm(), Section(), today(), SignaturePad()

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (26): name, prisma, seed, private, version, class-variance-authority, clsx, @fontsource/inter (+18 more)

### Community 34 - "PageHeader"
Cohesion: 0.13
Nodes (18): AgentsPage(), ApprovalsPage(), AgentsPage(), ApprovalsPage(), LocationsPage(), ReportsPage(), CalendarPage(), AgentsPage() (+10 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.12
Nodes (26): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+18 more)

### Community 37 - "1.0.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.0.0 - 2026-10-28, Added, Changed, Fixed

### Community 38 - "leave-actions.ts"
Cohesion: 0.20
Nodes (19): authorize(), coverCandidates(), endLeave(), extendLeave(), getLeaveInfo(), iso(), leaveClash(), LeaveInfo (+11 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "company-documents.ts"
Cohesion: 0.12
Nodes (27): submit(), 4.3 Scoping (who sees which rows), 5.5 Status flows (summary), createCreditRequest(), CreditRequestInput, Result, applyOutcome(), ApprovalError (+19 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "AgentQuotes.tsx"
Cohesion: 0.18
Nodes (22): AgentOption, AgentQuotes(), remove(), saveDraft(), use(), Draft, Option, sameLines() (+14 more)

### Community 44 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.26
Nodes (17): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+9 more)

### Community 45 - "isOwnerRole"
Cohesion: 0.06
Nodes (68): DELETE(), POST(), DELETE(), POST(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow (+60 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.19
Nodes (15): emailLogo(), deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue(), queueEmail(), mailConfigured() (+7 more)

### Community 47 - "client-history.ts"
Cohesion: 0.20
Nodes (11): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientSummary(), n() (+3 more)

### Community 48 - "getSalesPalSession"
Cohesion: 0.13
Nodes (22): handler, AccountantLayout(), AdminLayout(), AdminSalesmenPage(), UsersPage(), ManagerEnquiriesPage(), ManagerLayout(), TeamPage() (+14 more)

### Community 49 - "enquiry-follow-ups.ts"
Cohesion: 0.13
Nodes (20): POST(), POST(), POST(), APPROVAL_KEEP_MONTHS, revalidateClientViews(), sweepDormantClients(), enquiryListInclude(), closeFollowUpTasks() (+12 more)

### Community 50 - "task.ts"
Cohesion: 0.09
Nodes (32): GET(), POST(), PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+24 more)

### Community 51 - "accountant/page.tsx"
Cohesion: 0.13
Nodes (30): GET(), AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo() (+22 more)

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.16
Nodes (26): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+18 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.09
Nodes (41): EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, ENQUIRY_FIELD_LABELS, EnquiryDetails, DEFAULT_DIMENSION_UNIT (+33 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "EnquiryForm"
Cohesion: 0.11
Nodes (21): ChoiceChips(), ContainerChips(), EnquiryForm(), GroupLabel(), jobRefGroupsFor(), ReeferTemps(), resizeTemps(), Switch() (+13 more)

### Community 57 - "order.ts"
Cohesion: 0.15
Nodes (12): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, orderModes, OrderPaymentItem, orderPaymentMethods (+4 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 60 - "dashboard-org/page.tsx"
Cohesion: 0.19
Nodes (17): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+9 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "1.5.0 - 2026-10-29"
Cohesion: 0.67
Nodes (3): 1.5.0 - 2026-10-29, Added, Deploy note

### Community 64 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 65 - "SalesPal UI Rules"
Cohesion: 0.50
Nodes (3): Docs, graphify, SalesPal UI Rules

### Community 66 - "1.6.0 - 2026-10-29"
Cohesion: 0.67
Nodes (3): 1.6.0 - 2026-10-29, Added, Changed

### Community 67 - "enquiries.ts"
Cohesion: 0.09
Nodes (47): AgentQuotePage(), metadata, Notice(), DELETE(), GET(), PUT(), POST(), PATCH() (+39 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "my-overview/page.tsx"
Cohesion: 0.13
Nodes (27): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), MonthHeroSection(), PerformanceCardsSection() (+19 more)

### Community 71 - "BulkImportClientsModal.tsx"
Cohesion: 0.12
Nodes (22): handleReset(), exportAgents(), handleFile(), downloadAgentTemplate(), split(), BulkImportClientsModal(), close(), handleFile() (+14 more)

### Community 73 - "company-report.ts"
Cohesion: 0.11
Nodes (24): GET(), AGENT_LOCK_ROLES, agentMatchesRoute(), placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport() (+16 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "revalidateEnquiryPages"
Cohesion: 0.26
Nodes (13): Ctx, DELETE(), load(), PATCH(), POST(), POST(), quickDetails(), resolveEnquiryClient() (+5 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.09
Nodes (46): PremiumBadge(), ApprovalChip(), CHIP, DetailsPendingChip(), CopyRefButton(), AwaitingClient(), canEditEnquiry(), CompanyTag() (+38 more)

### Community 79 - "removeDocumentFile"
Cohesion: 0.10
Nodes (30): DELETE(), DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), GET() (+22 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.26
Nodes (15): AppShell(), LogoutOverlay(), DashboardContentWrapper(), getNavGroups(), getNavItems(), isNavActive(), useNavigation(), RouteProgress() (+7 more)

### Community 81 - "Bug log"
Cohesion: 0.29
Nodes (6): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), 2026-11-03: A client can't be linked to more than one company (postponed), Bug log, Fixed, Open

### Community 82 - "CompanyReportForm.tsx"
Cohesion: 0.18
Nodes (15): Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso(), Job (+7 more)

### Community 83 - "leave-badges.ts"
Cohesion: 0.31
Nodes (7): DashboardLayout(), CoverBanner(), clean(), NavigationContext, NavigationContextType, NavigationProvider(), getCoveringFor()

### Community 84 - "RateCard.tsx"
Cohesion: 0.24
Nodes (9): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+1 more)

### Community 85 - "1.11.0 - 2026-11-02"
Cohesion: 0.67
Nodes (3): 1.11.0 - 2026-11-02, Added, Changed

### Community 86 - "SalesPal Architecture"
Cohesion: 0.08
Nodes (23): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 5.1 Connection, 5.2 Entity relationship diagram (+15 more)

### Community 87 - "salesman-report.ts"
Cohesion: 0.25
Nodes (12): GET(), runtime, currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth() (+4 more)

### Community 88 - "EmailTemplatesClient.tsx"
Cohesion: 0.18
Nodes (17): EmailTemplatesPage(), EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), COMMON, EMAIL_TEMPLATE_EDITOR_ROLES (+9 more)

### Community 89 - "UserMenu.tsx"
Cohesion: 0.49
Nodes (7): UserMenu(), PerformanceReportButton(), recentMonths(), Popover, PopoverClose, PopoverContent, PopoverTrigger

### Community 90 - "cached-queries.ts"
Cohesion: 0.38
Nodes (10): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+2 more)

### Community 91 - "types/auth.ts"
Cohesion: 0.22
Nodes (7): JWT, next-auth, next-auth/jwt, SalesPalJwt, SalesPalSessionUser, Session, User

### Community 92 - "report-pdf.tsx"
Cohesion: 0.19
Nodes (16): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, 9. Background work, caching and scheduled jobs (+8 more)

### Community 93 - "admin/clients/page.tsx"
Cohesion: 0.48
Nodes (6): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), ClientAssignee, getCachedAdminManagersList, getCachedAdminRelationsList

### Community 94 - "ShellContext.tsx"
Cohesion: 0.38
Nodes (6): readSidebar(), ShellContext, ShellContextValue, ShellProvider(), sidebarListeners, subscribeSidebar()

### Community 95 - "kpi.ts"
Cohesion: 0.29
Nodes (7): calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem, KpiStatus

### Community 96 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 97 - "CompanyComparisonCard.tsx"
Cohesion: 0.24
Nodes (9): clientStatusDot, CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME (+1 more)

### Community 98 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 99 - "accounts/page.tsx"
Cohesion: 0.15
Nodes (14): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, COLORS, compactMoney, fullMoney, TrendPoint (+6 more)

### Community 103 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

### Community 105 - "nav-meta.ts"
Cohesion: 0.19
Nodes (10): DashboardIndex(), GROUPS, ICONS, isShortcutActive(), NavGroup, NavItem, ROLE_LABELS, navConfig (+2 more)

### Community 107 - "1.12.0 - 2026-11-04"
Cohesion: 0.67
Nodes (3): 1.12.0 - 2026-11-04, Added, Changed

### Community 111 - "enquiry-form/[token]/route.ts"
Cohesion: 0.13
Nodes (18): POST(), POST(), POST(), POST(), Clients, onRequestError(), register(), agentLinkExpired() (+10 more)

### Community 116 - "LocationsClient"
Cohesion: 0.53
Nodes (5): LocationsClient(), changed(), remove(), save(), resetLocations()

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 616 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ApprovalsView.tsx`, `admin-dashboard.ts`, `ManagerClientsList.tsx`, `salesman/page.tsx`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `tasks-list.ts`, `Topbar.tsx`, `clients/route.ts`, `Button`, `orders-list.ts`, `list-params.ts`, `SalesmanTasksList.tsx`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `client.ts`, `utils.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `cn`, `react`, `package.json`, `PageHeader`, `leave-actions.ts`, `company-documents.ts`, `proxy.ts`, `clients/[id]/documents/[docId]/route.ts`, `isOwnerRole`, `getSalesPalSession`, `enquiry-follow-ups.ts`, `task.ts`, `admin/clients/[id]/page.tsx`, `app/layout.tsx`, `dashboard-org/page.tsx`, `enquiries.ts`, `my-overview/page.tsx`, `revalidateEnquiryPages`, `EnquiriesClient.tsx`, `removeDocumentFile`, `Sidebar.tsx`, `leave-badges.ts`, `salesman-report.ts`, `EmailTemplatesClient.tsx`, `cached-queries.ts`, `report-pdf.tsx`, `CompanyComparisonCard.tsx`, `orders/[id]/page.tsx`, `accounts/page.tsx`, `next.config.ts`, `nav-meta.ts`, `enquiry-form/[token]/route.ts`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ApprovalsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09098039215686274 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `ApprovalsView.tsx`, `ManagerClientsList.tsx`, `salesman/page.tsx`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `Topbar.tsx`, `Button`, `Skeleton`, `freight.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `client.ts`, `utils.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `react`, `PageHeader`, `AgentQuotes.tsx`, `isOwnerRole`, `accountant/page.tsx`, `enquiry.ts`, `EnquiryForm`, `my-overview/page.tsx`, `BulkImportClientsModal.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `CompanyReportForm.tsx`, `RateCard.tsx`, `EmailTemplatesClient.tsx`, `UserMenu.tsx`, `CompanyComparisonCard.tsx`, `accounts/page.tsx`, `LocationsClient`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Should `admin-dashboard.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ApprovalsView.tsx`, `ManagerClientsList.tsx`, `salesman/page.tsx`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `tasks-list.ts`, `Topbar.tsx`, `Button`, `orders-list.ts`, `list-params.ts`, `SalesmanTasksList.tsx`, `AdminDashboardSections.tsx`, `client.ts`, `utils.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `cn`, `ClientEnquiryForm.tsx`, `package.json`, `index.mjs`, `AgentQuotes.tsx`, `isOwnerRole`, `getSalesPalSession`, `accountant/page.tsx`, `admin/clients/[id]/page.tsx`, `enquiry.ts`, `dashboard-org/page.tsx`, `my-overview/page.tsx`, `BulkImportClientsModal.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `CompanyReportForm.tsx`, `leave-badges.ts`, `SalesPal Architecture`, `EmailTemplatesClient.tsx`, `UserMenu.tsx`, `cached-queries.ts`, `admin/clients/page.tsx`, `ShellContext.tsx`, `orders/[id]/page.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._