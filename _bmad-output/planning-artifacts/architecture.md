---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-02-27'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/product-brief-training-bmad-method-todolist-2026-02-23.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/prd-validation-report-2026-02-24.md'
  - '_bmad-output/planning-artifacts/research/market-application-de-gestion-de-taches-pour-freelancers-occupes-research-2026-02-19.md'
workflowType: 'architecture'
project_name: 'training-bmad-method-todolist'
user_name: 'Jean-Paul'
date: '2026-02-27'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
54 functional requirements across 11 categories covering authentication (FR1–FR4), workspace & subject management (FR5–FR10), task CRUD (FR11–FR14), automatic re-prioritization engine (FR15–FR18), manual override protection (FR19–FR22, FR52–FR53), task split with filiation (FR23–FR27), task state lifecycle (FR28–FR35), activity log & traceability (FR36–FR39), dashboard & planning views (FR40–FR45, FR54), PWA & offline (FR46–FR49), and analytics instrumentation (FR50–FR51).

The re-prioritization engine is the architectural centerpiece — it must recalculate all active task positions on every mutation event while respecting manually pinned overrides, completing within 2 seconds for 50+ active tasks.

Task split with filiation introduces a parent-child data model where each sub-task is fully independent (own priority, deadline, subject) yet maintains a traceable lineage to its parent.

**Non-Functional Requirements:**
26 NFRs organized into performance (7), security (7), scalability (3), reliability (5), and accessibility (4).

Architecture-critical NFRs:
- NFR1: Re-prioritization < 2s for 50+ active tasks
- NFR6: API response < 300ms p95 for CRUD
- NFR8: Workspace-level tenant isolation — no cross-user data leakage
- NFR15: Support 10x growth (20,000 users) without architectural changes
- NFR17: Stateless backend for horizontal scaling
- NFR19: Zero data loss — atomic persistence for all state transitions
- NFR21: Graceful degradation — dashboard renders with last known order if engine is slow

**UX Architectural Implications:**
- Design system: MUI (React) — implies React as frontend framework
- Time-based Kanban board (columns = days) as primary view — custom composite component
- Drag & drop with pin/override visual system — requires dedicated DnD library
- Card repositioning animations < 150ms — client-side optimistic updates required
- Light + dark theme support (DSFR-inspired palette)
- Mobile: no drag & drop, horizontal column scroll, quick-action buttons
- Inline editing on task cards — no modal navigation for edits
- Skeleton loading states for initial load, card animation as re-planning indicator

**Scale & Complexity:**

- Primary domain: Web Application (SPA/PWA) + REST API Backend
- Complexity level: Low-Medium
- Project context: Greenfield — no legacy constraints
- Estimated architectural components: ~8–10 (auth, workspace, task, prioritization engine, activity log, dashboard views, PWA/offline, analytics, API gateway/routing, state management)

### Technical Constraints & Dependencies

| Constraint | Source | Impact |
|---|---|---|
| API-first with zero frontend business logic | PRD (non-negotiable) | Strict backend/frontend separation; all prioritization, state machine, and filiation logic server-side |
| Pluggable prioritization engine | PRD | Algorithm must be a replaceable component with configurable weights (default: Impact 50% / Deadline 30% / Effort 20%) |
| OAuth-only authentication (Google, GitHub) | PRD MVP scope | No email/password auth; depends on external OAuth providers |
| PWA with offline read-only | PRD | Service worker caching strategy required; no offline mutations in MVP |
| Stateless backend | NFR17 | No server-side session state; enables horizontal scaling |
| Request-response only (no WebSocket/SSE) | PRD MVP scope | Single-user mode; architecture should accommodate future async patterns (job/queue) without breaking API contract |
| MUI design system (React) | UX Spec | Frontend framework effectively locked to React |

### Cross-Cutting Concerns Identified

| Concern | Description | Affected Components |
|---|---|---|
| **Authentication & Authorization** | OAuth 2.0 token validation on every API call | All API endpoints |
| **Tenant Isolation** | Workspace-scoped data filtering on every data access | All data queries and mutations |
| **Re-Prioritization Trigger** | Multiple operations (task create, edit, state change, split) trigger engine recalculation | Task CRUD, state machine, split, manual override |
| **Manual Override Protection** | System must detect, persist, and respect pinned task positions; never silently override | Prioritization engine, drag & drop, task edit |
| **Activity Logging** | Chronological event log with optional/mandatory comments on every task action | All task mutations |
| **Online/Offline State** | PWA read-only offline with clear UI indicator; sync on reconnect | Frontend state, service worker, dashboard |
| **Analytics Instrumentation** | Non-intrusive event tracking on key user actions | Sign-up, session, task CRUD, split, re-prioritization |
| **Structured Error Handling** | Consistent error response format API → frontend | All API endpoints, frontend error display |

## Starter Template Evaluation

### Technical Preferences

- **Developer profile:** Expert Java, bonnes connaissances TypeScript/JS
- **Monorepo:** Requested — frontend + backend + shared packages in single repo
- **Containerization:** Docker + Docker Compose (hosting decisions deferred)
- **Database preference:** To be determined (evaluated below)

### Backend Stack Decision: Java Spring Boot vs TypeScript NestJS

#### Comparative Analysis Matrix

Weighted criteria scoring (1–5) reflecting project-specific priorities (monorepo constraint, solo developer, MVP scale).

| # | Criterion | Weight | Justification |
|---|---|---|---|
| C1 | Monorepo coherence (shared types, unified build) | 20% | Explicit user requirement + API-first constraint |
| C2 | Developer productivity (familiarity + tooling DX) | 20% | Solo developer — individual velocity is critical |
| C3 | Domain fit (REST API, state machine, filiation) | 15% | Core business logic of the product |
| C4 | Re-prioritization engine performance | 10% | NFR1 < 2s for 50+ tasks |
| C5 | Docker operational simplicity | 10% | Docker/Compose requested, no complex infra |
| C6 | ORM + PostgreSQL ecosystem | 10% | Migration quality, type-safety, DX |
| C7 | Learning curve | 8% | Intermediate TS, expert Java |
| C8 | Future-proofing (V2 AI, async, evolution) | 7% | Relevant but post-MVP |

**Scoring:**

