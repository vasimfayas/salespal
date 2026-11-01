# Graph Report - salespal  (2026-11-01)

## Corpus Check
- 456 files · ~268,970 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .ico 1)

## Summary
- 2481 nodes · 9374 edges · 108 communities (101 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 75 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `768aba54`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- manager-actions.ts
- CompaniesClient.tsx
- ManagerClientsList.tsx
- Modal
- isOwnerRole
- accountant/page.tsx
- admin-drilldown.ts
- formatAmount
- roles.ts
- clients/route.ts
- getTokenUserId
- Skeleton
- Input.tsx
- freight.ts
- ClientOverview
- buttonVariants
- TaskCalendar.tsx
- seed.ts
- prisma.ts
- enquiry-flow.ts
- AdminDashboardSections.tsx
- company.ts
- enquiry-agent.ts
- ShippingRateTable.tsx
- ManagerDashboardSections.tsx
- formatDate
- MonthlyTrendChart.tsx
- Changelog
- AgentsClient.tsx
- enquiryRef
- SalesPal Architecture
- dependencies
- approvals.ts
- package.json
- cn
- compilerOptions
- index.mjs
- types/auth.ts
- leave-actions.ts
- send-to-client/route.ts
- next-auth
- PageSkeleton
- ApprovalsView.tsx
- cached-queries.ts
- revalidateEnquiryPages
- CompanyReportForm.tsx
- email-queue.ts
- enquiries.ts
- admin/layout.tsx
- getSalesPalSession
- SendToAgentDialog.tsx
- manager/tasks/page.tsx
- ClientHistory.tsx
- enquiry.ts
- devDependencies
- clientStatusLabel
- company-report.ts
- my-overview/page.tsx
- scripts
- next
- react
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
- OrderList.tsx
- EnquiryForm.tsx
- postcss.config.mjs
- check-errors.sh
- Outlook mailbox integration — spec for Claude Code
- SalesmenTargetsClient.tsx
- EnquiriesClient.tsx
- company-documents.ts
- Sidebar.tsx
- Bug log
- enquiry-form/[token]/route.ts
- client-status-flow.ts
- client.ts
- AgentQuotes.tsx
- email-templates/route.ts
- error-log.ts
- enquiry-follow-ups.ts
- admin/clients/[id]/page.tsx
- EnquiryDetailSheet.tsx
- Input
- @prisma/client
- orders/[id]/page.tsx
- hasRole
- client-history.ts
- main
- client-documents.ts
- agent-quote/[token]/page.tsx
- salesman/clients/[id]/page.tsx
- ClientContactsCard.tsx
- BulkImportClientsModal
- admin/clients/page.tsx
- LocationsClient
- cleanup-tasks/route.ts
- manager/clients/page.tsx
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
- `3. Folder map` --references--> `useTasks()`  [INFERRED]
  docs/ARCHITECTURE.md → hooks/useTasks.ts
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

## Communities (108 total, 7 thin omitted)

### Community 0 - "manager-actions.ts"
Cohesion: 0.20
Nodes (18): DELETE(), POST(), POST(), ManagerTeamClient(), handleAddSubmit(), handleRemove(), saveCompanies(), createSalesmanAction() (+10 more)

### Community 1 - "CompaniesClient.tsx"
Cohesion: 0.15
Nodes (29): ClientCountRow, CompaniesClient(), ManagerSalesmanRow, User, CompanyAccountantsPanel(), initials(), KINDS, Person (+21 more)

### Community 2 - "ManagerClientsList.tsx"
Cohesion: 0.07
Nodes (50): Client, dropdownItemColors, ManagerClientsList(), handleAddSubmit(), ManagerClientsListProps, SalesmanItem, Client, ClientOverviewProps (+42 more)

### Community 3 - "Modal"
Cohesion: 0.13
Nodes (29): EMPTY, ROLE_TONE, roleName(), UserRow, UsersClient(), save(), CreditRequestPanel(), submit() (+21 more)

### Community 4 - "isOwnerRole"
Cohesion: 0.25
Nodes (14): GET(), runtime, GET(), POST(), runtime, select, PdfLogo, filterParams() (+6 more)

### Community 5 - "accountant/page.tsx"
Cohesion: 0.17
Nodes (23): AccountantEnquiriesPage(), AccountantOrdersPage(), AccountantOrdersSection(), OrdersListSkeleton(), AccountantDashboardPage(), dynamic, orderNo(), OperationsEnquiriesPage() (+15 more)

### Community 6 - "admin-drilldown.ts"
Cohesion: 0.15
Nodes (22): ClientLink(), copy, Kind, KINDS, OverviewDrilldownPage(), DrilldownPager(), clientsEntering(), countLostEnquiries() (+14 more)

### Community 7 - "formatAmount"
Cohesion: 0.14
Nodes (33): TaskForm(), DocumentDialog(), ContactDetailsDialog(), ContactForm(), ContactPromptTarget, DeleteClientButton(), availableActions(), ConfirmDialog() (+25 more)

### Community 8 - "roles.ts"
Cohesion: 0.17
Nodes (15): remove(), canManageRole(), createUser(), deleteUser(), parseUser(), Result, revalidateUsers(), updateUser() (+7 more)

### Community 9 - "clients/route.ts"
Cohesion: 0.22
Nodes (23): PATCH(), PATCH(), allowedOrgIdsFor(), GET(), POST(), handleStatusChange(), handleStatusChange(), cleanText() (+15 more)

### Community 10 - "getTokenUserId"
Cohesion: 0.26
Nodes (13): POST(), POST(), GET(), PATCH(), ACTIONS, POST(), updateOrderDetails(), orderPaymentsInclude (+5 more)

### Community 11 - "Skeleton"
Cohesion: 0.07
Nodes (32): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading() (+24 more)

### Community 12 - "Input.tsx"
Cohesion: 0.15
Nodes (20): KIND, LocationPicker(), choose(), EMPTY, KINDS, controlBase, controlHeight, errorClass (+12 more)

### Community 13 - "freight.ts"
Cohesion: 0.17
Nodes (21): CargoDimensionsField(), DIMENSIONS, isBlank(), Summary(), validLines(), CargoPackage, cargoTotals, CM_PER_UNIT (+13 more)

### Community 15 - "buttonVariants"
Cohesion: 0.12
Nodes (31): FollowUpsSection(), NotFound(), ClientPicker(), Option, ManagerTasksList(), ManagerTasksListProps, SalesmanItem, UnifiedTask (+23 more)

### Community 16 - "TaskCalendar.tsx"
Cohesion: 0.11
Nodes (36): GET(), addDays(), addMonths(), AddTaskDialog(), CalendarPerson, Chip(), DayPanel(), fmt() (+28 more)

### Community 17 - "seed.ts"
Cohesion: 0.09
Nodes (22): AIR_ORIGINS, CANCEL_REASONS, CLIENT_PREFIX, CLIENT_SECTOR, DESIGNATIONS, FIRST, FOLLOW_UP_COMMENTS, JOB_REFS_BY_MODE (+14 more)

### Community 18 - "prisma.ts"
Cohesion: 0.10
Nodes (24): labelMap, DELETE(), Params, PATCH(), GET(), POST(), GET(), runtime (+16 more)

### Community 19 - "enquiry-flow.ts"
Cohesion: 0.12
Nodes (25): ACTIONS, enquiryNeedsApproval(), toListItem(), ACTION_VERB, Actor, applyEnquiryAction(), applyOrderAction(), EnquiryAction (+17 more)

### Community 20 - "AdminDashboardSections.tsx"
Cohesion: 0.11
Nodes (37): dynamic, OwnerAccountsPage(), PERIOD_LABEL, PeriodKey, AdminDashboardPage(), PeriodKey, BottomSkeleton(), CardSkeleton() (+29 more)

### Community 21 - "company.ts"
Cohesion: 0.16
Nodes (21): Org, CompanyDocumentsPanel(), DocumentForm(), DocumentFormModal(), fileUrl(), ModalState, CompanyInfoCard(), docUrl() (+13 more)

### Community 22 - "enquiry-agent.ts"
Cohesion: 0.12
Nodes (21): PATCH(), Enquiries and quotes, AgentEnquiry, agentShipmentRows(), MODE, qty(), ENQUIRY_FIELD_LABELS, EnquiryDetails (+13 more)

### Community 23 - "ShippingRateTable.tsx"
Cohesion: 0.07
Nodes (52): AccountantShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), AdminShippingRatesPage(), ManagerShippingRatesPage(), ShippingRatesSection(), ShippingRatesSkeleton(), OperationsShippingRatesPage() (+44 more)

