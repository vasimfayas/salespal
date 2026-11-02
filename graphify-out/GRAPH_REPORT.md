# Graph Report - salespal  (2026-11-02)

## Corpus Check
- 456 files · ~270,068 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2494 nodes · 9407 edges · 108 communities (102 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1fe6bf7f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dashboard-org/page.tsx
- CompaniesClient.tsx
- ManagerClientsList.tsx
- react
- task.ts
- accountant/page.tsx
- admin-drilldown.ts
- TaskCalendar.tsx
- Button
- clients/route.ts
- client.ts
- Skeleton
- enquiry-agent.ts
- freight.ts
- admin-dashboard.ts
- SalesmanTasksList.tsx
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- cn
- company.ts
- OrderList.tsx
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- formatDate
- nav-meta.ts
- Changelog
- AgentsClient.tsx
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- company-report.ts
- package.json
- ThemeToggle.tsx
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- leave-actions.ts
- 1.2.0 - 2026-10-28
- scoping.ts
- 1.7.0 - 2026-10-29
- ApprovalsView.tsx
- cached-queries.ts
- enquiries.ts
- ShippingRateModal.tsx
- email-queue.ts
- list-params.ts
- admin/layout.tsx
- getSalesPalSession
- SendToAgentDialog.tsx
- tasks-list.ts
- admin/clients/[id]/page.tsx
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- report-pdf.tsx
- my-overview/page.tsx
- scripts
- getEnquiriesPage
- buttonVariants
- Frontend Design
- buildEnquiryFormPdf
- 1.5.0 - 2026-10-29
- README.md
- SalesPal UI Rules
- 1.6.0 - 2026-10-29
- EnquiryDetailSheet.tsx
- AGENTS.md
- bench.sh
- salesman/page.tsx
- PageSkeleton
- ClientEnquiryForm.tsx
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- UsersClient.tsx
- utils.ts
- clients/[id]/documents/[docId]/route.ts
- Sidebar.tsx
- Bug log
- 5.4 Tables and columns
- CompanyReportForm.tsx
- AgentQuotes.tsx
- ClientOverview.tsx
- salesman-report.ts
- SalesPal Architecture
- getTokenUserId
- ClientDocumentsCard.tsx
- client-history.ts
- Topbar.tsx
- leave-badges.ts
- next.config.ts
- next
- overrides
- app/layout.tsx
- proxy.ts
- formatAmount
- UserMenu.tsx
- agent-quote/[token]/page.tsx
- agent-quote/[token]/route.ts
- error-log.ts
- ShellContext.tsx
- ClientContactsCard
- 3. Folder map
- instrumentation.ts
- 1.11.0 - 2026-11-02

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

## Communities (108 total, 6 thin omitted)

### Community 0 - "dashboard-org/page.tsx"
Cohesion: 0.19
Nodes (17): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+9 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.07
Nodes (60): DELETE(), POST(), DELETE(), POST(), ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User (+52 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.09
Nodes (44): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors (+36 more)

### Community 3 - "react"
Cohesion: 0.14
Nodes (18): Error(), NotFound(), EMPTY, Main, ClientDetailModal(), Option, StatCardWithDetails(), Result (+10 more)

### Community 4 - "task.ts"
Cohesion: 0.08
Nodes (36): GET(), POST(), PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+28 more)

### Community 5 - "accountant/page.tsx"
Cohesion: 0.08
Nodes (32): AccountantDashboardPage(), dynamic, orderNo(), dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, COLORS (+24 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.16
Nodes (21): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), DrilldownPager(), clientsEntering(), DrillClient (+13 more)

### Community 7 - "TaskCalendar.tsx"
Cohesion: 0.09
Nodes (47): addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt(), iso() (+39 more)

### Community 8 - "Button"
Cohesion: 0.17
Nodes (21): AgentQuoteForm(), MultiInput(), ApprovalDecision(), decide(), CreditRequestPanel(), submit(), EMPTY, Latest (+13 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.15
Nodes (31): PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), handleStatusChange(), handleStatusChange(), cleanText() (+23 more)

### Community 10 - "client.ts"
Cohesion: 0.11
Nodes (23): clientStatusDot, ClientStatusDropdown(), ClientSwitcher(), go(), readRecent(), rememberClient(), Result, colors (+15 more)

### Community 11 - "Skeleton"
Cohesion: 0.08
Nodes (25): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+17 more)

### Community 12 - "enquiry-agent.ts"
Cohesion: 0.11
Nodes (20): Enquiries and quotes, esc(), renderEmail(), AGENT_LINK_VALID_DAYS, AgentEnquiry, agentShipmentRows(), MODE, qty() (+12 more)

### Community 13 - "freight.ts"
Cohesion: 0.13
Nodes (29): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), PackageLineInput, Summary(), validLines(), CargoSection() (+21 more)