| Criterion | Weight | Java Spring Boot | Score | TypeScript NestJS | Score |
|---|---|---|---|---|---|
| C1 — Monorepo coherence | 20% | Two toolchains (Gradle+npm), no shared types, manual DTO sync | **2** | Same language everywhere, native `packages/shared`, shared Zod schemas | **5** |
| C2 — Developer productivity | 20% | Expert Java = high productivity on business logic, but heavier boilerplate | **4** | Good TS knowledge + NestJS follows Spring patterns = smooth transition | **4** |
| C3 — Domain fit | 15% | Spring Boot excels for REST API, Spring State Machine, Hibernate relations | **5** | NestJS solid for REST, custom state machine (sufficient at this scope), Prisma relations | **4** |
| C4 — Re-prioritization perf | 10% | JVM strongly optimizes numeric loops, comfortable margin | **5** | V8 sufficient for 50 tasks (sub-ms), no real bottleneck at this scale | **4** |
| C5 — Docker simplicity | 10% | JVM image ~300MB, multi-stage build required, JVM tuning (heap, GC) | **3** | Node image ~120MB, simple, no runtime tuning | **5** |
| C6 — ORM + PostgreSQL | 10% | Hibernate/JPA very mature but verbose; jOOQ excellent but complex setup | **4** | Prisma: auto-generated types, declarative migrations, excellent DX | **5** |
| C7 — Learning curve | 8% | Zero curve — expert Java | **5** | Smooth curve — TS known + NestJS = familiar patterns | **4** |
| C8 — Future-proofing | 7% | Java AI ecosystem lagging (LangChain4j less mature), async via Loom | **3** | AI SDK (LangChain.js, Vercel AI) very active, BullMQ for async | **5** |

**Weighted totals:**

| Option | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | **TOTAL** |
|---|---|---|---|---|---|---|---|---|---|
| **Java Spring Boot** | 0.40 | 0.80 | 0.75 | 0.50 | 0.30 | 0.40 | 0.40 | 0.21 | **3.76/5** |
| **TypeScript NestJS** | 1.00 | 0.80 | 0.60 | 0.40 | 0.50 | 0.50 | 0.32 | 0.35 | **4.47/5** |

**Decision: TypeScript / NestJS**

The monorepo coherence criterion (C1) is the decisive factor. The 3-point gap (2 vs 5) on the highest-weighted criterion creates an insurmountable advantage. NestJS's Spring-like architecture (modules, DI, decorators, guards, pipes) ensures a familiar development experience for a Java expert. If monorepo were not a requirement, the scores would be nearly equal (Java ~4.36 vs NestJS ~4.47).

### Database Decision: SQL vs NoSQL

**Decision: PostgreSQL (SQL)**

The data model is intrinsically relational: Workspace → Subjects → Tasks → Sub-tasks → Activity Log. Foreign keys provide natural integrity constraints for parent-child filiation. ACID transactions are essential for NFR19 (zero data loss, atomic state transitions). PostgreSQL also offers JSONB for future schema flexibility and Row Level Security for tenant isolation reinforcement.

### Monorepo Starter Decision

| Option | Setup (30%) | Cache (25%) | Scale fit (20%) | Generators (15%) | Maintenance (10%) | **TOTAL** |
|---|---|---|---|---|---|---|
| **Turborepo** | 1.50 | 1.00 | 1.00 | 0.30 | 0.50 | **4.30/5** |
| **Nx** | 0.90 | 1.25 | 0.60 | 0.75 | 0.50 | **4.00/5** |
| **pnpm bare** | 1.50 | 0.25 | 0.60 | 0.15 | 0.30 | **2.80/5** |

**Decision: Turborepo + pnpm workspaces**

Optimal simplicity/power ratio for a low-medium complexity project with a solo developer. Intelligent caching without heavy configuration. Nx is more powerful but over-engineered for this scale.

### Selected Stack Summary

| Layer | Technology | Rationale |
|---|---|---|
| **Monorepo** | Turborepo + pnpm workspaces | Cache, orchestration, simplicity |
| **Frontend** | Vite + React + TypeScript | Performant, MUI compatible, fast HMR |
| **Design System** | MUI | Imposed by UX Spec |
| **Backend** | NestJS + TypeScript | Spring-like architecture, DI, guards, pipes |
| **ORM** | Drizzle | Typesafe SQL-first, lightweight (no binary engine), monorepo-native TS schema, developer familiarity |
| **Database** | PostgreSQL | Relational, ACID, RLS, JSONB |
| **Auth** | Arctic + custom JWT (NestJS Guards) | Modern OAuth2 library, lightweight, full control over session management |
| **Validation** | Zod (shared package) | Schemas shared between frontend and backend |
| **Testing** | Vitest (front) + Jest (back) | Fast, native TypeScript |
| **Containerization** | Docker + Docker Compose | Local dev and production |
| **Linting** | ESLint + Prettier | Code consistency |

### Initialization Command

```bash
pnpm dlx create-turbo@latest training-bmad-method-todolist --package-manager pnpm
```

**Architectural Decisions Provided by Starter:**

- **Language & Runtime:** TypeScript strict mode across all packages
- **Build Tooling:** Turborepo task pipelines with remote caching capability
- **Code Organization:** `apps/web` (Vite+React), `apps/api` (NestJS), `packages/shared` (types, Zod schemas, constants)
- **Package Management:** pnpm workspaces with hoisted dependencies
- **Development Experience:** Parallel builds, incremental compilation, shared tsconfig

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Backend stack: TypeScript / NestJS (decided in Step 3)
- Database: PostgreSQL (decided in Step 3)
- ORM: Drizzle (decided in Step 4 — replaces initial Prisma recommendation based on developer expertise)
- Authentication: Arctic + JWT with refresh tokens in DB
- Tenant isolation: Application-level filtering via WorkspaceGuard
- API design: REST with versioning, Swagger, RFC 7807 errors

**Important Decisions (Shape Architecture):**
- Frontend state: TanStack Query + Zustand
- Drag & drop: @dnd-kit
- Routing: React Router v7
- Rate limiting: @nestjs/throttler
- CI/CD: GitHub Actions

**Deferred Decisions (Post-MVP):**
- External caching (Redis) — PostgreSQL + indexes sufficient for MVP scale
- Row Level Security (RLS) — application-level filtering sufficient for MVP
- Error tracking service (Sentry) — NestJS Logger sufficient for MVP
- Hosting provider — Docker Compose ready, provider selection deferred

### Data Architecture