### Community 24 - "ManagerDashboardSections.tsx"
Cohesion: 0.12
Nodes (35): ManagerDashboardPage(), PeriodKey, PeriodSelector(), ACTION_ICON_MAP, AVATAR_COLORS, FunnelAndTasksSection(), getActionIcon(), getAvatarColor() (+27 more)

### Community 25 - "formatDate"
Cohesion: 0.19
Nodes (16): OrderDetail(), orderNo(), overdueClass(), PastDueTable(), flash(), remindSalesman(), ReminderActions(), reminderText() (+8 more)

### Community 26 - "MonthlyTrendChart.tsx"
Cohesion: 0.31
Nodes (6): COLORS, compactMoney, fullMoney, TrendPoint, TrendSeries, MonthlyTrendChartLazy

### Community 27 - "Changelog"
Cohesion: 0.05
Nodes (42): 1.0.0 - 2026-10-28, 1.1.0 - 2026-10-28, 1.1.1 - 2026-10-28, 1.1.2 - 2026-10-28, 1.2.0 - 2026-10-28, 1.3.0 - 2026-10-28, 1.4.0 - 2026-10-28, 1.4.1 - 2026-10-28 (+34 more)

### Community 28 - "AgentsClient.tsx"
Cohesion: 0.09
Nodes (28): AgentsPage(), AgentsPage(), AgentsPage(), AgentRow, AgentsClient(), exportAgents(), save(), EMPTY (+20 more)

