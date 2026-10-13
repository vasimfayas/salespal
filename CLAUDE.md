# SalesPal UI Rules

SalesPal is an existing Next.js logistics management application.

The backend and business workflows are already implemented and working.

When working on UI:

DO:

- Improve UI/UX
- Create reusable components
- Improve responsive design
- Improve accessibility
- Improve typography
- Improve spacing
- Improve visual hierarchy
- Improve loading/empty/error states
- Refactor duplicated presentation code

DO NOT:

- Modify API endpoints
- Modify API payloads
- Modify database schema
- Modify Prisma
- Modify authentication
- Modify authorization
- Modify business logic
- Modify calculations
- Modify workflow logic
- Modify existing data structures
- Modify backend services

If a UI improvement appears to require changing business logic,
STOP and explain why before making that change.

Preserve existing functionality exactly.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