**ORM: Drizzle**
- Rationale: Developer familiarity (strong Drizzle expertise), SQL-first approach ideal for complex priority scoring queries, pure TypeScript (no binary engine like Prisma), monorepo-native schema export, lightweight Docker footprint
- Version: Latest stable
- Affects: All backend data access, migrations, shared type definitions

**Caching Strategy: No external cache for MVP**
- Rationale: PostgreSQL with proper indexes handles 50–100 tasks per workspace efficiently. No cache invalidation complexity.
- Future: Redis can be added in V2 if performance monitoring indicates need
- Affects: Infrastructure simplicity, Docker Compose configuration

**Data Loading Strategy:**
- Dashboard / active tasks: Full load — server returns all active tasks for workspace (≤100). Frontend handles day-column distribution.
- History / completed tasks: Server-side cursor-based pagination — volume grows indefinitely.
- Activity log per task: Full load — low volume per task (5–50 entries).
- Rationale: The re-prioritization engine and Kanban animation require the complete active task set on the client. Paginating active tasks would break the "living plan" experience.

### Authentication & Security

**Authentication: Arctic + custom JWT**
- OAuth2 flow: Arctic handles authorization URL creation, code exchange, PKCE
- Session strategy: Application-issued JWT (not OAuth provider tokens)
  - Access token: 15min, sent in Authorization header
  - Refresh token: 7 days, httpOnly/secure/sameSite cookie, persisted in DB
  - Refresh tokens stored in DB enable: revocation, sign-out-all-devices, compromised token invalidation
- Rationale: Arctic is modern, lightweight, handles OAuth2 complexity without imposing session management. Custom JWT gives full control.
- Affects: Auth module, user model, refresh token table, NestJS Guards

**Tenant Isolation: Application-level filtering**
- Implementation: Global `WorkspaceGuard` NestJS interceptor injects `workspace_id` into every data query
- Every database query includes `WHERE workspace_id = ?` — no exceptions
- Rationale: Simple, testable, sufficient for MVP. PostgreSQL RLS deferred to V2 as defense-in-depth layer.
- Affects: All API endpoints, all service layer queries

### API & Communication Patterns

**REST API Design:**
- Versioning: URL prefix `/api/v1/...`
- Documentation: Swagger/OpenAPI auto-generated via `@nestjs/swagger` decorators
- Response envelope: `{ data, meta, errors }` standard format
- Error format: RFC 7807 Problem Details (`type`, `title`, `status`, `detail`)
- Pagination: Cursor-based on history endpoints only (active tasks loaded fully)
- Affects: All API endpoints, frontend API client, error handling

**Rate Limiting: @nestjs/throttler**
- Application-level rate limiting (e.g., 100 req/min per user)
- Rationale: Simple, NestJS-integrated, sufficient for MVP. Infrastructure-level rate limiting (nginx/traefik) can be added when hosting is decided.
- Affects: API middleware configuration

### Frontend Architecture

**State Management: TanStack Query + Zustand**
- TanStack Query: All server state (tasks, subjects, workspace). Handles caching, revalidation, optimistic updates for task mutations.
- Zustand: Minimal client-only state (active theme, sidebar state, active filters, offline indicator).
- No Redux — over-engineering for this project's client state complexity.
- Affects: All frontend data fetching, UI state, optimistic update patterns

**Drag & Drop: @dnd-kit**
- Rationale: Modern React DnD standard. Excellent keyboard accessibility (WCAG/NFR24), touch support for mobile, sortable animations for Kanban card repositioning.
- Affects: TaskCard component, TimeBasedKanbanBoard, manual override detection

**Routing: React Router v7**
- Rationale: Mature, well-documented, large community. No need for loader patterns (TanStack Query handles data fetching).
- Affects: App shell, route definitions, navigation guards

### Infrastructure & Deployment

**Docker Compose: 3 services**
```yaml
services:
  api:   # NestJS backend
  web:   # Vite dev server (dev) / nginx static (prod)
  db:    # PostgreSQL
```
- No reverse proxy or Redis for MVP
- Rationale: Minimal viable infrastructure. Additional services added as needed.

**CI/CD: GitHub Actions**
- Rationale: Repository hosted on GitHub. Native integration, free for public repos.
- Affects: Build pipeline, test automation, Docker image builds

**Monitoring & Logging: Minimal MVP approach**
- Logging: `@nestjs/common` Logger — structured JSON output in production
- Health monitoring: `/api/health` endpoint for Docker healthchecks
- Error tracking: Deferred to post-MVP (Sentry or equivalent)
- Rationale: Sufficient observability for MVP validation phase

### Decision Impact Analysis

**Implementation Sequence:**
1. Monorepo initialization (Turborepo + pnpm)
2. Database schema (Drizzle + PostgreSQL)
3. Authentication module (Arctic + JWT)
4. Core API structure (NestJS modules, guards, interceptors)
5. Task CRUD + state machine
6. Re-prioritization engine
7. Frontend shell (React Router, MUI theme, TanStack Query)
8. Dashboard + Kanban board (@dnd-kit)
9. PWA / service worker
10. Analytics instrumentation

**Cross-Component Dependencies:**
- Drizzle schema in `packages/shared` → consumed by backend services AND used to generate frontend types
- Zod validation schemas in `packages/shared` → used by both API input validation (NestJS pipes) and frontend form validation
- WorkspaceGuard depends on JWT auth module → must be implemented after auth
- Re-prioritization engine depends on task model + manual override flags → must be implemented after core task CRUD
- @dnd-kit integration depends on TanStack Query optimistic updates → frontend data layer must be established first

## Implementation Patterns & Consistency Rules

### Naming Conventions

**Two rules only:**

1. **File names → kebab-case** (everywhere, uniformly)
2. **Everything else → camelCase / PascalCase** (DB, API, code, variables, types)

PascalCase is the uppercase variant of camelCase, used where TypeScript/React conventions require it (types, components, enums).