### Community 29 - "enquiryRef"
Cohesion: 0.12
Nodes (41): GET(), runtime, submit(), CompanyReportPdf(), Cut(), Footer(), TARGET_STATE, Bar() (+33 more)

### Community 30 - "SalesPal Architecture"
Cohesion: 0.07
Nodes (26): 10. Environment variables, 11. Deployment and operations, 12. Known limits worth remembering, 1. Stack, 2. System overview, 3. Folder map, 4.1 Roles, 4.2 Sign-in (+18 more)

### Community 31 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, bullmq, class-variance-authority, clsx, fflate, @fontsource/inter, ioredis (+23 more)

### Community 32 - "approvals.ts"
Cohesion: 0.14
Nodes (24): ClientsListSection(), ClientsTableSkeleton(), SalesmanClientsPage(), 4.3 Scoping (who sees which rows), createCreditRequest(), CreditRequestInput, Result, applyOutcome() (+16 more)

### Community 33 - "package.json"
Cohesion: 0.06
Nodes (30): eslintConfig, name, prisma, seed, private, version, class-variance-authority, clsx (+22 more)

### Community 34 - "cn"
Cohesion: 0.11
Nodes (23): AuthLayout(), KpiCardProps, SmartAlertBanner(), getDueDateColor(), STATUS_PRIORITY, TaskItem, TaskOverview(), CompanyCheckboxes() (+15 more)

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
Cohesion: 0.16
Nodes (23): end(), load(), save(), saveExtend(), authorize(), coverCandidates(), endLeave(), extendLeave() (+15 more)

### Community 39 - "send-to-client/route.ts"
Cohesion: 0.38
Nodes (7): POST(), CLIENT_FORM_VALID_DAYS, clientFormPath(), clientFormUrl(), newClientFormToken(), sendClientFormEmail(), publicBaseUrl()

### Community 40 - "next-auth"
Cohesion: 0.09
Nodes (33): GET(), POST(), PATCH(), GET(), GET(), POST(), DELETE(), PATCH() (+25 more)

### Community 41 - "PageSkeleton"
Cohesion: 0.20
Nodes (11): Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), Loading(), HeaderSkeleton() (+3 more)

### Community 42 - "ApprovalsView.tsx"
Cohesion: 0.11
Nodes (36): BATCH_STATUS, ControlPanelPage(), DeploymentsTab(), ErrorsTab(), ImportsTab(), ApprovalCard(), CreditDetails(), EnquiryDetails() (+28 more)

### Community 43 - "cached-queries.ts"
Cohesion: 0.26
Nodes (14): GET(), CompaniesDashboardWrapper(), CompaniesPage(), CompaniesSkeleton(), ManagerOrderStatsSection(), getCachedAdminCompaniesPageAccountants, getCachedAdminCompaniesPageClientCounts, getCachedAdminCompaniesPageManagers (+6 more)