### Community 14 - "admin-dashboard.ts"
Cohesion: 0.17
Nodes (20): KpiCardsSection(), CACHE, Counts, getAdminKpiCounts, getAdminLostEnquiryCounts, getAdminTaskHealth, statusCounts(), countLostEnquiries() (+12 more)

### Community 15 - "SalesmanTasksList.tsx"
Cohesion: 0.13
Nodes (27): FollowUpsSection(), ClientPicker(), ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask, assignedByLabel(), EMPTY_MESSAGES (+19 more)

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
Cohesion: 0.08
Nodes (43): POST(), POST(), POST(), ACTIONS, POST(), POST(), BLACKLISTED_ERROR, statusAfterOrder() (+35 more)

### Community 20 - "cn"
Cohesion: 0.10
Nodes (42): AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo() (+34 more)

### Community 21 - "company.ts"
Cohesion: 0.17
Nodes (20): Org, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard(), docUrl() (+12 more)

### Community 22 - "OrderList.tsx"
Cohesion: 0.08
Nodes (47): OrderDetail(), ApprovalCard(), CreditDetails(), EnquiryDetails(), Fields(), EnquiryDetailSheet(), DetailsForm(), OPEN (+39 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.07
Nodes (43): Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard(), RateCardBadge (+35 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.11
Nodes (36): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+28 more)

### Community 25 - "formatDate"
Cohesion: 0.16
Nodes (15): getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), ApprovalBadge(), submit(), submit(), getDueDateColor() (+7 more)