| Element | Convention | Example |
|---|---|---|
| All files (front + back + shared) | kebab-case `.ts` / `.tsx` | `task-card.tsx`, `task.service.ts`, `priority-calculator.ts` |
| React components (export) | PascalCase | `export function TaskCard()` |
| Functions, variables, hooks, params | camelCase | `useTaskList()`, `taskId`, `priorityScore` |
| Types / Interfaces | PascalCase, no `I` prefix | `Task`, `PriorityScore`, `WorkspaceConfig` |
| Constants | camelCase (like everything else) | `maxActiveTasks`, `defaultPriorityWeights` |
| Enums | PascalCase (name + values) | `TaskStatus.InProgress`, `PriorityLevel.High` |
| Zod schemas | camelCase + `Schema` suffix | `createTaskSchema`, `taskSchema` |
| DB tables | camelCase plural (quoted) | `"tasks"`, `"activityLogs"` |
| DB columns | camelCase (quoted) | `"workspaceId"`, `"createdAt"`, `"priorityScore"` |
| DB foreign keys | `{singularTable}Id` | `"taskId"`, `"parentTaskId"` |
| DB indexes | `idx_{table}_{columns}` | `idx_tasks_workspaceId` |
| API JSON fields | camelCase | `{ taskId, priorityScore, createdAt }` |
| REST endpoints | kebab-case, plural nouns | `/api/v1/tasks`, `/api/v1/activity-logs` |
| REST special actions | Verb suffix after resource | `/api/v1/tasks/:taskId/split` |
| Route params | camelCase with `:` | `:taskId`, `:subjectId` |
| Query params | camelCase | `?subjectId=...&status=...` |
| Test files | Same name + `.test.ts` | `task.service.test.ts`, `task-card.test.tsx` |

**Note:** PostgreSQL requires quoted identifiers for camelCase column names. Drizzle handles this natively — define columns in camelCase in the TS schema and Drizzle generates the correct quoted SQL.

### Structure Patterns

**Project Organization:**

| Area | Pattern |
|---|---|
| Tests | Co-located — same folder as source file |
| Frontend components | By feature: `features/tasks/`, `features/dashboard/`, `features/auth/` |
| Backend modules | By NestJS module: `modules/task/`, `modules/workspace/`, `modules/auth/` |
| Shared code | `packages/shared/src/` — types, Zod schemas, constants |
| Config files | Root of each app: `.env`, `tsconfig.json`, `drizzle.config.ts` |
| Static assets | `apps/web/public/` |

**Frontend structure example:**
```
apps/web/src/
  features/
    tasks/
      task-card.tsx
      task-card.test.tsx
      task-list.tsx
      use-tasks.ts          ← TanStack Query hook
    dashboard/
      kanban-board.tsx
      kanban-column.tsx
    auth/
      login-page.tsx
      auth-callback.tsx
  components/               ← reusable generic components
    button.tsx
    loading-skeleton.tsx
  layouts/
    app-layout.tsx
  locales/
    en.json
    fr.json
  theme.ts
```

### Styling Patterns

**Single styling system: MUI only**

| Situation | Approach |
|---|---|
| Global theme (colors, typography, spacing, breakpoints) | `createTheme()` in single `theme.ts` file |
| Reusable custom components | `styled()` from MUI | 
| One-off layout adjustments | `sx` prop |
| CSS files | **FORBIDDEN** — no `.css`, `.module.css`, no Tailwind |
| Inline styles | **FORBIDDEN** — never `style={{}}`, always `sx` instead |

### Format Patterns

| Element | Convention | Example |
|---|---|---|
| Dates in JSON (API) | ISO 8601 string (UTC) | `"2026-02-27T14:30:00.000Z"` |
| Dates in DB | `timestamp with time zone` | Drizzle `timestamp('createdAt', { withTimezone: true })` |
| Dates in frontend | Local conversion at display only | `dayjs(task.createdAt).format('DD/MM')` |
| Date library | dayjs (lightweight, MUI date picker compatible) | — |
| Nulls in JSON | Explicit — `null` (not absent, not `""`) | `{ "deadline": null }` |
| Booleans | `true` / `false` (never `1` / `0`) | `{ "isPinned": true }` |
| IDs | UUID v4 (string) | `"550e8400-e29b-41d4-a716-446655440000"` |

### Internationalization (i18n)

| Aspect | Convention |
|---|---|
| Library | `react-i18next` |
| MVP languages | `en` (default) + `fr` |
| Translation files | JSON per language: `locales/en.json`, `locales/fr.json` |
| Location | `apps/web/src/locales/` |
| Translation keys | Namespace by feature, dot notation: `tasks.createButton`, `dashboard.title` |
| Hard-coded text | **FORBIDDEN** — all user-visible text uses `t('key')` from first component |
| Backend error messages | English only (technical codes). Frontend translates for user display. |
| Date/number formatting | Native `Intl.DateTimeFormat` and `Intl.NumberFormat` |
| Language detection | Browser preference (`navigator.language`) → stored in Zustand → persisted in localStorage |

### Error Handling Patterns

| Layer | Pattern |
|---|---|
| API → Frontend | All errors follow RFC 7807: `{ type, title, status, detail }` |
| NestJS | Global `ExceptionFilter` transforms all exceptions to RFC 7807 format |
| Zod validation errors | Transformed to RFC 7807 with `detail` containing invalid fields |
| Frontend | TanStack Query `onError` → MUI Snackbar with translated `detail` via i18n |
| Critical errors | Non-dismissible MUI Alert at top of page (e.g., connection loss) |
| Backend logging | `Logger.error()` with structured context (userId, workspaceId, endpoint, stack trace) |
| `console.log` | **FORBIDDEN** in production — NestJS Logger only (back), nothing in prod (front) |

### Loading State Patterns

| Situation | Pattern |
|---|---|
| Initial load | MUI Skeleton (mimicking Kanban structure) |
| User action (create, edit, split) | Optimistic update via TanStack Query — UI updates immediately, rollback on error |
| Re-prioritization | Card repositioning animation = visual loading indicator |
| Offline | Persistent MUI Warning Alert: "Offline mode — read only" |

### Validation Patterns

| Layer | Pattern |
|---|---|
| Zod schemas | Defined in `packages/shared` — used by front AND back |
| Frontend validation | `onBlur` (not while typing). Submit button disabled if invalid. |
| Backend validation | Global NestJS Pipe validates via Zod before controller |
| Double validation | Always — frontend validates for UX, backend validates for security |

### Enforcement Guidelines

**All AI agents MUST:**
- Follow the 2-convention naming rule (kebab-case files, camelCase/PascalCase everything else)
- Use MUI styling exclusively (no CSS files, no inline styles)
- Never hard-code user-visible text (always i18n keys)
- Co-locate tests with source files
- Use Zod schemas from `packages/shared` for all validation
- Follow RFC 7807 for all API error responses
- Use TanStack Query optimistic updates for all task mutations
- Use NestJS Logger, never `console.log`