### Community 44 - "revalidateEnquiryPages"
Cohesion: 0.38
Nodes (9): Ctx, DELETE(), load(), PATCH(), POST(), revalidateEnquiryPages(), OPEN, parseQuoteOption() (+1 more)

### Community 45 - "CompanyReportForm.tsx"
Cohesion: 0.26
Nodes (11): Chip(), ChipGroup(), CompanyReportForm(), DeleteButton(), ExpiryNote(), FilterNote(), iso(), Job (+3 more)

### Community 46 - "email-queue.ts"
Cohesion: 0.16
Nodes (19): 9. Background work, caching and scheduled jobs, writeStoredFile(), parseFilters(), text(), emailLogo(), deliverEmailJob(), EMAIL_ATTEMPTS, EMAIL_QUEUE (+11 more)

### Community 47 - "enquiries.ts"
Cohesion: 0.08
Nodes (48): GET(), SalesmanDrilldownPage(), clientFilterWhere(), ClientListItem, ClientListRow, clientListSelect, clientStatusCounts(), getClientsPage() (+40 more)

### Community 48 - "admin/layout.tsx"
Cohesion: 0.42
Nodes (6): AdminLayout(), ManagerLayout(), SalesmanLayout(), MantineChartsProvider(), EnquiryFollowUpSync(), @mantine/core

### Community 49 - "getSalesPalSession"
Cohesion: 0.10
Nodes (33): handler, DELETE(), POST(), ApprovalsPage(), AccountantLayout(), ApprovalsPage(), EmailTemplatesPage(), AdminEnquiriesPage() (+25 more)

### Community 50 - "SendToAgentDialog.tsx"
Cohesion: 0.13
Nodes (22): EmailTemplateEditor(), EmailTemplatesClient(), SAMPLE, Saved, TemplateCard(), Agent, MailContext, SendToAgentDialog() (+14 more)

### Community 51 - "manager/tasks/page.tsx"
Cohesion: 0.39
Nodes (7): ManagerTasksPage(), ManagerTasksSection(), ManagerTasksSkeleton(), SalesmanTasksPage(), TasksListSection(), TasksListSkeleton(), getCoveredUserIds()

### Community 52 - "ClientHistory.tsx"
Cohesion: 0.13
Nodes (23): ClientHistory(), Empty(), RecordLink(), Route(), OrderStatusBadge(), TONES, iconTones, KpiTile() (+15 more)

### Community 53 - "enquiry.ts"
Cohesion: 0.11
Nodes (32): containerCounts(), measurement(), packingList(), parseEnquiryDetails(), unNumbers(), DEFAULT_WEIGHT_UNIT, round3(), ContainerCount (+24 more)

### Community 54 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss, tsx, @types/node (+4 more)

### Community 55 - "clientStatusLabel"
Cohesion: 0.12
Nodes (22): clientStatusDotClass(), ClientSwitcher(), go(), readRecent(), rememberClient(), Result, CompanyComparisonCard(), CompanyComparisonCardProps (+14 more)

### Community 56 - "company-report.ts"
Cohesion: 0.14
Nodes (25): POST(), PATCH(), GET(), POST(), placeCountry(), DEFAULT_PARTS, DETAIL_LIMIT, getCompanyReport() (+17 more)

### Community 57 - "my-overview/page.tsx"
Cohesion: 0.16
Nodes (20): GET(), CardsSkeleton(), change(), ManagerMyOverviewPage(), PerformanceCards(), TaskCards(), chip, StatCard() (+12 more)

### Community 58 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, dev, lint, prisma:generate, prisma:push, prisma:seed, seed:super-admin (+3 more)

### Community 60 - "react"
Cohesion: 0.20
Nodes (14): Error(), AgentQuoteForm(), ApprovalDecision(), decide(), EMPTY, Latest, AddTaskModal(), Button (+6 more)

### Community 61 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground your designs in the subject matter, More on writing in design, Process: plan, review against the brief, build, critique, Restraint and self-critique

### Community 62 - "buildEnquiryFormPdf"
Cohesion: 0.33
Nodes (10): buildEnquiryFormPdf(), checkbox(), checks(), ensure(), fieldRow(), fit(), section(), textField() (+2 more)

### Community 63 - "clients/[id]/documents/[docId]/route.ts"
Cohesion: 0.16
Nodes (24): DELETE(), GET(), load(), Params, PATCH(), Params, POST(), DELETE() (+16 more)

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
Cohesion: 0.17
Nodes (11): MonthlyOrderStat, OPEN_ORDER_STATUSES, OrderApprovalStatus, orderApprovalStatuses, OrderMode, OrderPaymentItem, orderPaymentMethods, OrderPaymentMode (+3 more)