### Community 26 - "nav-meta.ts"
Cohesion: 0.15
Nodes (12): LoginForm(), LoginPage(), DashboardIndex(), GROUPS, ICONS, isShortcutActive(), NavGroup, NavItem (+4 more)

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "AgentsClient.tsx"
Cohesion: 0.10
Nodes (23): AgentsClient(), exportAgents(), save(), EMPTY, toBody(), AGENT_COLUMNS, BulkImportAgentsModal(), handleFile() (+15 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.22
Nodes (26): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+18 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "company-report.ts"
Cohesion: 0.13
Nodes (20): GET(), 9. Background work, caching and scheduled jobs, placeCountry(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n() (+12 more)

### Community 33 - "package.json"
Cohesion: 0.07
Nodes (29): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+21 more)

### Community 34 - "ThemeToggle.tsx"
Cohesion: 0.21
Nodes (12): AuthLayout(), subscribe(), ThemeToggle(), useMounted(), DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator (+4 more)

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
Cohesion: 0.16
Nodes (23): end(), load(), save(), saveExtend(), authorize(), coverCandidates(), endLeave(), extendLeave() (+15 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "scoping.ts"
Cohesion: 0.12
Nodes (36): GET(), POST(), CalendarPage(), 4.3 Scoping (who sees which rows), createCreditRequest(), CreditRequestInput, Result, approvalScopeWhere() (+28 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "ApprovalsView.tsx"
Cohesion: 0.09
Nodes (42): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ACTION_LABEL, ApprovalTimeline(), DeploymentNote() (+34 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.14
Nodes (23): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), AdminEnquiriesPage(), AdminMyClientsPage() (+15 more)

### Community 44 - "enquiries.ts"
Cohesion: 0.08
Nodes (52): DELETE(), GET(), PUT(), Ctx, DELETE(), load(), PATCH(), POST() (+44 more)

### Community 45 - "ShippingRateModal.tsx"
Cohesion: 0.10
Nodes (28): KIND, LocationPicker(), choose(), EMPTY, KINDS, LocationsClient(), changed(), remove() (+20 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.17
Nodes (16): emailLogo(), TYPES, deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus, emailQueue(), queueEmail() (+8 more)

### Community 47 - "list-params.ts"
Cohesion: 0.09
Nodes (43): EmailTemplatesPage(), AdminOrdersPage(), ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection(), ManagerMyClientsPage(), MyClientsSection(), ManagerOrdersPage() (+35 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.31
Nodes (8): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), MonthlyActivityChartProps, EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "getSalesPalSession"
Cohesion: 0.11
Nodes (30): handler, AgentsPage(), ApprovalsPage(), AccountantLayout(), AgentsPage(), ApprovalsPage(), LocationsPage(), ReportsPage() (+22 more)

### Community 50 - "SendToAgentDialog.tsx"
Cohesion: 0.11
Nodes (23): EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), Agent, MailContext, SendToAgentDialog() (+15 more)

### Community 51 - "tasks-list.ts"
Cohesion: 0.13
Nodes (22): AdminTasksPage(), ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds() (+14 more)

### Community 52 - "admin/clients/[id]/page.tsx"
Cohesion: 0.20
Nodes (22): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), ManagerClientDetailPage(), SearchParams, ClientOverviewLoading() (+14 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.09
Nodes (50): ChoiceChips(), ContainerChips(), EnquiryForm(), EnquiryFormState, GroupLabel(), JOB_REF_GROUPS, jobRefGroupsFor(), MODE_LABEL (+42 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "report-pdf.tsx"
Cohesion: 0.20
Nodes (15): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+7 more)

### Community 57 - "my-overview/page.tsx"
Cohesion: 0.16
Nodes (22): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), MonthHeroSection(), PerformanceCardsSection() (+14 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "getEnquiriesPage"
Cohesion: 0.29
Nodes (12): GET(), AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), OperationsEnquiriesPage(), AccountantCompanyChips(), NoAssignedCompanies() (+4 more)

### Community 60 - "buttonVariants"
Cohesion: 0.21
Nodes (15): handleReset(), BulkImportClientsModal(), close(), handleFile(), reset(), resolveSalesman(), runImport(), FollowUpForm() (+7 more)

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

### Community 67 - "EnquiryDetailSheet.tsx"
Cohesion: 0.17
Nodes (14): ApprovalChip(), CHIP, EVENT_TEXT, figures(), History(), QUOTED_NOTES, EnquiryPdfButton(), download() (+6 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.13
Nodes (23): GET(), ChartSkeleton(), HeroSkeleton(), KpiCardsSkeleton(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection(), QUICK_ACTIONS (+15 more)

### Community 71 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 73 - "ClientEnquiryForm.tsx"
Cohesion: 0.36
Nodes (7): packageLinesPayload(), ClientEnquiryForm(), submit(), emptyEnquiryForm(), Section(), today(), SignaturePad()

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "UsersClient.tsx"
Cohesion: 0.11
Nodes (30): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), save(), ManagerTeamClientProps, currentMonth() (+22 more)

### Community 78 - "utils.ts"
Cohesion: 0.11
Nodes (31): ClientHistory(), Empty(), RecordLink(), Route(), AwaitingClient(), canEditEnquiry(), CompanyTag(), daysOpen() (+23 more)

### Community 79 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.09
Nodes (43): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+35 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.26
Nodes (15): AppShell(), LogoutOverlay(), DashboardContentWrapper(), getNavGroups(), getNavItems(), isNavActive(), useNavigation(), RouteProgress() (+7 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "5.4 Tables and columns"
Cohesion: 0.20
Nodes (10): 5.1 Connection, 5.2 Entity relationship diagram, 5.3 Schema management, 5.4 Tables and columns, 5.5 Status flows (summary), 5. Database, Orders and money, Roles, companies, people (+2 more)

### Community 83 - "CompanyReportForm.tsx"
Cohesion: 0.22
Nodes (13): Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso(), Job (+5 more)

### Community 84 - "AgentQuotes.tsx"
Cohesion: 0.22
Nodes (19): AgentOption, AgentQuotes(), remove(), saveDraft(), use(), Draft, Option, sameLines() (+11 more)

### Community 85 - "ClientOverview.tsx"
Cohesion: 0.16
Nodes (8): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect(), taskStatuses, PremiumBadge()

### Community 86 - "salesman-report.ts"
Cohesion: 0.28
Nodes (11): GET(), runtime, clientStatusCounts(), currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num (+3 more)

### Community 87 - "SalesPal Architecture"
Cohesion: 0.15
Nodes (12): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 4.1 Roles, 4.2 Sign-in, 4. Roles, authentication and data scoping (+4 more)

### Community 88 - "getTokenUserId"
Cohesion: 0.18
Nodes (20): POST(), POST(), POST(), POST(), GET(), PATCH(), GET(), POST() (+12 more)

### Community 89 - "ClientDocumentsCard.tsx"
Cohesion: 0.21
Nodes (12): ClientDocumentsCard(), remove(), DialogState, DocumentDialog(), submit(), fileUrl(), CLIENT_DOC_TYPES, ClientDocType (+4 more)

### Community 90 - "client-history.ts"
Cohesion: 0.21
Nodes (12): HistorySection(), CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientHistory() (+4 more)

### Community 91 - "Topbar.tsx"
Cohesion: 0.26
Nodes (8): CommandPalette(), getBreadcrumbs(), Topbar(), SimpleTooltip(), Tooltip, TooltipContent, TooltipTrigger, @radix-ui/react-tooltip

### Community 92 - "leave-badges.ts"
Cohesion: 0.29
Nodes (8): DashboardLayout(), CoverBanner(), clean(), NavigationContext, NavigationContextType, NavigationProvider(), getCoveringFor(), activeLeaveWhere()

### Community 94 - "next"
Cohesion: 0.08
Nodes (34): DELETE(), Params, PATCH(), GET(), POST(), labelMap, DELETE(), load() (+26 more)

### Community 95 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

### Community 96 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 98 - "formatAmount"
Cohesion: 0.33
Nodes (10): orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText(), Toast() (+2 more)

### Community 99 - "UserMenu.tsx"
Cohesion: 0.42
Nodes (8): UserMenu(), PerformanceReportButton(), recentMonths(), Popover, PopoverClose, PopoverContent, PopoverTrigger, @radix-ui/react-popover

### Community 100 - "agent-quote/[token]/page.tsx"
Cohesion: 0.31
Nodes (7): AgentQuotePage(), metadata, Notice(), CompanyLogo(), CompanyLogoEditor(), agentLinkExpired(), COMPANY_LOGO_ACCEPT

### Community 101 - "agent-quote/[token]/route.ts"
Cohesion: 0.42
Nodes (6): POST(), POST(), allowAttempt(), clearAttempts(), clientIp(), hits

### Community 102 - "error-log.ts"
Cohesion: 0.36
Nodes (5): POST(), cut(), ERROR_KEEP_DAYS, Input, logError()

### Community 103 - "ShellContext.tsx"
Cohesion: 0.38
Nodes (6): readSidebar(), ShellContext, ShellContextValue, ShellProvider(), sidebarListeners, subscribeSidebar()

### Community 104 - "ClientContactsCard"
Cohesion: 0.33
Nodes (3): blank(), ClientContactsCard(), ContactRow()

### Community 105 - "3. Folder map"
Cohesion: 0.33
Nodes (4): 3. Folder map, useKpi(), useTasks(), TaskListItem

### Community 106 - "instrumentation.ts"
Cohesion: 0.40
Nodes (3): Clients, onRequestError(), register()

### Community 107 - "1.11.0 - 2026-11-02"
Cohesion: 0.67
Nodes (3): 1.11.0 - 2026-11-02, Added, Changed

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 599 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `react`, `accountant/page.tsx`, `TaskCalendar.tsx`, `Button`, `client.ts`, `Skeleton`, `freight.ts`, `SalesmanTasksList.tsx`, `company.ts`, `OrderList.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatDate`, `nav-meta.ts`, `AgentsClient.tsx`, `ThemeToggle.tsx`, `ApprovalsView.tsx`, `ShippingRateModal.tsx`, `getSalesPalSession`, `SendToAgentDialog.tsx`, `enquiry.ts`, `my-overview/page.tsx`, `buttonVariants`, `EnquiryDetailSheet.tsx`, `salesman/page.tsx`, `PageSkeleton`, `UsersClient.tsx`, `utils.ts`, `Sidebar.tsx`, `CompanyReportForm.tsx`, `AgentQuotes.tsx`, `ClientOverview.tsx`, `ClientDocumentsCard.tsx`, `Topbar.tsx`, `formatAmount`, `UserMenu.tsx`, `agent-quote/[token]/page.tsx`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06558558558558558 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `dashboard-org/page.tsx`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `react`, `task.ts`, `accountant/page.tsx`, `admin-drilldown.ts`, `TaskCalendar.tsx`, `Button`, `clients/route.ts`, `client.ts`, `admin-dashboard.ts`, `SalesmanTasksList.tsx`, `enquiry-flow.ts`, `cn`, `company.ts`, `OrderList.tsx`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `nav-meta.ts`, `AgentsClient.tsx`, `package.json`, `leave-actions.ts`, `scoping.ts`, `ApprovalsView.tsx`, `cached-queries.ts`, `enquiries.ts`, `ShippingRateModal.tsx`, `list-params.ts`, `admin/layout.tsx`, `getSalesPalSession`, `SendToAgentDialog.tsx`, `tasks-list.ts`, `admin/clients/[id]/page.tsx`, `report-pdf.tsx`, `my-overview/page.tsx`, `EnquiryDetailSheet.tsx`, `salesman/page.tsx`, `UsersClient.tsx`, `utils.ts`, `clients/[id]/documents/[docId]/route.ts`, `Sidebar.tsx`, `ClientOverview.tsx`, `salesman-report.ts`, `getTokenUserId`, `ClientDocumentsCard.tsx`, `Topbar.tsx`, `leave-badges.ts`, `next.config.ts`, `app/layout.tsx`, `proxy.ts`, `agent-quote/[token]/page.tsx`, `agent-quote/[token]/route.ts`, `error-log.ts`, `instrumentation.ts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Why does `Skeleton()` connect `Skeleton` to `dashboard-org/page.tsx`, `salesman/page.tsx`, `TaskCalendar.tsx`, `PageSkeleton`, `cached-queries.ts`, `list-params.ts`, `getSalesPalSession`, `tasks-list.ts`, `admin/clients/[id]/page.tsx`, `cn`, `ManagerDashboardSections.tsx`, `my-overview/page.tsx`, `getEnquiriesPage`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._