**Anti-patterns (FORBIDDEN):**
- CSS files, Tailwind, or inline `style={{}}` attributes
- Hard-coded strings in UI components
- `console.log` in production code
- Business logic in frontend components
- Direct database queries outside NestJS service layer
- Skipping backend validation because frontend validates

## Project Structure & Boundaries

### Requirements to Structure Mapping

| FR Category | Backend (NestJS) | Frontend (React) | Shared |
|---|---|---|---|
| FR1–FR4 Auth (OAuth, session, sign-out) | `modules/auth/` | `features/auth/` | `schemas/auth.schema.ts` |
| FR5–FR10 Workspace & Subjects | `modules/workspace/`, `modules/subject/` | `features/workspace/` | `schemas/workspace.schema.ts`, `schemas/subject.schema.ts` |
| FR11–FR14 Task CRUD | `modules/task/` | `features/tasks/` | `schemas/task.schema.ts` |
| FR15–FR18 Re-prioritization Engine | `modules/prioritization/` | — (server only) | `types/priority.types.ts` |
| FR19–FR22, FR52–53 Manual Override | `modules/task/` + `modules/prioritization/` | `features/dashboard/` (DnD) | `types/task.types.ts` (isPinned) |
| FR23–FR27 Task Split / Filiation | `modules/task/` (split sub-service) | `features/tasks/` | `schemas/task-split.schema.ts` |
| FR28–FR35 Task State Lifecycle | `modules/task/` (state machine) | `features/tasks/` | `types/task-status.types.ts` |
| FR36–FR39 Activity Log | `modules/activity-log/` | `features/tasks/` (inline) | `schemas/activity-log.schema.ts` |
| FR40–FR45, FR54 Dashboard & Planning | — (existing API endpoints) | `features/dashboard/` | — |
| FR46–FR49 PWA & Offline | — | Service worker, manifest | — |
| FR50–FR51 Analytics | `modules/analytics/` | Tracking hooks | `types/analytics-event.types.ts` |

**Cross-cutting dependencies:**
- `WorkspaceGuard` → injected in ALL modules (except auth and health)
- `ActivityLogService` → consumed by task, prioritization, state machine modules
- Zod schemas → `packages/shared` → consumed by both frontend and backend

### Complete Project Directory Structure

```
training-bmad-method-todolist/
├── README.md
├── package.json                          ← pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json                            ← Turborepo pipeline config
├── tsconfig.base.json                    ← shared TS base config
├── .gitignore
├── .env.example                          ← env var documentation
├── .prettierrc
├── .eslintrc.mjs
├── docker-compose.yml                    ← 3 services: api, web, db
├── docker-compose.prod.yml               ← production overrides
├── .github/
│   └── workflows/
│       ├── ci.yml                        ← lint + test + build
│       └── docker-build.yml              ← Docker image build
│
├── apps/
│   ├── api/                              ← NestJS backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   ├── drizzle.config.ts             ← Drizzle Kit migration config
│   │   ├── Dockerfile
│   │   ├── .env                          ← local dev (gitignored)
│   │   ├── .env.example
│   │   ├── src/
│   │   │   ├── main.ts                   ← bootstrap, global pipes/filters
│   │   │   ├── app.module.ts             ← root module
│   │   │   ├── config/
│   │   │   │   ├── app.config.ts         ← validated env config
│   │   │   │   └── database.config.ts
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   ├── database.provider.ts  ← Drizzle connection
│   │   │   │   ├── schema.ts             ← re-exports from shared
│   │   │   │   └── migrations/           ← Drizzle Kit migrations
│   │   │   ├── common/
│   │   │   │   ├── filters/
│   │   │   │   │   └── rfc7807-exception.filter.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   └── workspace.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── response-envelope.interceptor.ts
│   │   │   │   ├── pipes/
│   │   │   │   │   └── zod-validation.pipe.ts
│   │   │   │   ├── decorators/
│   │   │   │   │   ├── current-user.decorator.ts
│   │   │   │   │   └── current-workspace.decorator.ts
│   │   │   │   └── types/
│   │   │   │       └── request.types.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.controller.test.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.service.test.ts
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   ├── arctic.provider.ts    ← Arctic OAuth setup
│   │   │   │   │   └── refresh-token.service.ts
│   │   │   │   ├── workspace/
│   │   │   │   │   ├── workspace.module.ts
│   │   │   │   │   ├── workspace.controller.ts
│   │   │   │   │   ├── workspace.controller.test.ts
│   │   │   │   │   ├── workspace.service.ts
│   │   │   │   │   └── workspace.service.test.ts
│   │   │   │   ├── subject/
│   │   │   │   │   ├── subject.module.ts
│   │   │   │   │   ├── subject.controller.ts
│   │   │   │   │   ├── subject.controller.test.ts
│   │   │   │   │   ├── subject.service.ts
│   │   │   │   │   └── subject.service.test.ts
│   │   │   │   ├── task/
│   │   │   │   │   ├── task.module.ts
│   │   │   │   │   ├── task.controller.ts
│   │   │   │   │   ├── task.controller.test.ts
│   │   │   │   │   ├── task.service.ts
│   │   │   │   │   ├── task.service.test.ts
│   │   │   │   │   ├── task-split.service.ts
│   │   │   │   │   ├── task-split.service.test.ts
│   │   │   │   │   ├── task-state-machine.service.ts
│   │   │   │   │   └── task-state-machine.service.test.ts
│   │   │   │   ├── prioritization/
│   │   │   │   │   ├── prioritization.module.ts
│   │   │   │   │   ├── prioritization.service.ts
│   │   │   │   │   ├── prioritization.service.test.ts
│   │   │   │   │   ├── priority-calculator.ts
│   │   │   │   │   └── priority-calculator.test.ts
│   │   │   │   ├── activity-log/
│   │   │   │   │   ├── activity-log.module.ts
│   │   │   │   │   ├── activity-log.controller.ts
│   │   │   │   │   ├── activity-log.controller.test.ts
│   │   │   │   │   ├── activity-log.service.ts
│   │   │   │   │   └── activity-log.service.test.ts
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── analytics.module.ts
│   │   │   │   │   ├── analytics.service.ts
│   │   │   │   │   └── analytics.service.test.ts
│   │   │   │   └── health/
│   │   │   │       ├── health.module.ts
│   │   │   │       └── health.controller.ts
│   │   │   └── swagger.config.ts
│   │   └── test/
│   │       └── app.e2e-test.ts           ← E2E tests (supertest)
│   │
│   └── web/                              ← Vite + React frontend
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       ├── Dockerfile
│       ├── public/
│       │   ├── manifest.json             ← PWA manifest
│       │   ├── service-worker.ts         ← offline caching
│       │   └── icons/                    ← PWA icons
│       └── src/
│           ├── main.tsx                  ← React entry point
│           ├── app.tsx                   ← Router + providers setup
│           ├── theme.ts                  ← MUI createTheme()
│           ├── i18n.ts                   ← react-i18next config
│           ├── api/
│           │   ├── api-client.ts         ← fetch/axios + auth headers
│           │   └── api-client.test.ts
│           ├── features/
│           │   ├── auth/
│           │   │   ├── login-page.tsx
│           │   │   ├── login-page.test.tsx
│           │   │   ├── auth-callback.tsx
│           │   │   └── use-auth.ts
│           │   ├── workspace/
│           │   │   ├── workspace-setup-page.tsx
│           │   │   ├── workspace-setup-page.test.tsx
│           │   │   ├── subject-manager.tsx
│           │   │   └── use-workspace.ts
│           │   ├── tasks/
│           │   │   ├── task-card.tsx
│           │   │   ├── task-card.test.tsx
│           │   │   ├── task-form.tsx
│           │   │   ├── task-form.test.tsx
│           │   │   ├── task-detail.tsx
│           │   │   ├── task-split-dialog.tsx
│           │   │   ├── task-activity-log.tsx
│           │   │   ├── use-tasks.ts        ← TanStack Query hooks
│           │   │   └── use-task-mutations.ts
│           │   └── dashboard/
│           │       ├── kanban-board.tsx
│           │       ├── kanban-board.test.tsx
│           │       ├── kanban-column.tsx
│           │       ├── kanban-column.test.tsx
│           │       ├── day-header.tsx
│           │       ├── five-day-view.tsx
│           │       └── use-dashboard.ts
│           ├── components/                 ← reusable generic UI
│           │   ├── loading-skeleton.tsx
│           │   ├── offline-alert.tsx
│           │   ├── error-snackbar.tsx
│           │   └── confirm-dialog.tsx
│           ├── layouts/
│           │   └── app-layout.tsx
│           ├── hooks/
│           │   ├── use-offline-detection.ts
│           │   └── use-analytics.ts
│           ├── locales/
│           │   ├── en.json
│           │   └── fr.json
│           ├── stores/
│           │   ├── ui.store.ts            ← Zustand: theme, sidebar, filters
│           │   └── language.store.ts      ← Zustand: language pref
│           └── routes.tsx                  ← React Router v7 config
│
└── packages/
    └── shared/                            ← types, schemas, constants
        ├── package.json
        ├── tsconfig.json
        └── src/
            ├── index.ts                   ← barrel export
            ├── schemas/
            │   ├── auth.schema.ts
            │   ├── workspace.schema.ts
            │   ├── subject.schema.ts
            │   ├── task.schema.ts
            │   ├── task-split.schema.ts
            │   └── activity-log.schema.ts
            ├── types/
            │   ├── task.types.ts
            │   ├── task-status.types.ts
            │   ├── priority.types.ts
            │   ├── workspace.types.ts
            │   ├── subject.types.ts
            │   ├── analytics-event.types.ts
            │   └── api-response.types.ts
            └── constants/
                ├── priority-weights.ts     ← default 50/30/20
                └── task-status.ts          ← enum values
```