### Community 69 - "bench.sh"
Cohesion: 0.83
Nodes (3): login(), run(), bench.sh script

### Community 70 - "salesman/page.tsx"
Cohesion: 0.11
Nodes (32): ChartSkeleton(), HeroSkeleton(), KpiCardsSection(), KpiCardsSkeleton(), MonthHeroSection(), MonthlyChartSection(), ORDER_MONTH_NAMES, OrderStatsSection() (+24 more)

### Community 71 - "OrderList.tsx"
Cohesion: 0.15
Nodes (19): OrderRole, OrderList(), flash(), openPayment(), submitPayment(), OrderListProps, orderNo(), OrderPayments() (+11 more)

### Community 73 - "EnquiryForm.tsx"
Cohesion: 0.11
Nodes (27): emptyPackageLine(), PackageLineInput, openEdit(), ChoiceChips(), ContainerChips(), emptyEnquiryForm(), EnquiryForm(), enquiryFormFrom() (+19 more)

### Community 76 - "Outlook mailbox integration — spec for Claude Code"
Cohesion: 0.10
Nodes (20): At the end of each phase, Context (read the code first), Flow, Goal, Lib, Microsoft Graph, Outlook mailbox integration — spec for Claude Code, Performance and long-term rules (+12 more)

### Community 77 - "SalesmenTargetsClient.tsx"
Cohesion: 0.19
Nodes (17): ManagerTeamClientProps, currentMonth(), period(), PERIOD_OPTIONS, periodDates(), periodLabel(), periodMonths(), ProgressBar() (+9 more)

### Community 78 - "EnquiriesClient.tsx"
Cohesion: 0.13
Nodes (24): ApprovalChip(), CHIP, packageLinesPayload(), submit(), AwaitingClient(), canEditEnquiry(), daysOpen(), DgBadge() (+16 more)

### Community 79 - "company-documents.ts"
Cohesion: 0.17
Nodes (19): DELETE(), findDocument(), GET(), Params, PATCH(), revalidateCompanies(), GET(), safeName() (+11 more)

### Community 80 - "Sidebar.tsx"
Cohesion: 0.06
Nodes (55): LoginForm(), LoginPage(), DashboardLayout(), DashboardIndex(), AppShell(), LogoutOverlay(), CommandPalette(), CoverBanner() (+47 more)

### Community 81 - "Bug log"
Cohesion: 0.33
Nodes (5): 2026-10-28: A user with history can't be deleted, and clients can't be left unassigned, 2026-10-28: Company Staff count overcounted (1.0.0, `3e4186a`), Bug log, Fixed, Open

### Community 82 - "enquiry-form/[token]/route.ts"
Cohesion: 0.26
Nodes (11): POST(), POST(), POST(), POST(), agentLinkExpired(), clientFormExpired(), enquiryDetailsData(), allowAttempt() (+3 more)

### Community 83 - "client-status-flow.ts"
Cohesion: 0.13
Nodes (19): GET(), POST(), POST(), BLACKLISTED_ERROR, revalidateClientViews(), statusAfterEnquiry(), statusAfterOrder(), StatusSource (+11 more)

### Community 84 - "client.ts"
Cohesion: 0.15
Nodes (15): DialogState, ClientStatusDropdown(), CLIENT_DOC_TYPES, clientCategories, ClientCategory, clientCategoryLabels, ClientDocType, ClientDocumentItem (+7 more)

### Community 85 - "AgentQuotes.tsx"
Cohesion: 0.23
Nodes (18): AgentQuotes(), remove(), saveDraft(), use(), Draft, Option, sameLines(), send() (+10 more)

### Community 86 - "email-templates/route.ts"
Cohesion: 0.17
Nodes (18): DELETE(), GET(), PUT(), POST(), POST(), SENDABLE, GET(), POST() (+10 more)

### Community 87 - "error-log.ts"
Cohesion: 0.24
Nodes (6): onRequestError(), register(), cut(), ERROR_KEEP_DAYS, Input, logError()

