# Graph Report - salespal  (2026-11-04)

## Corpus Check
- 470 files · ~277,819 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2552 nodes · 9682 edges · 105 communities (99 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3d6a7d63`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ApprovalsView.tsx
- SendToAgentDialog.tsx
- ManagerClientsList.tsx
- PageSkeleton
- team-assignments.ts
- TaskCalendar.tsx
- [kind]/page.tsx
- task-outcomes.ts
- ClientOverview.tsx
- clients/[id]/route.ts
- ClientDocumentsCard.tsx
- Skeleton
- ManagerTeamClient.tsx
- freight.ts
- getSalesPalSession
- buttonVariants
- 1.10.0 - 2026-11-01
- seed.ts
- 1.8.0 - 2026-10-29
- enquiry-flow.ts
- AdminDashboardSections.tsx
- company.ts
- utils.ts
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- next
- cn
- Changelog
- Button
- CompanyReportPdf.tsx
- 1.9.0 - 2026-10-31
- dependencies
- EnquiryForm
- package.json
- AgentsClient.tsx
- compilerOptions
- index.mjs
- 1.0.0 - 2026-10-28
- LeaveButton.tsx
- 1.2.0 - 2026-10-28
- clients/route.ts
- 1.7.0 - 2026-10-29
- AgentQuotes.tsx
- proxy.ts
- bcryptjs
- CompaniesClient.tsx
- email-queue.ts
- enquiryRef
- admin/layout.tsx
- enquiry-follow-ups.ts
- lead-tasks.ts
- accountant/page.tsx
- cached-queries.ts
- enquiry.ts
- devDependencies
- 1.4.0 - 2026-10-28
- parseEnquiryDetails
- order.ts
- scripts
- app/layout.tsx
- accountant/shipping-rates/page.tsx
- Frontend Design
- buildEnquiryFormPdf
- 1.5.0 - 2026-10-29
- README.md
- SalesPal UI Rules
- 1.6.0 - 2026-10-29
- enquiries.ts
- AGENTS.md
- bench.sh
- salesman/page.tsx
- BulkImportClientsModal.tsx
- company-report.ts
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- isOwnerRole
- Sidebar.tsx
- Bug log
- CompanyReportForm.tsx
- UsersClient.tsx
- dashboard-org/page.tsx
- 1.11.0 - 2026-11-02
- SalesPal Architecture
- salesman-report.ts
- enquiry-agent.ts
- companies/page.tsx
- client-status-flow.ts
- report-pdf.tsx
- react
- [userId]/route.ts
- EnquiryFollowUpModals.tsx
- formatAmount
- orders/[id]/page.tsx
- accounts/page.tsx
- TaskCard.tsx
- next.config.ts
- overrides
- LoginForm.tsx
- 1.12.0 - 2026-11-04
- 5.4 Tables and columns
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

## Communities (105 total, 6 thin omitted)

### Community 0 - "ApprovalsView.tsx"
Cohesion: 0.09
Nodes (42): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalCard(), CreditDetails(), EnquiryDetails() (+34 more)

### Community 1 - "SendToAgentDialog.tsx"
Cohesion: 0.11
Nodes (22): KIND, LocationPicker(), Agent, MailContext, SendToAgentDialog(), review(), submit(), Sent (+14 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.07
Nodes (51): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, dropdownItemColors (+43 more)

### Community 3 - "PageSkeleton"
Cohesion: 0.18
Nodes (9): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), KpiSkeleton() (+1 more)

### Community 4 - "team-assignments.ts"
Cohesion: 0.29
Nodes (11): DELETE(), POST(), POST(), unassignSalesmanFromManager(), assignSalesmanToCompany(), managerOrgIds(), revalidateTeamViews(), setSalesmanCompanies() (+3 more)

### Community 5 - "TaskCalendar.tsx"
Cohesion: 0.11
Nodes (36): GET(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt() (+28 more)

### Community 6 - "[kind]/page.tsx"
Cohesion: 0.12
Nodes (29): CompanyOverviewPage(), SOURCE_LABELS, ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), Ctx (+21 more)

### Community 7 - "task-outcomes.ts"
Cohesion: 0.21
Nodes (10): CONTACT_FIELD_LABELS, ContactFields, contactRequiredMessage(), NO_CONTACT_NEEDED, applyLeadOutcome(), MOVES_FROM, OUTCOME_STATUS, OutcomeError (+2 more)

### Community 8 - "ClientOverview.tsx"
Cohesion: 0.11
Nodes (17): Client, ClientOverview(), ClientOverviewProps, ClientTask, STATUS_SELECT_COLORS, TaskSelect(), taskStatuses, PremiumToggle() (+9 more)

### Community 9 - "clients/[id]/route.ts"
Cohesion: 0.24
Nodes (18): DELETE(), GET(), PATCH(), PATCH(), POST(), handleStatusChange(), handleStatusChange(), cleanText() (+10 more)

### Community 10 - "ClientDocumentsCard.tsx"
Cohesion: 0.11
Nodes (38): TaskForm(), remove(), DialogState, DocumentDialog(), submit(), fileUrl(), ContactForm(), DeleteClientButton() (+30 more)

### Community 11 - "Skeleton"
Cohesion: 0.07
Nodes (30): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+22 more)

### Community 12 - "ManagerTeamClient.tsx"
Cohesion: 0.20
Nodes (15): ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies(), ManagerTeamClientProps, LeaveBadge, 4.1 Roles, 4.2 Sign-in (+7 more)

### Community 13 - "freight.ts"
Cohesion: 0.12
Nodes (30): CargoDimensionsField(), DIMENSIONS, emptyPackageLine(), isBlank(), Summary(), validLines(), openEdit(), CargoSection() (+22 more)

### Community 14 - "getSalesPalSession"
Cohesion: 0.05
Nodes (94): handler, ApprovalsPage(), AccountantLayout(), ApprovalsPage(), AdminEnquiriesPage(), LocationsPage(), AdminMyClientsPage(), MyClientsSection() (+86 more)

### Community 15 - "buttonVariants"
Cohesion: 0.09
Nodes (42): FollowUpsSection(), NotFound(), ClientPicker(), Option, ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask (+34 more)

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
Cohesion: 0.15
Nodes (22): ACTION_VERB, Actor, applyEnquiryAction(), applyOrderAction(), EnquiryAction, FlowError, FROM, logEvent() (+14 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.13
Nodes (36): AdminDashboardPage(), CardSkeleton(), CardSmallSkeleton(), CompanyHeroSection(), DeltaBadge(), getTimeAgo(), HeroSkeleton(), KpiCardsRow() (+28 more)

### Community 21 - "company.ts"
Cohesion: 0.10
Nodes (29): Org, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard(), docUrl() (+21 more)

### Community 22 - "utils.ts"
Cohesion: 0.10
Nodes (42): OrderDetail(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+34 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.09
Nodes (40): ClientStatusDropdown(), Badge(), BadgeProps, BadgeVariant, VARIANT_CLASS, BADGE_MAP, MODE_ICON, RateCard() (+32 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.10
Nodes (38): GET(), ManagerDashboardPage(), PeriodKey, PeriodSelector(), OrderStatsSection(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection() (+30 more)

### Community 25 - "next"
Cohesion: 0.06
Nodes (69): DELETE(), Params, PATCH(), GET(), POST(), POST(), labelMap, DELETE() (+61 more)

### Community 26 - "cn"
Cohesion: 0.08
Nodes (32): AuthLayout(), Action(), Contact, Option, options(), SmartAlertBanner(), getDueDateColor(), STATUS_PRIORITY (+24 more)

### Community 27 - "Changelog"
Cohesion: 0.14
Nodes (13): 1.10.1 - 2026-11-02, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.1 - 2026-10-28, Added, Added (+5 more)

### Community 28 - "Button"
Cohesion: 0.09
Nodes (35): BulkImportAgentsModal(), handleFile(), EXAMPLE, split(), CreditRequestPanel(), submit(), blank(), ClientContactsCard() (+27 more)

### Community 29 - "CompanyReportPdf.tsx"
Cohesion: 0.20
Nodes (28): submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar(), C, Col (+20 more)

### Community 30 - "1.9.0 - 2026-10-31"
Cohesion: 0.40
Nodes (5): 1.9.0 - 2026-10-31, Added, Changed, Deploy note, Fixed

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "EnquiryForm"
Cohesion: 0.22
Nodes (12): packageLinesPayload(), ClientEnquiryForm(), submit(), ChoiceChips(), ContainerChips(), emptyEnquiryForm(), EnquiryForm(), GroupLabel() (+4 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (30): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+22 more)

### Community 34 - "AgentsClient.tsx"
Cohesion: 0.13
Nodes (17): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), exportAgents(), save(), EMPTY (+9 more)

### Community 35 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 36 - "index.mjs"
Cohesion: 0.12
Nodes (26): Bar(), buildCompanyReportPdf(), CompanyReportPdf(), deliverEmailJob(), emailLogo(), enquiryRef(), Footer(), getCompanyReport() (+18 more)

### Community 37 - "1.0.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.0.0 - 2026-10-28, Added, Changed, Fixed

### Community 38 - "LeaveButton.tsx"
Cohesion: 0.16
Nodes (26): LeaveButton(), end(), load(), save(), saveExtend(), show(), today(), authorize() (+18 more)

### Community 39 - "1.2.0 - 2026-10-28"
Cohesion: 0.50
Nodes (4): 1.2.0 - 2026-10-28, Added, Changed, Fixed

### Community 40 - "clients/route.ts"
Cohesion: 0.12
Nodes (32): GET(), PATCH(), GET(), DELETE(), PATCH(), allowedOrgIdsFor(), GET(), 4.3 Scoping (who sees which rows) (+24 more)

### Community 41 - "1.7.0 - 2026-10-29"
Cohesion: 0.50
Nodes (4): 1.7.0 - 2026-10-29, Added, Changed, Deploy note

### Community 42 - "AgentQuotes.tsx"
Cohesion: 0.22
Nodes (19): AgentOption, AgentQuotes(), remove(), saveDraft(), use(), Draft, Option, sameLines() (+11 more)

### Community 44 - "bcryptjs"
Cohesion: 0.40
Nodes (3): prisma, ROLES, bcryptjs

### Community 45 - "CompaniesClient.tsx"
Cohesion: 0.15
Nodes (28): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, CompanyAccountantsPanel(), initials(), KINDS, Person (+20 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.14
Nodes (19): writeStoredFile(), parseFilters(), emailLogo(), TYPES, deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE, EmailJobStatus (+11 more)

### Community 47 - "enquiryRef"
Cohesion: 0.20
Nodes (13): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientOrdersPage(), getClientSummary() (+5 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.40
Nodes (7): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/charts, @mantine/core

### Community 49 - "enquiry-follow-ups.ts"
Cohesion: 0.21
Nodes (11): closeFollowUpTasks(), dueForFollowUp(), ensureEnquiryFollowUpTasks(), FOLLOW_UP_AFTER_DAYS, nextFollowUpDate(), OPEN_FOLLOW_UP_TASK, OPEN_TASK, TASK_KIND (+3 more)

### Community 50 - "lead-tasks.ts"
Cohesion: 0.22
Nodes (9): createLeadTasks(), Db, describe(), LEAD_PIPELINE, LEAD_TASK_DAYS, LeadClient, leadClientSelect, LEAD_TASK_CATEGORY (+1 more)

### Community 51 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (22): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), AccountantCompanyChips() (+14 more)

### Community 52 - "cached-queries.ts"
Cohesion: 0.15
Nodes (30): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), ClientDetailContent() (+22 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.10
Nodes (38): PackageLineInput, EnquiryFormState, JOB_REF_GROUPS, MODE_LABEL, MODES, PAYMENT_LABEL, ENQUIRY_FIELD_LABELS, EnquiryDetails (+30 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "1.4.0 - 2026-10-28"
Cohesion: 0.67
Nodes (3): 1.4.0 - 2026-10-28, Added, Deploy note

### Community 56 - "parseEnquiryDetails"
Cohesion: 0.13
Nodes (20): ReeferTemps(), resizeTemps(), Enquiries and quotes, containerCounts(), measurement(), packingList(), parseEnquiryDetails(), unNumbers() (+12 more)

### Community 57 - "order.ts"
Cohesion: 0.17
Nodes (11): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, OrderPaymentItem, orderPaymentMethods, OrderPaymentMode (+3 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 59 - "app/layout.tsx"
Cohesion: 0.26
Nodes (8): appFont, metadata, RootLayout(), viewport, Providers(), Toaster(), TooltipProvider, next-themes

### Community 60 - "accountant/shipping-rates/page.tsx"
Cohesion: 0.28
Nodes (12): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+4 more)

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
Cohesion: 0.08
Nodes (55): DELETE(), GET(), PUT(), POST(), POST(), Ctx, DELETE(), load() (+47 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.08
Nodes (56): CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), SalesmanDrilldownPage(), ChartSkeleton(), HeroSkeleton() (+48 more)

### Community 71 - "BulkImportClientsModal.tsx"
Cohesion: 0.18
Nodes (13): handleReset(), BulkImportClientsModal(), close(), handleFile(), reset(), resolveSalesman(), runImport(), REQUIRED (+5 more)

### Community 73 - "company-report.ts"
Cohesion: 0.15
Nodes (17): GET(), CompanyReport, DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport(), n(), Num, placesIn() (+9 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.21
Nodes (15): currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths(), ProgressBar(), SalesmenTargetsClient() (+7 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.09
Nodes (42): PremiumBadge(), ApprovalChip(), CHIP, DetailsPendingChip(), CopyRefButton(), AwaitingClient(), canEditEnquiry(), CompanyTag() (+34 more)

### Community 79 - "isOwnerRole"
Cohesion: 0.10
Nodes (47): DELETE(), GET(), load(), Params, PATCH(), GET(), Params, POST() (+39 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.07
Nodes (52): DashboardLayout(), AppShell(), LogoutOverlay(), CommandPalette(), CoverBanner(), DashboardContentWrapper(), getBreadcrumbs(), getNavGroups() (+44 more)

### Community 81 - "Bug log"
Cohesion: 0.29
Nodes (6): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), 2026-11-03: A client can't be linked to more than one company (postponed), Bug log, Fixed, Open

### Community 82 - "CompanyReportForm.tsx"
Cohesion: 0.23
Nodes (12): Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso(), Job (+4 more)

### Community 83 - "UsersClient.tsx"
Cohesion: 0.19
Nodes (18): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), remove(), save(), canManageRole() (+10 more)

### Community 84 - "dashboard-org/page.tsx"
Cohesion: 0.52
Nodes (6): CompanySection(), CompanySkeleton(), SalesmanDashboardOrgPage(), ShippingRatesSection(), ShippingRatesSkeleton(), getCompanyProfiles()

### Community 85 - "1.11.0 - 2026-11-02"
Cohesion: 0.67
Nodes (3): 1.11.0 - 2026-11-02, Added, Changed

### Community 86 - "SalesPal Architecture"
Cohesion: 0.11
Nodes (16): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 6. Pages (App Router), 7. API routes (`app/api`) (+8 more)

### Community 87 - "salesman-report.ts"
Cohesion: 0.24
Nodes (12): GET(), clientStatusCounts(), currentMonthKey(), getSalesmanMonthlyReport(), MonthKey, n(), Num, parseMonth() (+4 more)

### Community 88 - "enquiry-agent.ts"
Cohesion: 0.06
Nodes (49): AgentQuotePage(), metadata, Notice(), POST(), POST(), POST(), ClientEnquiryFormPage(), metadata (+41 more)

### Community 90 - "companies/page.tsx"
Cohesion: 0.38
Nodes (9): CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers, getCachedAdminCompaniesPageOrgs, getCachedAdminCompaniesPageRelations (+1 more)

### Community 91 - "client-status-flow.ts"
Cohesion: 0.24
Nodes (8): BLACKLISTED_ERROR, canSetStatus(), statusAfterOrder(), statusChangeError(), StatusSource, Tx, DORMANT_AFTER_DAYS, MANAGER_ONLY_STATUSES

### Community 92 - "report-pdf.tsx"
Cohesion: 0.25
Nodes (12): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+4 more)

### Community 94 - "react"
Cohesion: 0.18
Nodes (14): Error(), ApprovalDecision(), decide(), ButtonProps, controlBase, controlHeight, errorClass, hintClass (+6 more)

### Community 95 - "[userId]/route.ts"
Cohesion: 0.24
Nodes (9): GET(), calculateKpiScore(), calculateKpiScoreProgress(), getKpiScoreBreakdown(), groupStatusCounts(), KPI_MAX_POINTS_PER_CLIENT, KPI_WEIGHTS, KpiBreakdownItem (+1 more)

### Community 96 - "EnquiryFollowUpModals.tsx"
Cohesion: 0.48
Nodes (6): FollowUpForm(), submit(), FollowUpModal(), formatDateTime(), ModalHeader(), postJson()

### Community 97 - "formatAmount"
Cohesion: 0.21
Nodes (11): clientStatusDot, CompanyComparisonCard(), CompanyComparisonCardProps, ComparisonStatus, getInitials(), KpiTile(), PIPELINE_STAGE_COLORS, STATUS_THEME (+3 more)

### Community 98 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 99 - "accounts/page.tsx"
Cohesion: 0.14
Nodes (15): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, COLORS, compactMoney, fullMoney, TrendPoint (+7 more)

### Community 101 - "TaskCard.tsx"
Cohesion: 0.43
Nodes (5): getDueDateColor(), Task, TaskCard(), Task, TaskList()

### Community 103 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

### Community 105 - "LoginForm.tsx"
Cohesion: 0.25
Nodes (6): LoginForm(), LoginPage(), DashboardIndex(), navConfig, NavLink, roleHome

### Community 107 - "1.12.0 - 2026-11-04"
Cohesion: 0.67
Nodes (3): 1.12.0 - 2026-11-04, Added, Changed

### Community 111 - "5.4 Tables and columns"
Cohesion: 0.13
Nodes (13): 5.1 Connection, 5.2 Entity relationship diagram, 5.3 Schema management, 5.4 Tables and columns, 5.5 Status flows (summary), 5. Database, Clients, Orders and money (+5 more)

### Community 116 - "LocationsClient"
Cohesion: 0.53
Nodes (5): LocationsClient(), changed(), remove(), save(), resetLocations()

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 616 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ApprovalsView.tsx`, `ManagerClientsList.tsx`, `team-assignments.ts`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `ClientOverview.tsx`, `clients/[id]/route.ts`, `ClientDocumentsCard.tsx`, `ManagerTeamClient.tsx`, `getSalesPalSession`, `buttonVariants`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `company.ts`, `utils.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `cn`, `Button`, `package.json`, `AgentsClient.tsx`, `LeaveButton.tsx`, `clients/route.ts`, `proxy.ts`, `CompaniesClient.tsx`, `admin/layout.tsx`, `enquiry-follow-ups.ts`, `cached-queries.ts`, `app/layout.tsx`, `enquiries.ts`, `salesman/page.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `isOwnerRole`, `Sidebar.tsx`, `UsersClient.tsx`, `enquiry-agent.ts`, `companies/page.tsx`, `client-status-flow.ts`, `report-pdf.tsx`, `react`, `[userId]/route.ts`, `formatAmount`, `orders/[id]/page.tsx`, `accounts/page.tsx`, `next.config.ts`, `LoginForm.tsx`, `5.4 Tables and columns`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ApprovalsView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `ApprovalsView.tsx`, `SendToAgentDialog.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `ClientOverview.tsx`, `ClientDocumentsCard.tsx`, `Skeleton`, `ManagerTeamClient.tsx`, `freight.ts`, `getSalesPalSession`, `buttonVariants`, `AdminDashboardSections.tsx`, `company.ts`, `utils.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `Button`, `EnquiryForm`, `AgentsClient.tsx`, `LeaveButton.tsx`, `AgentQuotes.tsx`, `CompaniesClient.tsx`, `accountant/page.tsx`, `cached-queries.ts`, `enquiry.ts`, `salesman/page.tsx`, `BulkImportClientsModal.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `CompanyReportForm.tsx`, `UsersClient.tsx`, `enquiry-agent.ts`, `react`, `formatAmount`, `accounts/page.tsx`, `LoginForm.tsx`, `LocationsClient`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Should `SendToAgentDialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ApprovalsView.tsx`, `SendToAgentDialog.tsx`, `ManagerClientsList.tsx`, `TaskCalendar.tsx`, `[kind]/page.tsx`, `ClientOverview.tsx`, `ClientDocumentsCard.tsx`, `ManagerTeamClient.tsx`, `getSalesPalSession`, `buttonVariants`, `AdminDashboardSections.tsx`, `company.ts`, `utils.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `cn`, `Button`, `EnquiryForm`, `package.json`, `AgentsClient.tsx`, `index.mjs`, `LeaveButton.tsx`, `AgentQuotes.tsx`, `CompaniesClient.tsx`, `admin/layout.tsx`, `accountant/page.tsx`, `cached-queries.ts`, `enquiry.ts`, `accountant/shipping-rates/page.tsx`, `salesman/page.tsx`, `BulkImportClientsModal.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `CompanyReportForm.tsx`, `UsersClient.tsx`, `dashboard-org/page.tsx`, `SalesPal Architecture`, `enquiry-agent.ts`, `companies/page.tsx`, `EnquiryFollowUpModals.tsx`, `orders/[id]/page.tsx`, `LoginForm.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._