### Architectural Boundaries

**API Boundaries:**

| Endpoint Group | Description | Guards |
|---|---|---|
| `/api/v1/auth/*` | OAuth flow (login URL, callback, refresh, sign-out) | None (public) |
| `/api/v1/workspaces/*` | CRUD workspace | `JwtAuthGuard` + `WorkspaceGuard` |
| `/api/v1/subjects/*` | CRUD subjects within active workspace | `JwtAuthGuard` + `WorkspaceGuard` |
| `/api/v1/tasks/*` | CRUD tasks, split, state transitions — triggers auto-repriorization | `JwtAuthGuard` + `WorkspaceGuard` |
| `/api/v1/tasks/:taskId/activity-log` | Chronological log per task | `JwtAuthGuard` + `WorkspaceGuard` |
| `/api/v1/analytics/events` | Event tracking ingestion | `JwtAuthGuard` |
| `/api/health` | Docker healthcheck | None (public) |

**Component Boundaries:**

| Boundary | Rule |
|---|---|
| Frontend → Backend | HTTP only via `api-client.ts`. Zero business logic in frontend. |
| Backend services → DB | Drizzle queries in services only. Never raw SQL in controllers. |
| Inter-module communication | Modules expose a public service. Communication via NestJS dependency injection, never direct repository imports across modules. |
| Shared → Consumers | `packages/shared` exports only types, Zod schemas, and constants. Zero runtime dependency on `apps/`. |

**Data Boundaries:**

| Boundary | Rule |
|---|---|
| Tenant isolation | `WorkspaceGuard` injects `workspaceId` into every request. ALL queries include `WHERE workspaceId = ?`. No exceptions. |
| Task state machine | Transitions validated exclusively in `task-state-machine.service.ts`. No direct state changes elsewhere. |
| Re-prioritization | Triggered automatically by `task.service.ts` after each mutation. Never called directly from a controller. |
| Activity log writes | Written by service layer after each action. Controllers never write directly to the activity log. |

### Data Flow

```
[Browser] → api-client.ts → HTTP → [NestJS]
                                      │
                          ┌───────────┼───────────┐
                          ▼           ▼           ▼
                    JwtAuthGuard  WorkspaceGuard  ZodValidationPipe
                          │           │           │
                          └─────┬─────┘           │
                                ▼                 ▼
                          Controller ← validated DTO
                                │
                                ▼
                          Service Layer ─── ActivityLogService
                                │
                          ┌─────┼──────┐
                          ▼    ▼       ▼
                    Drizzle  PrioritizationService
                       │
                       ▼
                  PostgreSQL
```

### Integration Points