### Community 88 - "enquiry-follow-ups.ts"
Cohesion: 0.17
Nodes (17): POST(), POST(), FOLLOW_UP_CATEGORIES, POST(), sweepDormantClients(), dueForFollowUp(), ensureEnquiryFollowUpTasks(), extendFollowUpTasks() (+9 more)

### Community 89 - "admin/clients/[id]/page.tsx"
Cohesion: 0.25
Nodes (14): AdminClientDetailPage(), ClientDetailContent(), HistorySection(), SearchParams, ClientDetailContent(), HistorySection(), ManagerClientDetailPage(), SearchParams (+6 more)

### Community 90 - "EnquiryDetailSheet.tsx"
Cohesion: 0.18
Nodes (16): CargoSection(), EnquiryDetailSheet(), EVENT_TEXT, Field(), figures(), History(), QUOTED_NOTES, Section() (+8 more)

### Community 91 - "Input"
Cohesion: 0.19
Nodes (8): ClientEnquiryForm(), CopyLinkButton(), Result, SendToClientDialog(), SignaturePad(), Input(), EmailState, useEmailJobs()

### Community 92 - "@prisma/client"
Cohesion: 0.18
Nodes (11): CACHE, Counts, getAdminKpiCounts, getAdminTaskHealth, statusCounts(), OwnerAccountsRow, notTodo, TODO_CATEGORY (+3 more)

### Community 93 - "orders/[id]/page.tsx"
Cohesion: 0.60
Nodes (4): OrderDetailLoading(), OrderDetailContent(), OrderDetailPage(), getOrderById

### Community 94 - "hasRole"
Cohesion: 0.23
Nodes (12): DELETE(), Params, PATCH(), GET(), POST(), GET(), POST(), DELETE() (+4 more)

### Community 95 - "client-history.ts"
Cohesion: 0.21
Nodes (13): CLIENT_HISTORY_PAGE_SIZE, ClientEnquiryRow, ClientHistory, ClientOrderRow, ClientSummary, getClientEnquiriesPage(), getClientHistory(), getClientOrdersPage() (+5 more)

### Community 96 - "main"
Cohesion: 0.22
Nodes (14): between(), chance(), dateOnly(), daysAgo(), inChunks(), int(), log(), lostReasonFields() (+6 more)

### Community 97 - "client-documents.ts"
Cohesion: 0.29
Nodes (10): DELETE(), load(), Params, PATCH(), POST(), GET(), parseContact(), documentClientIds() (+2 more)

### Community 98 - "agent-quote/[token]/page.tsx"
Cohesion: 0.29
Nodes (10): AgentQuotePage(), metadata, Notice(), ClientEnquiryFormPage(), metadata, Notice(), CompanyLogo(), agentEnquirySelect (+2 more)

### Community 99 - "salesman/clients/[id]/page.tsx"
Cohesion: 0.27
Nodes (10): ClientDetailContent(), ClientDetailPage(), HistorySection(), SearchParams, ClientDocumentsCard(), remove(), submit(), fileUrl() (+2 more)

### Community 100 - "ClientContactsCard.tsx"
Cohesion: 0.24
Nodes (6): blank(), ClientContactsCard(), ContactRow(), EMPTY, Main, ClientContactItem

### Community 101 - "BulkImportClientsModal"
Cohesion: 0.43
Nodes (7): handleReset(), BulkImportClientsModal(), close(), handleFile(), reset(), resolveSalesman(), runImport()

### Community 102 - "admin/clients/page.tsx"
Cohesion: 0.60
Nodes (5): AdminClientsPage(), ClientsTableSkeleton(), ClientTableContainer(), getCachedAdminManagersList, getCachedAdminRelationsList

### Community 103 - "LocationsClient"
Cohesion: 0.53
Nodes (5): LocationsClient(), changed(), remove(), save(), resetLocations()

### Community 104 - "cleanup-tasks/route.ts"
Cohesion: 0.50
Nodes (3): POST(), APPROVAL_KEEP_MONTHS, REPORT_KEEP_DAYS

### Community 105 - "manager/clients/page.tsx"
Cohesion: 0.83
Nodes (3): ClientsTableSkeleton(), ManagerClientsPage(), ManagerClientsSection()

### Community 107 - "overrides"
Cohesion: 0.67
Nodes (3): nodemailer, overrides, next-auth