**Internal Communication:**
- Frontend ↔ Backend: REST API over HTTP/HTTPS with JWT in Authorization header
- Backend modules: NestJS dependency injection — services injected across modules
- Shared package: Imported as `@training-bmad-method-todolist/shared` via pnpm workspace protocol

**External Integrations:**
- Google OAuth 2.0 (via Arctic) — authorization code flow with PKCE
- GitHub OAuth 2.0 (via Arctic) — authorization code flow with PKCE
- No other external services for MVP

**Re-prioritization Trigger Flow:**
1. Task mutation (create/edit/state-change/split) → `task.service.ts`
2. Service persists changes → Drizzle → PostgreSQL
3. Service calls `prioritization.service.recalculate(workspaceId)`
4. Engine loads all active tasks for workspace, computes scores (Impact 50% / Deadline 30% / Effort 20%), respects pinned overrides
5. Updated positions persisted → Drizzle → PostgreSQL
6. Service writes activity log entry
7. Response returns full updated task list to frontend
8. Frontend TanStack Query cache invalidated → UI re-renders with new order

### Development Workflow Integration

**Development Server Structure:**
```bash
pnpm dev                    # Turborepo runs all in parallel:
  → apps/api: nest start --watch (port 3000)
  → apps/web: vite dev (port 5173, proxies /api to 3000)
  → packages/shared: tsc --watch
```

**Build Process:**
```bash
pnpm build                  # Turborepo builds in dependency order:
  1. packages/shared        # types + schemas first
  2. apps/api              # NestJS compile
  3. apps/web              # Vite production build
```

**Test Process:**
```bash
pnpm test                   # Turborepo runs in parallel:
  → apps/api: jest --passWithNoTests
  → apps/web: vitest run
  → packages/shared: vitest run
```

**Docker Compose (local dev):**
```yaml
services:
  db:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
  api:
    build: ./apps/api
    ports: ["3000:3000"]
    depends_on: [db]
    environment: [DATABASE_URL, JWT_SECRET, ...]
  web:
    build: ./apps/web
    ports: ["5173:80"]
    depends_on: [api]
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices validated as mutually compatible:
- Turborepo + pnpm + NestJS + Vite React: proven combination, no conflicts
- Drizzle + PostgreSQL: native support, camelCase with quoted identifiers
- Arctic + JWT + NestJS Guards: Arctic handles OAuth flow, JWT issued manually, Guards validate
- Zod shared + NestJS Pipes + React forms: Zod runs on both Node and browser via `packages/shared`
- TanStack Query + optimistic updates + @dnd-kit: `useMutation` + `onMutate` supports optimistic patterns
- MUI + react-i18next: no interference, both work independently
- Vitest (front) + Jest (back): clean separation per app
- React Router v7 + Vite: natively compatible
- dayjs + Intl.DateTimeFormat: dayjs for manipulation, Intl for localized display

No contradictions detected. One implementation note: Drizzle schema defined in `packages/shared` but Drizzle Kit migrations live in `apps/api` — `drizzle.config.ts` must reference `../../packages/shared/src/schemas/*.ts`.

**Pattern Consistency:**
- Naming (kebab-case files + camelCase/PascalCase everything else) applied uniformly in Step 6 project tree ✅
- MUI-only styling — no CSS files present in structure ✅
- Co-located tests — `.test.ts` files alongside every source file ✅
- Zod schemas in `packages/shared/src/schemas/` — consistent with double validation pattern ✅

**Structure Alignment:**
- Project tree supports all Step 4 decisions ✅
- Guards, filters, interceptors correctly placed in `common/` ✅
- Module-based backend organization matches NestJS conventions ✅
- Feature-based frontend organization supports component isolation ✅

### Requirements Coverage Validation ✅

**Functional Requirements: 54/54 covered**

| Category | FRs | Architectural Support | Status |
|---|---|---|---|
| Authentication (FR1–FR4) | OAuth login/logout, session, landing pages | `modules/auth/`, Arctic, JWT, refresh tokens in DB | ✅ |
| Workspace & Subjects (FR5–FR10) | Auto-create workspace, CRUD subjects, isolation | `modules/workspace/`, `modules/subject/`, `WorkspaceGuard` | ✅ |
| Task CRUD (FR11–FR14) | Create, quick-capture, edit, reassign subject | `modules/task/`, Zod schemas, `features/tasks/` | ✅ |
| Auto-reprioritization (FR15–FR18) | Score calculation, trigger on mutation, <2s | `modules/prioritization/`, `priority-calculator.ts`, full load strategy | ✅ |
| Manual override (FR19–FR22, FR52–53) | DnD, pin detection, protection, release | `@dnd-kit`, `isPinned` flag, override logic in prioritization engine | ✅ |
| Task split (FR23–FR27) | Split endpoint, independent sub-tasks, filiation | `task-split.service.ts`, `task-split.schema.ts`, parent-child types | ✅ |
| State management (FR28–FR35) | State machine lifecycle, mandatory comments, permanent delete | `task-state-machine.service.ts`, Zod validation, activity log integration | ✅ |
| Activity log (FR36–FR39) | Chronological log, mandatory/optional comments | `modules/activity-log/`, consumed by task services | ✅ |
| Dashboard (FR40–FR45, FR54) | Day view, 5-day view, filters, business days toggle | `features/dashboard/`, `kanban-board.tsx`, `five-day-view.tsx`, Zustand filters | ✅ |
| PWA/Offline (FR46–FR49) | Install, offline read, indicator, reconnect refresh | `service-worker.ts`, `manifest.json`, `offline-alert.tsx`, `use-offline-detection.ts` | ✅ |
| Analytics (FR50–FR51) | Event tracking, non-intrusive | `modules/analytics/`, `use-analytics.ts` | ✅ |

**Non-Functional Requirements: 26/26 covered**

| NFR | Target | Architectural Support | Status |
|---|---|---|---|
| NFR1 | Re-prioritization <2s | Full load active tasks, in-memory scoring, PostgreSQL + indexes | ✅ |
| NFR2 | FCP <1.5s, LCP <2.5s | Vite, MUI Skeleton loading, TanStack Query cache | ✅ |
| NFR3 | Task CRUD <500ms | Optimistic updates via TanStack Query | ✅ |
| NFR4 | DnD feedback <100ms | @dnd-kit local state, animation pattern | ✅ |
| NFR5 | Offline load <1s | Service worker cache | ✅ |
| NFR6 | API <300ms p95 | NestJS + Drizzle (no binary engine overhead) + PostgreSQL | ✅ |
| NFR7 | 100 concurrent users | Stateless NestJS, horizontal scaling ready | ✅ |
| NFR8 | Tenant isolation | `WorkspaceGuard`, `WHERE workspaceId = ?` on every query | ✅ |
| NFR9 | OAuth 2.0 | Arctic + Google/GitHub providers | ✅ |
| NFR10 | TLS 1.2+ | Infrastructure-level (Docker/reverse proxy) | ✅ |
| NFR11 | Encryption at rest | PostgreSQL config (infrastructure) | ✅ |
| NFR12 | Session management | JWT 15min + refresh 7d httpOnly/secure/sameSite in DB | ✅ |
| NFR13 | API security | `@nestjs/throttler`, Zod validation, `WorkspaceGuard`, RFC 7807 | ✅ |
| NFR14 | GDPR | Data export + account deletion endpoints in `modules/auth/` | ✅ |
| NFR15 | 10x growth | Stateless backend, Docker horizontal scaling | ✅ |
| NFR16 | 1000 tasks/workspace | Cursor pagination for history, PostgreSQL indexes | ✅ |
| NFR17 | Stateless backend | JWT auth, no server sessions | ✅ |
| NFR18 | 99.5% uptime | Docker Compose, `/api/health` endpoint | ✅ |
| NFR19 | Zero data loss | PostgreSQL ACID, atomic transactions via Drizzle | ✅ |
| NFR20 | Backups | PostgreSQL native (infrastructure config) | ✅ |
| NFR21 | Graceful degradation | TanStack Query stale cache, Skeleton fallback | ✅ |
| NFR22 | Structured errors | RFC 7807, `rfc7807-exception.filter.ts`, `error-snackbar.tsx` | ✅ |
| NFR23 | Color contrast AA | MUI theme with DSFR palette, configurable | ✅ |
| NFR24 | Keyboard operability | @dnd-kit keyboard sensors, MUI accessible components | ✅ |
| NFR25 | Semantic structure | MUI components + ARIA, React semantic HTML | ✅ |
| NFR26 | prefers-reduced-motion | MUI respects natively, custom animations conditional | ✅ |

### Gap Analysis Results

| # | Element | Severity | Description | Resolution |
|---|---|---|---|---|
| G1 | GDPR (NFR14) | Important | Data export and account deletion endpoints needed | Add `DELETE /api/v1/account` and `GET /api/v1/account/export` in `modules/auth/`. No separate module required. |
| G2 | Drizzle schema path | Minor | Schema in `packages/shared`, Drizzle Kit config in `apps/api` | Document that `drizzle.config.ts` must reference `../../packages/shared/src/schemas/*.ts`. |
| G3 | Marketing pages (FR4) | Minor | Landing pages for unauthenticated visitors not in project structure | Out of scope for application architecture. Can be served as static pages or a public route in `apps/web`. Decision deferred to implementation. |
| G4 | Permanent delete (FR33) | Minor | Distinct from cancel/archive — needs explicit API differentiation | `DELETE /api/v1/tasks/:taskId` as hard delete, separate from state transition `PATCH` endpoints. Already implicit in REST conventions. |

**No critical gaps.** G1 addressed by adding GDPR endpoints to auth module scope.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (54 FRs, 26 NFRs)
- [x] Scale and complexity assessed (low-medium, greenfield)
- [x] Technical constraints identified (API-first, pluggable engine, PWA, stateless)
- [x] Cross-cutting concerns mapped (auth, tenant isolation, re-prioritization, activity log, offline, analytics, errors)

**✅ Architectural Decisions**
- [x] Critical decisions documented with rationale (NestJS, PostgreSQL, Drizzle, Arctic, JWT)
- [x] Technology stack fully specified (18 technologies)
- [x] Comparative analysis matrices produced (backend stack, monorepo tool)
- [x] Integration patterns defined (REST, JWT, Zod shared, TanStack Query)
- [x] Performance considerations addressed (full load active, cursor history, optimistic updates)

**✅ Implementation Patterns**
- [x] Naming conventions established (2 rules: kebab-case files, camelCase/PascalCase everything else)
- [x] Structure patterns defined (co-located tests, feature-based front, module-based back)
- [x] Styling patterns defined (MUI only, no CSS files, no inline styles)
- [x] Format patterns defined (ISO 8601 UTC, dayjs, explicit nulls, UUID v4)
- [x] i18n patterns defined (react-i18next, en/fr, namespace by feature)
- [x] Error handling patterns defined (RFC 7807, ExceptionFilter, Snackbar)
- [x] Loading state patterns defined (Skeleton, optimistic, animation, offline alert)
- [x] Validation patterns defined (Zod shared, double validation, onBlur front, Pipe back)
- [x] Enforcement guidelines with anti-patterns list

**✅ Project Structure**
- [x] Complete directory structure with all files and directories
- [x] Component boundaries established (API, module, data, tenant)
- [x] Integration points mapped (data flow diagram)
- [x] Requirements to structure mapping complete (54 FRs → modules/features)
- [x] Development workflow documented (dev, build, test, Docker)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Decisions grounded in weighted comparative matrices (not subjective preferences)
- 100% TypeScript stack with native code sharing via monorepo
- Highly prescriptive implementation patterns (zero ambiguity for AI agents)
- Explicit enforcement guidelines with forbidden anti-patterns
- API-first architecture with strict frontend/backend separation
- Complete project tree with file-level granularity

**Areas for Future Enhancement (Post-MVP):**
- Redis cache layer if performance monitoring indicates need
- PostgreSQL Row Level Security as defense-in-depth for tenant isolation
- Sentry or equivalent for production error tracking
- Hosting provider selection (architecture is Docker-ready)
- WebSocket/SSE for real-time updates in multi-user mode (V3)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow ALL architectural decisions exactly as documented in this file
- Use implementation patterns consistently across all components — no exceptions
- Respect project structure and boundaries — files go where the tree says
- Refer to this document for all architectural questions before making assumptions
- Follow enforcement guidelines — anti-patterns are strictly forbidden

**First Implementation Priority:**
```bash
pnpm dlx create-turbo@latest training-bmad-method-todolist --package-manager pnpm
```
Then: monorepo structure setup → database schema → auth module → core API → frontend shell → dashboard → PWA