## Knowledge Gaps
- **15 isolated node(s):** `RFC-4180`, `@fontsource/inter`, `@mantine/hooks`, `@radix-ui/react-avatar`, `@radix-ui/react-tabs` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 592 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `manager-actions.ts`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Modal`, `accountant/page.tsx`, `formatAmount`, `Skeleton`, `Input.tsx`, `freight.ts`, `ClientOverview`, `buttonVariants`, `TaskCalendar.tsx`, `AdminDashboardSections.tsx`, `company.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatDate`, `AgentsClient.tsx`, `PageSkeleton`, `ApprovalsView.tsx`, `CompanyReportForm.tsx`, `getSalesPalSession`, `SendToAgentDialog.tsx`, `ClientHistory.tsx`, `clientStatusLabel`, `my-overview/page.tsx`, `react`, `salesman/page.tsx`, `OrderList.tsx`, `EnquiryForm.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `client.ts`, `AgentQuotes.tsx`, `EnquiryDetailSheet.tsx`, `Input`, `agent-quote/[token]/page.tsx`, `salesman/clients/[id]/page.tsx`, `BulkImportClientsModal`, `LocationsClient`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getSalesPalSession()` (e.g. with `2. System overview` and `7. API routes (`app/api`)`) actually correct?**
  _`getSalesPalSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-4180`, `@fontsource/inter`, `@mantine/hooks` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CompaniesClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14583333333333334 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `manager-actions.ts`, `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Modal`, `isOwnerRole`, `admin-drilldown.ts`, `formatAmount`, `roles.ts`, `clients/route.ts`, `getTokenUserId`, `Input.tsx`, `buttonVariants`, `TaskCalendar.tsx`, `prisma.ts`, `enquiry-flow.ts`, `AdminDashboardSections.tsx`, `company.ts`, `enquiry-agent.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatDate`, `MonthlyTrendChart.tsx`, `AgentsClient.tsx`, `enquiryRef`, `approvals.ts`, `package.json`, `leave-actions.ts`, `send-to-client/route.ts`, `next-auth`, `ApprovalsView.tsx`, `cached-queries.ts`, `revalidateEnquiryPages`, `enquiries.ts`, `admin/layout.tsx`, `getSalesPalSession`, `SendToAgentDialog.tsx`, `ClientHistory.tsx`, `clientStatusLabel`, `company-report.ts`, `my-overview/page.tsx`, `react`, `clients/[id]/documents/[docId]/route.ts`, `app/layout.tsx`, `salesman/page.tsx`, `OrderList.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `company-documents.ts`, `Sidebar.tsx`, `enquiry-form/[token]/route.ts`, `client-status-flow.ts`, `client.ts`, `email-templates/route.ts`, `error-log.ts`, `enquiry-follow-ups.ts`, `admin/clients/[id]/page.tsx`, `EnquiryDetailSheet.tsx`, `@prisma/client`, `orders/[id]/page.tsx`, `hasRole`, `client-documents.ts`, `agent-quote/[token]/page.tsx`, `salesman/clients/[id]/page.tsx`, `ClientContactsCard.tsx`, `cleanup-tasks/route.ts`, `next.config.ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `ManagerClientsList.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07077625570776255 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `CompaniesClient.tsx`, `ManagerClientsList.tsx`, `Modal`, `accountant/page.tsx`, `formatAmount`, `Skeleton`, `Input.tsx`, `buttonVariants`, `TaskCalendar.tsx`, `prisma.ts`, `AdminDashboardSections.tsx`, `company.ts`, `ShippingRateTable.tsx`, `ManagerDashboardSections.tsx`, `formatDate`, `AgentsClient.tsx`, `SalesPal Architecture`, `approvals.ts`, `package.json`, `cn`, `index.mjs`, `next-auth`, `ApprovalsView.tsx`, `cached-queries.ts`, `CompanyReportForm.tsx`, `admin/layout.tsx`, `getSalesPalSession`, `SendToAgentDialog.tsx`, `manager/tasks/page.tsx`, `clientStatusLabel`, `my-overview/page.tsx`, `salesman/page.tsx`, `OrderList.tsx`, `EnquiryForm.tsx`, `SalesmenTargetsClient.tsx`, `EnquiriesClient.tsx`, `Sidebar.tsx`, `client.ts`, `AgentQuotes.tsx`, `admin/clients/[id]/page.tsx`, `Input`, `orders/[id]/page.tsx`, `salesman/clients/[id]/page.tsx`, `ClientContactsCard.tsx`, `admin/clients/page.tsx`, `manager/clients/page.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._