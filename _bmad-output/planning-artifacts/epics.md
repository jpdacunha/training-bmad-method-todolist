---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# training-bmad-method-todolist - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for training-bmad-method-todolist, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User can authenticate via OAuth (Google or GitHub) to access the application
FR2: User can sign out of the application
FR3: User's session persists across browser sessions until explicit sign-out
FR4: Unauthenticated visitors can view marketing/landing pages without sign-in
FR5: Upon first authentication, a workspace is automatically created for the user
FR6: User can create subjects within their workspace to group related tasks
FR7: User can rename a subject
FR8: User can archive a subject (removes from active view, preserves data)
FR9: User can view all their subjects with associated task counts
FR10: Each user's workspace is fully isolated — no cross-user data visibility
FR11: User can create a task with title, description, subject, estimated duration, priority level, and deadline
FR12: User can create a task using quick-capture mode (title only, minimal fields) for low-friction entry
FR13: User can edit any mutable property of an open or in-progress task
FR14: User can assign or reassign a task to a different subject
FR15: System automatically calculates a priority score for every active task based on a weighted formula (Impact / Deadline / Effort)
FR16: System automatically re-evaluates and re-orders all active tasks when any task is added, modified, or changes state
FR17: System presents tasks in calculated priority order on the dashboard
FR18: Re-prioritization completes and displays results within the performance target (<2s)
FR19: User can manually reorder tasks within the daily view via drag & drop
FR20: System detects and visually marks tasks that have been manually overridden
FR21: System preserves manual overrides — automatic re-prioritization never silently displaces a manually positioned task
FR22: If automatic re-prioritization would suggest a different position for a manually overridden task, the system notifies the user but does not force the change
FR23: User can split any open or in-progress task into two or more sub-tasks
FR24: Each sub-task created by a split is independent: own title, description, priority, estimate, deadline, and subject
FR25: Parent-child relationship between original task and split sub-tasks is preserved and visible
FR26: User can add a comment explaining the rationale when splitting a task
FR27: Split sub-tasks participate independently in automatic re-prioritization
FR28: Task states follow the lifecycle: Open → In Progress → Completed / Cancelled / Archived
FR29: User can transition a task to "In Progress" state
FR30: User can mark a task as "Completed"
FR31: User can cancel a task with a mandatory comment explaining the reason
FR32: User can archive a task with a mandatory comment
FR33: User can permanently delete a task as a separate, intentional action
FR34: Terminal states (Completed, Cancelled, Deleted) are irreversible
FR35: Completed and cancelled tasks remain accessible in a filterable view
FR36: User can add a comment to any task action (creation, state change, split, manual override, edit)
FR37: All task actions and their associated comments are stored chronologically as an activity log on the task
FR38: User can view the complete chronological activity log for any task
FR39: Comments are mandatory for cancel and archive actions, optional for all others
FR40: User can view a daily dashboard showing today's tasks in priority-calculated order
FR41: User can view a 5-day forward planning window showing tasks distributed across upcoming days, with the option to include or exclude non-business days
FR42: Dashboard visually distinguishes between task states (open, in progress, completed, cancelled, archived)
FR43: Dashboard shows the impact of re-prioritization — when tasks shift position or day, the change is visible
FR44: User can filter tasks by subject, state, or priority level
FR45: User can switch between day view and 5-day view
FR46: User can install the application as a PWA on mobile and desktop
FR47: User can view their cached dashboard and task data when offline (read-only)
FR48: System displays a clear visual indicator when in offline mode
FR49: System refreshes cached data when connectivity is restored
FR50: System tracks key user events (sign-up, session start, task creation, split, re-prioritization trigger, state changes) for MVP validation purposes
FR51: Event tracking is non-intrusive and does not impact application performance
FR52: User can release a manual override on a task, returning it to automatic prioritization
FR53: When a manual override is released, the system immediately re-evaluates and repositions the task according to the current priority algorithm
FR54: User can toggle the 5-day planning view between business days only (Monday–Friday) and all days (including weekends)

### NonFunctional Requirements

NFR1: Re-prioritization engine response time < 2s for workspaces with 50+ active tasks
NFR2: Dashboard initial load < 1.5s FCP, < 2.5s LCP on 4G
NFR3: Task CRUD operations perceived response < 500ms
NFR4: Drag & drop visual feedback < 100ms
NFR5: Offline dashboard load from cache < 1s
NFR6: API response time for standard endpoints < 300ms p95 for CRUD, < 2s p95 for re-prioritization
NFR7: Concurrent user support — 100 simultaneous active users minimum at launch
NFR8: Data isolation — workspace-level tenant isolation, no API endpoint may return data from another user's workspace
NFR9: Authentication — OAuth 2.0 (Google, GitHub) with secure token management
NFR10: Data in transit — TLS 1.2+ on all connections
NFR11: Data at rest — encryption at rest for all persistent user data
NFR12: Session management — secure, httpOnly, sameSite cookies or token-based sessions with expiration and refresh
NFR13: API security — rate limiting on all endpoints, input validation, OWASP Top 10 protection
NFR14: GDPR compliance — user can request data export and account deletion
NFR15: User growth capacity — system supports 10x growth (20,000 users) without architectural changes
NFR16: Data growth per user — support up to 1,000 tasks per workspace without performance degradation
NFR17: Horizontal scaling capability — backend must be stateless to allow horizontal scaling
NFR18: Availability — 99.5% uptime (excluding planned maintenance)
NFR19: Data durability — zero data loss, all task state transitions atomically persisted
NFR20: Backup and recovery — automated daily backups with point-in-time recovery
NFR21: Graceful degradation — dashboard renders with last known order if re-prioritization engine is slow
NFR22: Error handling — all API errors return structured, actionable error responses
NFR23: Color contrast — WCAG 2.1 AA minimum (4.5:1 normal text, 3:1 large text)
NFR24: Keyboard operability — all interactive elements reachable and operable via keyboard, including drag & drop alternative
NFR25: Semantic structure — proper heading hierarchy, landmark regions, ARIA labels on dynamic content
NFR26: Motion sensitivity — respect prefers-reduced-motion for all animations and transitions

### Additional Requirements

**From Architecture — Starter Template & Stack:**
- Monorepo: Turborepo + pnpm workspaces — initialization via `pnpm dlx create-turbo@latest training-bmad-method-todolist --package-manager pnpm`
- Project structure: `apps/api` (NestJS), `apps/web` (Vite+React), `packages/shared` (types, Zod schemas, constants)
- Backend: NestJS + TypeScript with strict mode
- ORM: Drizzle (SQL-first, no binary engine, monorepo-native TS schema)
- Database: PostgreSQL 16 (ACID, RLS-ready, JSONB)
- Frontend: Vite + React + TypeScript + MUI
- Auth: Arctic + custom JWT (access token 15min, refresh token 7d httpOnly/secure/sameSite in DB)
- Validation: Zod schemas shared between frontend and backend
- Testing: Vitest (frontend) + Jest (backend), co-located with source files
- Containerization: Docker + Docker Compose (3 services: api, web, db)
- CI/CD: GitHub Actions (lint + test + build + Docker image)
- Linting: ESLint + Prettier

**From Architecture — Core Patterns:**
- API Design: REST `/api/v1/...`, Swagger/OpenAPI auto-generated, RFC 7807 error format, `{ data, meta, errors }` envelope
- Tenant isolation: Global `WorkspaceGuard` NestJS interceptor injects `workspace_id` into every query
- State management: TanStack Query (server state) + Zustand (client-only state)
- Drag & drop: @dnd-kit library
- Routing: React Router v7
- Rate limiting: @nestjs/throttler
- Naming: kebab-case for all files, camelCase/PascalCase for everything else (DB, API, code, types)
- Styling: MUI only — no CSS files, no inline `style={{}}`, only `sx` prop and `styled()`
- i18n: react-i18next, MVP languages en + fr, all user-visible text via `t('key')`
- Error handling: Global NestJS ExceptionFilter → RFC 7807, frontend TanStack Query onError → MUI Snackbar
- Loading: MUI Skeleton for initial load, optimistic updates for mutations, card animation for re-prioritization
- Validation: Double validation — Zod onBlur in frontend, NestJS Pipe in backend
- Dates: ISO 8601 UTC in API/DB, dayjs for manipulation, local conversion at display only
- IDs: UUID v4
- Re-prioritization trigger: Every task mutation calls `prioritization.service.recalculate(workspaceId)` server-side

**From Architecture — Implementation Sequence:**
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

**From UX — Design & Interaction Requirements:**
- Design system: MUI with DSFR-inspired palette (light + dark themes)
- Typography: Spectral (Extra-Bold) for headings, Marianne (Regular, Bold) for body/UI
- Spacing: 4px grid system, high-density "Hyper-Efficient" layout
- Custom components: TaskCard, TimeBasedKanbanBoard, OverdueTaskNotification
- TaskCard states: default, hover (scale 1.03 + action buttons), dragging (semi-transparent), overdue (badge), pinned (active pin icon + colored left border)
- TaskCard inline editing: click to edit title, Enter to save, Escape to cancel
- Kanban columns represent days (Today, Tomorrow, etc.) — not workflow states
- Drag & drop with pin/override visual system (pin icon on drop, user choice to lock)
- Pin auto-breaks when Importance or Deadline modified
- Mobile (<768px): no drag & drop, horizontal column scroll, quick-action buttons, deadline change to move between columns
- Tablet (768–1023px): touch-friendly DnD, full Kanban view
- Desktop (>1024px): full density, all columns visible, keyboard-first
- Animations < 150ms, card repositioning as re-planning indicator
- Overdue task notification with "Re-plan All for Me" and "Manage Manually" actions
- Quick-capture: global `+` button or `N` key, title-only with defaults (Normal importance, End of Week deadline)
- Skeleton loading for initial load, optimistic updates for actions
- Empty state: welcome message + highlight add button for first-time users
- Feedback: Snackbar success (3-4s), inline field errors (onBlur), non-dismissible Alert for critical errors, Warning Alert for offline
- Forms: Outlined TextField, onBlur validation, Submit disabled when invalid

### FR Coverage Map

FR1: Epic 1 - User can authenticate via OAuth (Google or GitHub)
FR2: Epic 1 - User can sign out of the application
FR3: Epic 1 - User's session persists across browser sessions
FR4: Epic 1 - Unauthenticated visitors can view marketing/landing pages
FR5: Epic 1 - Upon first authentication, a workspace is automatically created
FR6: Epic 2 - User can create subjects within their workspace
FR7: Epic 2 - User can rename a subject
FR8: Epic 2 - User can archive a subject
FR9: Epic 2 - User can view all their subjects with task counts
FR10: Epic 1 - Each user's workspace is fully isolated
FR11: Epic 2 - User can create a task with full fields
FR12: Epic 2 - User can create a task using quick-capture mode
FR13: Epic 2 - User can edit any mutable property of a task
FR14: Epic 2 - User can assign or reassign a task to a different subject
FR15: Epic 3 - System automatically calculates a priority score
FR16: Epic 3 - System re-evaluates and re-orders all active tasks on mutation
FR17: Epic 3 - System presents tasks in calculated priority order
FR18: Epic 3 - Re-prioritization completes within <2s
FR19: Epic 4 - User can manually reorder tasks via drag & drop
FR20: Epic 4 - System detects and visually marks manually overridden tasks
FR21: Epic 4 - System preserves manual overrides against auto re-prioritization
FR22: Epic 4 - System notifies user if auto-prioritization suggests different position for pinned task
FR23: Epic 5 - User can split any open or in-progress task into sub-tasks
FR24: Epic 5 - Each split sub-task is independent with own properties
FR25: Epic 5 - Parent-child relationship is preserved and visible
FR26: Epic 5 - User can add a comment when splitting a task
FR27: Epic 5 - Split sub-tasks participate independently in re-prioritization
FR28: Epic 2 - Task states follow the lifecycle: Open → In Progress → Completed / Cancelled / Archived
FR29: Epic 2 - User can transition a task to In Progress
FR30: Epic 2 - User can mark a task as Completed
FR31: Epic 2 - User can cancel a task with mandatory comment
FR32: Epic 2 - User can archive a task with mandatory comment
FR33: Epic 2 - User can permanently delete a task
FR34: Epic 2 - Terminal states are irreversible
FR35: Epic 2 - Completed and cancelled tasks accessible in filterable view
FR36: Epic 2 - User can add a comment to any task action
FR37: Epic 2 - All task actions stored chronologically as activity log
FR38: Epic 2 - User can view complete chronological activity log
FR39: Epic 2 - Comments mandatory for cancel/archive, optional for others
FR40: Epic 3 - User can view daily dashboard in priority order
FR41: Epic 3 - User can view 5-day forward planning window
FR42: Epic 3 - Dashboard visually distinguishes task states
FR43: Epic 3 - Dashboard shows impact of re-prioritization
FR44: Epic 3 - User can filter tasks by subject, state, or priority
FR45: Epic 3 - User can switch between day view and 5-day view
FR46: Epic 6 - User can install the application as a PWA
FR47: Epic 6 - User can view cached dashboard offline (read-only)
FR48: Epic 6 - System displays visual indicator when offline
FR49: Epic 6 - System refreshes cached data when connectivity restored
FR50: Epic 7 - System tracks key user events for MVP validation
FR51: Epic 7 - Event tracking is non-intrusive
FR52: Epic 4 - User can release a manual override on a task
FR53: Epic 4 - Released override triggers immediate re-evaluation
FR54: Epic 3 - User can toggle 5-day view between business days and all days

## Epic List

### Epic 1: Project Foundation & User Access
A user can authenticate via OAuth (Google or GitHub) and access their personal, fully isolated workspace. A developer can launch the entire project locally with a single `pnpm dev` command.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR10

### Epic 2: Subject & Task Management
A user can create subjects to organize their work, create and manage tasks with a complete lifecycle (open → in progress → completed/cancelled/archived), and consult the full chronological history of every action taken on a task.
**FRs covered:** FR6, FR7, FR8, FR9, FR11, FR12, FR13, FR14, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39

### Epic 3: Intelligent Dashboard & Prioritization
A user sees their tasks intelligently ordered on a time-based Kanban board (day view + 5-day view), and every modification automatically recalculates the optimal execution plan within 2 seconds.
**FRs covered:** FR15, FR16, FR17, FR18, FR40, FR41, FR42, FR43, FR44, FR45, FR54

### Epic 4: Manual Override & Drag-and-Drop
A user can take manual control of task ordering via drag & drop, with a pinning system that protects their choices against automatic recalculation while remaining transparent about suggested alternatives.
**FRs covered:** FR19, FR20, FR21, FR22, FR52, FR53

### Epic 5: Task Split & Filiation
A user can split any open or in-progress task into independent sub-tasks while preserving parent-child traceability, enabling fluid reorganization and effective deprioritization of work.
**FRs covered:** FR23, FR24, FR25, FR26, FR27

### Epic 6: PWA & Offline Experience
A user can install the application on mobile and desktop, and consult their plan offline with a clear disconnected mode indicator and automatic sync on reconnection.
**FRs covered:** FR46, FR47, FR48, FR49

### Epic 7: Analytics & Validation Instrumentation
The product team can measure and validate MVP adoption through non-intrusive tracking of key user actions.
**FRs covered:** FR50, FR51

---

## Epic 1: Project Foundation & User Access

A user can authenticate via OAuth (Google or GitHub) and access their personal, fully isolated workspace. A developer can launch the entire project locally with a single `pnpm dev` command.

### Story 1.1: Monorepo Initialization & Project Scaffold

As a **developer**,
I want **a fully configured monorepo with frontend, backend, and shared packages running in Docker**,
So that **I can start development immediately with a single command and consistent tooling**.

**Acceptance Criteria:**

**Given** a fresh clone of the repository
**When** the developer runs `pnpm install && pnpm dev`
**Then** the API server (NestJS) starts on port 3000, the web dev server (Vite+React) starts on port 5173, and the shared package compiles in watch mode
**And** the web dev server proxies `/api` requests to the API server

**Given** Docker and Docker Compose are installed
**When** the developer runs `docker compose up`
**Then** three services start: `api` (NestJS), `web` (Vite dev / nginx), and `db` (PostgreSQL 16)
**And** the API service connects to the PostgreSQL database successfully

**Given** the monorepo structure exists
**When** inspecting the project
**Then** the structure contains `apps/api/` (NestJS), `apps/web/` (Vite+React), and `packages/shared/` (types, schemas, constants)
**And** Turborepo pipeline configuration enables parallel builds with caching
**And** pnpm workspaces are configured for all three packages

**Given** the API app exists
**When** a request is sent to `GET /api/health`
**Then** the server responds with HTTP 200 and a health status JSON

**Given** the web app exists
**When** the developer opens `http://localhost:5173`
**Then** a React application renders with MUI ThemeProvider (light+dark theme support), React Router v7, react-i18next (en+fr), and TanStack Query + Zustand providers configured
**And** no user-visible text is hard-coded — all strings use `t('key')` from i18n

**Given** the CI pipeline is configured
**When** a push is made to the repository
**Then** GitHub Actions runs lint (ESLint+Prettier), build, and test steps for all packages

**Given** the shared package exists
**When** importing from `@training-bmad-method-todolist/shared`
**Then** TypeScript types, Zod schemas, and constants are available in both `apps/api` and `apps/web`

### Story 1.2: Database Foundation & User Schema

As a **developer**,
I want **a Drizzle ORM setup with PostgreSQL connection and user/workspace/refresh-token tables**,
So that **the authentication system has the data foundation it needs**.

**Acceptance Criteria:**

**Given** the API application is running with a PostgreSQL connection
**When** Drizzle migrations are executed
**Then** the following tables are created: `users` (id UUID PK, email, name, avatarUrl, oauthProvider, oauthProviderId, createdAt, updatedAt), `workspaces` (id UUID PK, userId FK, name, createdAt, updatedAt), `refreshTokens` (id UUID PK, userId FK, token, expiresAt, createdAt)
**And** all column names use camelCase with quoted identifiers
**And** appropriate indexes exist (`idx_users_email`, `idx_users_oauthProviderId`, `idx_workspaces_userId`, `idx_refreshTokens_token`)

**Given** the Drizzle schema is defined in `packages/shared`
**When** the backend imports the schema
**Then** TypeScript types are automatically inferred from the schema and available for use in services

**Given** the `drizzle.config.ts` exists in `apps/api`
**When** the developer runs the Drizzle Kit migration commands
**Then** migrations are generated and applied correctly, referencing schemas from `packages/shared`

**Given** the database provider module exists
**When** the NestJS application starts
**Then** Drizzle connects to PostgreSQL using the `DATABASE_URL` environment variable
**And** the connection is validated with a health check query

**Given** `.env.example` files exist
**When** a developer sets up the project
**Then** documented environment variables include `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### Story 1.3: OAuth Authentication Backend

As a **user**,
I want **to sign in with my Google or GitHub account and maintain a persistent session**,
So that **I can securely access my data without creating yet another password**.

**Acceptance Criteria:**

**Given** a user is not authenticated
**When** a request is sent to `GET /api/v1/auth/login/google` (or `/github`)
**Then** the server responds with a redirect URL to the OAuth provider's authorization page with PKCE parameters

**Given** a user completes OAuth authorization with Google or GitHub
**When** the OAuth callback hits `GET /api/v1/auth/callback/google` (or `/github`) with a valid authorization code
**Then** the server exchanges the code via Arctic, creates or updates the user record in the database, generates a JWT access token (15min expiry) and a refresh token (7 days expiry, stored in DB), returns the access token in the response body, and sets the refresh token as an httpOnly/secure/sameSite cookie

**Given** a user has a valid JWT access token
**When** the token is sent in the `Authorization: Bearer` header on a protected endpoint
**Then** the `JwtAuthGuard` validates the token and attaches the user to the request context

**Given** a user has an expired access token but a valid refresh token cookie
**When** a request is sent to `POST /api/v1/auth/refresh`
**Then** the server validates the refresh token against the DB, issues a new access token and a new refresh token (rotating), and invalidates the old refresh token

**Given** a user wants to sign out
**When** a request is sent to `POST /api/v1/auth/sign-out`
**Then** the refresh token is deleted from the database, the refresh token cookie is cleared, and subsequent requests with the old tokens are rejected

**Given** an invalid or expired refresh token is presented
**When** a refresh request is made
**Then** the server responds with HTTP 401 and an RFC 7807 error body (`{ type, title, status, detail }`)

**Given** the rate limiter is configured
**When** more than the allowed number of auth requests are sent per minute
**Then** the server responds with HTTP 429 (Too Many Requests)

### Story 1.4: Frontend Shell & Authentication UI

As a **user**,
I want **to see a login page with Google and GitHub sign-in options and remain logged in across browser sessions**,
So that **I can quickly access my workspace without re-authenticating each time**.

**Acceptance Criteria:**

**Given** an unauthenticated user navigates to any protected route
**When** the route guard detects no valid session
**Then** the user is redirected to the login page at `/login`

**Given** the user is on the login page
**When** they see the page
**Then** two sign-in buttons are displayed: "Sign in with Google" and "Sign in with GitHub"
**And** all text uses i18n keys (`t('auth.loginTitle')`, etc.) and displays correctly in both English and French
**And** the page follows MUI styling exclusively (no CSS files, no inline styles)

**Given** the user clicks "Sign in with Google" (or GitHub)
**When** the OAuth flow initiates
**Then** the browser redirects to the OAuth provider's authorization page

**Given** the OAuth provider redirects back with an authorization code
**When** the auth callback page (`/auth/callback`) processes the response
**Then** the frontend exchanges the code with the backend, stores the access token in memory (TanStack Query / Zustand), and redirects the user to the dashboard route `/`

**Given** the user has a valid session
**When** they close and reopen the browser
**Then** the refresh token cookie automatically refreshes the access token and the user sees the authenticated app without re-logging in (FR3)

**Given** the user clicks "Sign out"
**When** the sign-out action is triggered
**Then** the frontend calls `POST /api/v1/auth/sign-out`, clears local auth state, and redirects to the login page

**Given** any API call returns a 401 error
**When** the TanStack Query error handler processes it
**Then** it first attempts a token refresh; if that also fails, the user is redirected to the login page

**Given** the app layout is rendered
**When** an authenticated user views the shell
**Then** a minimal app layout is displayed with a header (app name, language switcher, theme toggle light/dark, sign-out button) and a main content area
**And** MUI Skeleton loading states are shown while data loads

### Story 1.5: Workspace Auto-Creation & Tenant Isolation

As a **new user**,
I want **my personal workspace to be automatically created when I first sign in**,
So that **I can start using the application immediately without any setup**.

**Acceptance Criteria:**

**Given** a user authenticates for the very first time (new user record created)
**When** the authentication flow completes
**Then** a workspace is automatically created with the user's name as the default workspace name
**And** the workspace ID is associated with the user record

**Given** the user already has a workspace
**When** they sign in again
**Then** no duplicate workspace is created; the existing workspace is used

**Given** the `WorkspaceGuard` is globally registered
**When** any request hits a protected endpoint (except `/auth/*` and `/health`)
**Then** the guard extracts the user's `workspaceId` from their JWT/user context and injects it into the request
**And** subsequent service calls include `WHERE workspaceId = ?` automatically

**Given** User A and User B each have their own workspace
**When** User A sends a request to any data endpoint
**Then** only User A's workspace data is returned — User B's data is never visible, even if User A manipulates request parameters (FR10, NFR8)

**Given** the `WorkspaceGuard` cannot determine a workspace for the authenticated user
**When** the request proceeds
**Then** the server responds with HTTP 403 and an RFC 7807 error body

### Story 1.6: Marketing Landing Page

As an **unauthenticated visitor**,
I want **to view a public landing page describing the product**,
So that **I can understand the value proposition before signing up**.

**Acceptance Criteria:**

**Given** an unauthenticated user navigates to the root URL `/`
**When** they are not signed in
**Then** a public marketing landing page is displayed (not the authenticated dashboard)
**And** the page is accessible without any authentication

**Given** the landing page is displayed
**When** the visitor views it
**Then** it contains: a product headline and value proposition, key feature highlights, and a prominent call-to-action button leading to the login page
**And** all text uses i18n keys and displays correctly in English and French

**Given** the landing page is loaded
**When** inspecting performance
**Then** the page meets NFR2 targets (FCP < 1.5s, LCP < 2.5s on a 4G connection)

**Given** a visitor on the landing page clicks the sign-up/sign-in CTA
**When** the action triggers
**Then** the visitor is redirected to the `/login` page

---

## Epic 2: Subject & Task Management

A user can create subjects to organize their work, create and manage tasks with a complete lifecycle (open → in progress → completed/cancelled/archived), and consult the full chronological history of every action taken on a task.

### Story 2.1: Subject CRUD Backend

As a **user**,
I want **an API to create, rename, archive, and list my subjects with task counts**,
So that **I can organize my tasks into meaningful groups that reflect my work streams**.

**Acceptance Criteria:**

**Given** the database schema is ready
**When** Drizzle migrations for this story are executed
**Then** a `subjects` table is created with: id (UUID PK), workspaceId (FK), name (string, required), isArchived (boolean, default false), createdAt (timestamp with timezone), updatedAt (timestamp with timezone)
**And** an index `idx_subjects_workspaceId` exists
**And** Zod schemas for subject creation and update are defined in `packages/shared`

**Given** an authenticated user with a workspace
**When** a `POST /api/v1/subjects` request is sent with `{ name: "Client A" }`
**Then** a new subject is created in the user's workspace and returned with HTTP 201 in the response envelope `{ data: { id, name, isArchived, createdAt, updatedAt } }`
**And** the subject's `workspaceId` is automatically set from the `WorkspaceGuard`

**Given** an existing subject in the user's workspace
**When** a `PATCH /api/v1/subjects/:subjectId` request is sent with `{ name: "Client B" }`
**Then** the subject is renamed and the updated record is returned with HTTP 200

**Given** an existing active subject
**When** a `PATCH /api/v1/subjects/:subjectId` request is sent with `{ isArchived: true }`
**Then** the subject is archived (removed from active view) but its data and associated tasks are preserved

**Given** an authenticated user
**When** a `GET /api/v1/subjects` request is sent
**Then** all active (non-archived) subjects for the user's workspace are returned with their associated active task counts
**And** the response follows the envelope format `{ data: [{ id, name, isArchived, taskCount, createdAt, updatedAt }] }`

**Given** a `GET /api/v1/subjects?includeArchived=true` request is sent
**When** the query includes archived subjects
**Then** both active and archived subjects are returned

**Given** a subject creation request with an empty or missing name
**When** the Zod validation pipe processes the request
**Then** the server responds with HTTP 422 and an RFC 7807 error with details about the invalid field

**Given** a user tries to access a subject from another user's workspace
**When** the `WorkspaceGuard` filters the query
**Then** the server responds with HTTP 404 (subject not found) — never revealing the subject exists in another workspace

### Story 2.2: Subject Management UI

As a **user**,
I want **a visual interface to create, rename, and archive my subjects**,
So that **I can organize my work streams without leaving the application**.

**Acceptance Criteria:**

**Given** an authenticated user on the main application view
**When** they access the subject management area (sidebar or dedicated section)
**Then** a list of all active subjects is displayed with their names and task counts
**And** archived subjects are hidden by default with an option to show them

**Given** the user clicks "Create Subject" (or equivalent action)
**When** a form/input appears
**Then** the user can type a subject name and submit it
**And** on success, a Snackbar confirms creation and the subject list updates immediately (optimistic update via TanStack Query)
**And** on validation error, the error is displayed inline below the field in error color

**Given** the user clicks on a subject name in the list
**When** inline editing activates
**Then** the name becomes an editable TextField (MUI Outlined)
**And** pressing Enter saves the rename (optimistic update)
**And** pressing Escape cancels the edit
**And** on success, a Snackbar confirms the rename

**Given** the user triggers the archive action on a subject
**When** a confirmation dialog appears
**Then** upon confirmation, the subject is archived and removed from the active list (optimistic update)
**And** a Snackbar confirms the archival

**Given** no subjects exist yet (first-time user)
**When** the subject list is empty
**Then** an empty state message is displayed: "Create your first subject to organize your tasks"
**And** a prominent create action is highlighted

**Given** all subject management interactions
**When** any action is performed
**Then** all text uses i18n keys, MUI styling exclusively (no CSS files, no inline styles), and Zod schemas from `packages/shared` for frontend validation (onBlur)

### Story 2.3: Task CRUD Backend

As a **user**,
I want **an API to create, read, update, and list tasks with full and quick-capture modes**,
So that **I can capture work items quickly and refine them later**.

**Acceptance Criteria:**

**Given** the database schema is ready
**When** Drizzle migrations for this story are executed
**Then** a `tasks` table is created with: id (UUID PK), workspaceId (FK), subjectId (FK to subjects), title (string, required), description (string, nullable), status (enum: Open/InProgress/Completed/Cancelled/Archived, default Open), priorityLevel (enum: Low/Normal/High/Urgent, default Normal), estimatedDuration (integer minutes, nullable), deadline (timestamp with timezone, nullable), isPinned (boolean, default false), pinnedPosition (integer, nullable), priorityScore (decimal, nullable), displayOrder (integer), parentTaskId (UUID FK self-reference, nullable), createdAt (timestamp with timezone), updatedAt (timestamp with timezone)
**And** indexes exist: `idx_tasks_workspaceId`, `idx_tasks_subjectId`, `idx_tasks_status`, `idx_tasks_parentTaskId`
**And** Zod schemas for task creation (full + quick-capture) and task update are defined in `packages/shared`

**Given** an authenticated user with at least one subject
**When** a `POST /api/v1/tasks` request is sent with full fields: `{ title, description, subjectId, estimatedDuration, priorityLevel, deadline }`
**Then** a new task is created with status "Open" and returned with HTTP 201 in the response envelope
**And** `workspaceId` is set from the `WorkspaceGuard`

**Given** minimal input (quick-capture mode)
**When** a `POST /api/v1/tasks` request is sent with only `{ title }` (or `{ title, subjectId }`)
**Then** the task is created with defaults: status=Open, priorityLevel=Normal, other optional fields null
**And** if no `subjectId` is provided, a default/unassigned handling is applied

**Given** an existing open or in-progress task
**When** a `PATCH /api/v1/tasks/:taskId` request is sent with updated fields
**Then** only the provided fields are updated, the `updatedAt` timestamp is refreshed, and the updated task is returned

**Given** a task update changes the `subjectId`
**When** the reassignment is processed
**Then** the task is reassigned to the new subject within the same workspace
**And** the task's other properties remain unchanged

**Given** an authenticated user
**When** a `GET /api/v1/tasks` request is sent
**Then** all tasks for the workspace are returned with support for query parameters: `?status=Open,InProgress`, `?subjectId=...`, `?includeCompleted=true`

**Given** a `GET /api/v1/tasks/:taskId` request is sent
**When** the task exists in the user's workspace
**Then** the full task record is returned including all fields

**Given** a task creation with a missing title
**When** the Zod validation pipe processes the request
**Then** the server responds with HTTP 422 and RFC 7807 error details

**Given** a request references a subjectId from another workspace
**When** the service validates the subject ownership
**Then** the server responds with HTTP 404 (subject not found)

### Story 2.4: Task Creation & Editing UI

As a **user**,
I want **to create tasks with a full form or quick-capture mode, and edit task properties inline**,
So that **I can capture ideas instantly and refine details when I have time**.

**Acceptance Criteria:**

**Given** the user is on the main application view
**When** they click the global `+` FAB button or press the `N` keyboard shortcut
**Then** a quick-capture input appears: a single text field for the title
**And** pressing Enter creates the task with defaults (priorityLevel: Normal, no deadline)
**And** the new task appears immediately in the task list (optimistic update)

**Given** a task was just created via quick-capture
**When** the task card is in its focused state
**Then** quick-qualification controls are visible: importance dropdown and deadline selector (Today, Tomorrow, End of Week, Next Week, Specific Date)
**And** modifying these fields updates the task via `PATCH` (optimistic update)

**Given** the user wants to create a task with full details
**When** they access the full task creation form
**Then** they can fill in: title (required), description, subject (dropdown of active subjects), estimated duration, priority level (Low/Normal/High/Urgent), and deadline (date picker limited to future dates)
**And** the form uses MUI Outlined TextFields with onBlur Zod validation
**And** the submit button is disabled until required fields are valid

**Given** an existing task card in the list
**When** the user clicks on the task title
**Then** inline editing activates — the title becomes an editable TextField
**And** Enter saves, Escape cancels
**And** other task properties are editable through a task detail view or expanded card

**Given** the user wants to reassign a task to a different subject
**When** they change the subject dropdown on the task
**Then** the task is reassigned (optimistic update) and moves to the new subject grouping

**Given** any task creation or edit action
**When** the operation succeeds
**Then** a success Snackbar is displayed for 3-4 seconds
**When** the operation fails
**Then** the error is displayed (inline for validation errors, Snackbar for server errors)

**Given** no tasks exist yet (empty state)
**When** the task list area is empty
**Then** a welcome message is displayed: "Ready to organize your day? Click + to create your first task"
**And** the FAB button is visually highlighted

### Story 2.5: Task State Machine & Lifecycle Backend

As a **user**,
I want **tasks to follow a strict lifecycle with proper state transitions and mandatory comments for cancellation and archival**,
So that **every decision is traceable and no task silently disappears**.

**Acceptance Criteria:**

**Given** the task state machine service exists
**When** a state transition is requested
**Then** only valid transitions are allowed: Open → InProgress, InProgress → Completed, Open/InProgress → Cancelled, Open/InProgress/Completed → Archived
**And** invalid transitions return HTTP 422 with RFC 7807 error: `{ detail: "Cannot transition from {current} to {target}" }`

**Given** an open task
**When** a `PATCH /api/v1/tasks/:taskId/status` request is sent with `{ status: "InProgress" }`
**Then** the task transitions to InProgress, `updatedAt` is refreshed, and the updated task is returned

**Given** an in-progress task
**When** a `PATCH /api/v1/tasks/:taskId/status` request is sent with `{ status: "Completed" }`
**Then** the task transitions to Completed and the state change is persisted atomically (NFR19)

**Given** a task to be cancelled
**When** a `PATCH /api/v1/tasks/:taskId/status` request is sent with `{ status: "Cancelled" }` without a comment
**Then** the server responds with HTTP 422: "Comment is mandatory for cancellation"

**Given** a task to be cancelled with a comment
**When** a `PATCH /api/v1/tasks/:taskId/status` request is sent with `{ status: "Cancelled", comment: "Client changed scope" }`
**Then** the task transitions to Cancelled and the comment is persisted

**Given** a task to be archived
**When** a `PATCH /api/v1/tasks/:taskId/status` request is sent with `{ status: "Archived" }` without a comment
**Then** the server responds with HTTP 422: "Comment is mandatory for archival"

**Given** a task in a terminal state (Completed, Cancelled)
**When** any state transition is attempted
**Then** the server responds with HTTP 422: "Cannot transition from a terminal state"

**Given** an existing task
**When** a `DELETE /api/v1/tasks/:taskId` request is sent
**Then** the task is permanently deleted from the database
**And** this is a separate, intentional action distinct from cancel/archive

**Given** a task with a terminal state (Completed, Cancelled, or permanently deleted)
**When** any mutation is attempted
**Then** the action is rejected — terminal states are irreversible (FR34)

### Story 2.6: Task State Management UI

As a **user**,
I want **visual controls to manage task states, with mandatory comment dialogs for cancellation and archival**,
So that **I can confidently manage my task lifecycle with full traceability**.

**Acceptance Criteria:**

**Given** a task card is displayed
**When** the user views it
**Then** the task's current state is visually distinguished (distinct colors/icons for Open, InProgress, Completed, Cancelled, Archived) per FR42

**Given** an open task
**When** the user clicks "Start" (or equivalent action)
**Then** the task transitions to InProgress with an optimistic update and a success Snackbar

**Given** an in-progress task
**When** the user clicks "Complete"
**Then** the task transitions to Completed with an optimistic update and satisfying visual feedback

**Given** the user triggers "Cancel" on a task
**When** the cancel action is initiated
**Then** a dialog appears requiring a mandatory comment field (MUI Outlined TextField)
**And** the "Confirm Cancel" button is disabled until a comment is entered
**And** on confirmation, the task is cancelled with the comment (optimistic update)

**Given** the user triggers "Archive" on a task
**When** the archive action is initiated
**Then** a dialog appears requiring a mandatory comment field
**And** the "Confirm Archive" button is disabled until a comment is entered
**And** on confirmation, the task is archived with the comment

**Given** the user triggers "Delete" on a task
**When** the delete action is initiated
**Then** a confirmation dialog warns: "This action is permanent and cannot be undone"
**And** on confirmation, the task is permanently deleted

**Given** the user wants to see completed and cancelled tasks
**When** they apply the appropriate filter (FR35)
**Then** a filterable list/view shows all completed and cancelled tasks with their final state and associated comments

**Given** a task in a terminal state is displayed
**When** the user views it
**Then** all mutation controls are disabled/hidden — only viewing is permitted

### Story 2.7: Activity Log & Traceability

As a **user**,
I want **a complete chronological history of every action on my tasks, with optional comments on most actions and mandatory comments on cancel/archive**,
So that **I can always understand why a task was modified, split, or cancelled**.

**Acceptance Criteria:**

**Given** the database schema is ready
**When** Drizzle migrations for this story are executed
**Then** an `activityLogs` table is created with: id (UUID PK), taskId (FK), workspaceId (FK), action (enum: Created/Updated/StatusChanged/Split/ManualOverride/Deleted), previousValue (JSONB, nullable), newValue (JSONB, nullable), comment (string, nullable), createdAt (timestamp with timezone)
**And** an index `idx_activityLogs_taskId` exists

**Given** any task action occurs (creation, edit, state change, or future split/override)
**When** the service layer processes the mutation
**Then** an activity log entry is automatically written with the action type, previous/new values, and optional comment
**And** the log entry is persisted in the same transaction as the action (atomic, NFR19)

**Given** a task is created
**When** the creation completes
**Then** an activity log entry with action "Created" is written with the initial task data as `newValue`

**Given** a task field is edited
**When** the edit completes
**Then** an activity log entry with action "Updated" is written with `previousValue` and `newValue` capturing the changed fields

**Given** a task state change occurs
**When** the transition completes
**Then** an activity log entry with action "StatusChanged" is written with `previousValue: { status: "Open" }` and `newValue: { status: "InProgress" }` and the associated comment (mandatory for cancel/archive, optional otherwise)

**Given** an authenticated user
**When** a `GET /api/v1/tasks/:taskId/activity-log` request is sent
**Then** the complete chronological activity log for that task is returned, ordered by `createdAt` ascending
**And** the response follows the envelope format

**Given** any task mutation endpoint
**When** the request includes an optional `comment` field
**Then** the comment is stored in the activity log entry for that action

**Given** the user views a task detail
**When** they expand the activity log section
**Then** the complete chronological history is displayed with: timestamp, action type, previous/new values summary, and comment (if any)
**And** entries are displayed in chronological order (oldest first)

---

## Epic 3: Intelligent Dashboard & Prioritization

A user sees their tasks intelligently ordered on a time-based Kanban board (day view + 5-day view), and every modification automatically recalculates the optimal execution plan within 2 seconds.

### Story 3.1: Re-Prioritization Engine Backend

As a **user**,
I want **the system to automatically calculate a priority score for every active task and re-order them whenever anything changes**,
So that **my plan always reflects the optimal execution sequence without manual effort**.

**Acceptance Criteria:**

**Given** the prioritization module exists as a replaceable component in `modules/prioritization/`
**When** the `priority-calculator.ts` computes a score for a task
**Then** the score is calculated using the weighted formula: Impact 50% + Deadline Urgency 30% + Effort Efficiency 20%
**And** Impact maps from the task's `priorityLevel` (Urgent=1.0, High=0.75, Normal=0.5, Low=0.25)
**And** Deadline Urgency increases as the deadline approaches (1.0 = overdue/today, 0.0 = no deadline)
**And** Effort Efficiency favors shorter tasks when priority is otherwise equal (shorter = higher efficiency)
**And** the algorithm is implemented as a pure function with configurable weights (stored in `packages/shared/constants/priority-weights.ts`)

**Given** any task mutation occurs (create, edit, state change)
**When** the `task.service` completes the persistence
**Then** it calls `prioritization.service.recalculate(workspaceId)` automatically
**And** the engine loads ALL active tasks (status Open or InProgress) for the workspace
**And** computes `priorityScore` for each task
**And** assigns `displayOrder` based on score ranking (highest score = position 1)
**And** tasks with `isPinned = true` retain their `pinnedPosition` and are excluded from reordering
**And** updated scores and positions are persisted to the database

**Given** a workspace with 50+ active tasks
**When** re-prioritization is triggered
**Then** the entire recalculation completes within 2 seconds (NFR1, FR18)

**Given** the re-prioritization completes
**When** the API response is returned to the caller
**Then** the response includes the full updated task list with new `priorityScore` and `displayOrder` values
**And** the response includes `meta.reprioritized: true` to signal the frontend that order changed

**Given** two tasks have identical `priorityScore`
**When** the engine assigns `displayOrder`
**Then** the tie-breaking order is: earlier deadline first, then shorter estimated duration first, then earlier `createdAt` first

**Given** the re-prioritization engine encounters an error
**When** the dashboard is requested
**Then** it falls back to the last known `displayOrder` (graceful degradation, NFR21)
**And** the error is logged via NestJS Logger with structured context

**Given** an activity log entry is needed
**When** re-prioritization changes task positions
**Then** no individual activity log entries are created for automatic position changes (only manual overrides and explicit user actions generate log entries)

### Story 3.2: Time-Based Kanban Board — Day View

As a **user**,
I want **to see my tasks organized on a time-based Kanban board where today's column shows tasks in priority order**,
So that **I immediately know what to work on next when I open the app**.

**Acceptance Criteria:**

**Given** an authenticated user with tasks
**When** they navigate to the dashboard (`/`)
**Then** a `TimeBasedKanbanBoard` component renders with columns representing days (Today, Tomorrow, and subsequent days)
**And** each column displays tasks distributed based on their deadline and `displayOrder`
**And** tasks with no deadline appear in a "No Date" section or are distributed by the engine

**Given** the board loads
**When** tasks are fetched via TanStack Query
**Then** MUI Skeleton loading states mimic the Kanban structure while data loads
**And** once loaded, `TaskCard` components render within their respective day columns

**Given** a `TaskCard` is displayed
**When** the user views it
**Then** it shows: title (always visible), priority level (colored icon), deadline (text: "Today", "Tomorrow", "Feb 28"), and status indicator
**And** task states are visually distinguished with distinct colors/icons (Open, InProgress, Completed, Cancelled, Archived) per FR42

**Given** a `TaskCard` in default state
**When** the user hovers over it (desktop)
**Then** the card scales up slightly (`scale: 1.03`) and reveals action buttons (Edit, status change actions)

**Given** the day view is displayed
**When** the user views column headers
**Then** each column header shows the day name, date, and task count

**Given** the dashboard is loaded
**When** tasks are presented within the Today column
**Then** they appear in `displayOrder` (priority-calculated order, FR17)

**Given** a user on mobile (< 768px breakpoint)
**When** they view the board
**Then** columns scroll horizontally with the Today column visible first
**And** TaskCards are compact with touch-friendly sizing

**Given** the board is rendered
**When** the first meaningful paint occurs
**Then** FCP is < 1.5s and LCP is < 2.5s on a 4G connection (NFR2)

**Given** all board interactions
**When** rendered
**Then** all text uses i18n keys, MUI styling exclusively (`sx` prop and `styled()` only), and respects `prefers-reduced-motion` for animations (NFR26)

### Story 3.3: Five-Day Planning View

As a **user**,
I want **to see a 5-day forward planning window to understand my upcoming workload**,
So that **I can anticipate capacity issues and make proactive decisions about my schedule**.

**Acceptance Criteria:**

**Given** the user is on the dashboard
**When** they toggle from day view to 5-day view (FR45)
**Then** the `TimeBasedKanbanBoard` expands to show 5 columns representing the next 5 days
**And** tasks are distributed across day columns based on their deadline and priority order

**Given** the 5-day view is displayed with the default setting
**When** the user views the columns
**Then** columns represent business days only (Monday–Friday), skipping weekends

**Given** the user toggles the "Include weekends" option (FR54)
**When** the toggle is activated
**Then** the 5-day view shows all consecutive days (including Saturday and Sunday)
**And** the toggle preference is persisted in Zustand store (and localStorage)

**Given** the 5-day view is active
**When** tasks span across multiple days
**Then** each day column shows only the tasks assigned to that day
**And** overflow is indicated if a day has more tasks than fit visually

**Given** overdue tasks exist (deadline in the past)
**When** the dashboard loads
**Then** an `OverdueTaskNotification` component appears with: "You have X overdue tasks"
**And** two actions are offered: "Re-plan All for Me" (system re-distributes) and "Manage Manually" (shows overdue tasks in context)

**Given** the user clicks "Re-plan All for Me" on the overdue notification
**When** the action triggers
**Then** all overdue tasks are re-evaluated by the engine (deadlines removed or updated to today) and redistributed into the plan
**And** the board animates to show the new positions

**Given** the user switches between day view and 5-day view
**When** the toggle is clicked
**Then** the transition is smooth with no full page reload
**And** the selected view preference is persisted in Zustand/localStorage

**Given** a tablet screen (768–1023px)
**When** the 5-day view is displayed
**Then** all 5 columns are visible with touch-friendly spacing

**Given** a mobile screen (< 768px)
**When** the 5-day view is displayed
**Then** columns scroll horizontally with Today as the default visible column

### Story 3.4: Dashboard Filtering & Re-Prioritization Feedback

As a **user**,
I want **to filter my tasks by subject, state, or priority, and see visual feedback when tasks shift positions after re-prioritization**,
So that **I can focus on specific work streams and understand how my plan adapts to changes**.

**Acceptance Criteria:**

**Given** the dashboard is displayed
**When** the user accesses the filter controls
**Then** filter options are available for: subject (dropdown of active subjects), status (multi-select: Open, InProgress, Completed, Cancelled), and priority level (multi-select: Low, Normal, High, Urgent)

**Given** the user selects a subject filter
**When** the filter is applied
**Then** only tasks belonging to that subject are displayed on the board
**And** the filter is applied client-side (no API call needed since all active tasks are already loaded)

**Given** the user selects a status filter
**When** the filter is applied
**Then** only tasks with the selected statuses are displayed

**Given** the user selects a priority filter
**When** the filter is applied
**Then** only tasks with the selected priority levels are displayed

**Given** multiple filters are active simultaneously
**When** the board is rendered
**Then** filters are combined with AND logic (e.g., Subject=ClientA AND Status=Open)
**And** active filters are visually indicated with a clear "Reset Filters" option

**Given** a filter results in no matching tasks
**When** the filtered board is empty
**Then** a clear message is displayed: "No tasks match your filters" with a "Reset Filters" button

**Given** the user adds a new task or modifies an existing task
**When** re-prioritization completes and the API returns `meta.reprioritized: true`
**Then** TanStack Query cache is invalidated and the board re-renders
**And** TaskCards that changed position animate smoothly to their new positions (< 150ms per UX spec)
**And** the repositioning animation serves as the visual indicator that re-planning occurred (FR43)

**Given** a user with `prefers-reduced-motion` enabled
**When** re-prioritization repositions cards
**Then** cards move to new positions instantly without animation (NFR26)

**Given** the filter state
**When** the user navigates away and returns to the dashboard
**Then** filter preferences are preserved in Zustand store for the session

---

## Epic 4: Manual Override & Drag-and-Drop

A user can take manual control of task ordering via drag & drop, with a pinning system that protects their choices against automatic recalculation while remaining transparent about suggested alternatives.

### Story 4.1: Drag & Drop Reordering with @dnd-kit

As a **user**,
I want **to manually reorder my tasks within the daily view via drag and drop**,
So that **I can take direct control of my execution sequence when I know better than the algorithm**.

**Acceptance Criteria:**

**Given** the `TimeBasedKanbanBoard` is displayed on desktop or tablet
**When** the user clicks and drags a `TaskCard`
**Then** the card becomes semi-transparent (dragging state) and a drop indicator shows the target position
**And** visual feedback appears within 100ms of the drag start (NFR4)

**Given** the user drops a `TaskCard` at a new position within the same day column
**When** the drop completes
**Then** the card is placed at the new position (optimistic update)
**And** a `PATCH /api/v1/tasks/:taskId/reorder` request is sent with the new `displayOrder` and `isPinned: true`
**And** an inactive "pin" icon appears on the card

**Given** the user drops a `TaskCard` into a different day column
**When** the drop completes
**Then** the task's deadline is updated to match the target day
**And** the task is positioned at the drop location within that column
**And** a `PATCH` request updates both `deadline` and `displayOrder` with `isPinned: true`

**Given** a task has been manually repositioned
**When** the system detects the override (FR20)
**Then** the task's `isPinned` flag is set to `true` in the database
**And** the `TaskCard` displays the pin icon (inactive by default, user can click to activate)
**And** an activity log entry with action "ManualOverride" is created with the previous and new positions

**Given** the user uses keyboard navigation (NFR24)
**When** a `TaskCard` has focus
**Then** arrow keys (Up/Down) move the focused indicator, and Enter + arrow keys reorder the task
**And** this alternative to drag & drop makes the reordering keyboard-accessible

**Given** @dnd-kit is configured
**When** multiple cards are reordered
**Then** surrounding cards animate smoothly to accommodate the new positions (< 150ms)
**And** animations respect `prefers-reduced-motion` (NFR26)

**Given** a drag & drop interaction
**When** the backend `PATCH` fails
**Then** the optimistic update is rolled back — the card returns to its original position
**And** an error Snackbar is displayed

### Story 4.2: Pin Protection & Override Notifications

As a **user**,
I want **my manually positioned tasks to be protected from automatic re-prioritization, with clear notifications when the system suggests a different position**,
So that **I can trust that my deliberate arrangements are respected while staying informed about the system's recommendations**.

**Acceptance Criteria:**

**Given** a task has `isPinned = true`
**When** the re-prioritization engine runs (`prioritization.service.recalculate`)
**Then** the pinned task retains its `pinnedPosition` — the engine NEVER moves it (FR21)
**And** all non-pinned tasks are reordered around the pinned task's fixed position

**Given** a pinned task exists
**When** the engine's calculated optimal position for that task differs from its pinned position
**Then** the API response includes a `pinnedConflicts` array in `meta`: `[{ taskId, pinnedPosition, suggestedPosition }]`

**Given** the frontend receives `pinnedConflicts` in the response meta
**When** the dashboard renders
**Then** a non-intrusive notification appears for each conflicting pinned task: "The system suggests moving [task title] to position [N]. Your override is preserved." (FR22)
**And** the notification includes an action to "Accept suggestion" (unpin and move) or dismiss

**Given** the user clicks "Accept suggestion" on a pin conflict notification
**When** the action triggers
**Then** the task's `isPinned` is set to `false`, `pinnedPosition` is cleared
**And** re-prioritization runs and the task moves to the suggested position
**And** an activity log entry records the override release

**Given** a pinned `TaskCard` is displayed
**When** the user views it
**Then** the pin icon is visually active (filled/highlighted)
**And** the card's left border is highlighted with the primary color as per UX spec
**And** a tooltip on the pin icon explains: "This task is pinned — automatic re-prioritization will not move it"

**Given** the user modifies the `priorityLevel` or `deadline` of a pinned task
**When** the update is processed
**Then** the pin is automatically broken: `isPinned` is set to `false`, `pinnedPosition` is cleared
**And** re-prioritization runs and repositions the task based on the new properties
**And** an activity log entry records "Pin auto-released due to property change"
**And** a Snackbar informs: "Pin released — task repositioned based on new priority/deadline"

### Story 4.3: Pin Release & Mobile Adaptation

As a **user**,
I want **to manually release a pin to return a task to automatic prioritization, and on mobile I want quick-action alternatives to drag & drop**,
So that **I can fluidly switch between manual and automatic control on any device**.

**Acceptance Criteria:**

**Given** a pinned task on desktop/tablet
**When** the user clicks the active pin icon on the `TaskCard`
**Then** a confirmation prompt appears: "Release this pin? The task will be repositioned by the system."
**And** on confirm, `isPinned` is set to `false` and `pinnedPosition` is cleared (FR52)
**And** re-prioritization is triggered immediately and the task moves to its calculated position (FR53)
**And** the pin icon returns to inactive state
**And** an activity log entry records the manual pin release

**Given** the pin is released
**When** the re-prioritization completes
**Then** the task's new position is animated smoothly on the board (< 150ms)
**And** a success Snackbar confirms: "Task returned to automatic prioritization"

**Given** the user is on a mobile device (< 768px breakpoint)
**When** the dashboard is displayed
**Then** drag & drop is DISABLED per UX spec
**And** each `TaskCard` displays quick-action buttons for common operations

**Given** a task on mobile
**When** the user wants to move it to a different day
**Then** a "Move to..." action is available that opens a date/day selector
**And** selecting a day updates the task's deadline and triggers re-prioritization
**And** the task moves to the appropriate column

**Given** a task on mobile
**When** the user wants to change its position within the same day
**Then** "Move Up" / "Move Down" action buttons are available
**And** using these creates a manual override (pin) just like desktop drag & drop

**Given** a pinned task on mobile
**When** the user views it
**Then** the pin icon is visible and tappable
**And** tapping it triggers the same pin release flow as desktop (confirmation → release → re-prioritize)

**Given** all mobile interactions
**When** actions are performed
**Then** all touch targets are at least 44x44px for accessibility
**And** visual feedback is immediate on tap

---

## Epic 5: Task Split & Filiation

A user can split any open or in-progress task into independent sub-tasks while preserving parent-child traceability, enabling fluid reorganization and effective deprioritization of work.

### Story 5.1: Task Split Backend

As a **user**,
I want **an API to split any open or in-progress task into independent sub-tasks with parent-child traceability**,
So that **I can decompose work into manageable pieces without losing the connection to the original task**.

**Acceptance Criteria:**

**Given** an open or in-progress task
**When** a `POST /api/v1/tasks/:taskId/split` request is sent with `{ subtasks: [{ title, description?, priorityLevel?, estimatedDuration?, deadline?, subjectId? }], comment? }`
**Then** the original task's status is set to "Completed" (or a "Split" terminal variant)
**And** N new sub-tasks are created, each with: their own UUID, independent properties (title, description, priorityLevel, estimatedDuration, deadline, subjectId), `parentTaskId` referencing the original task, status "Open"
**And** all sub-tasks are returned in the response with HTTP 201

**Given** a split produces sub-tasks
**When** the sub-tasks are created
**Then** each sub-task has fully independent properties (FR24) — changing one sub-task does not affect its siblings or parent
**And** the `parentTaskId` FK preserves the parent-child relationship (FR25)

**Given** a split request includes a comment
**When** the split completes
**Then** the comment is stored in an activity log entry with action "Split" on the parent task (FR26)
**And** each sub-task gets an activity log entry with action "Created" referencing the split origin

**Given** the split completes successfully
**When** re-prioritization is triggered
**Then** each sub-task participates independently in the re-prioritization engine (FR27)
**And** sub-tasks may end up at different positions and on different days based on their individual properties

**Given** a task in a terminal state (Completed, Cancelled, Archived)
**When** a split is attempted
**Then** the server responds with HTTP 422: "Cannot split a task in terminal state"

**Given** a split request with zero sub-tasks
**When** validation processes the request
**Then** the server responds with HTTP 422: "At least two sub-tasks are required for a split"

**Given** a `GET /api/v1/tasks/:taskId` request for a parent or child task
**When** the task has a filiation relationship
**Then** the response includes `parentTaskId` (for sub-tasks) and `childTasks: [{ id, title, status }]` (for parent tasks) to show the lineage (FR25)

### Story 5.2: Task Split UI

As a **user**,
I want **a dialog to split a task into sub-tasks, with each sub-task getting its own properties, and see the parent-child relationship on the board**,
So that **I can decompose complex work visually and track the origin of each piece**.

**Acceptance Criteria:**

**Given** an open or in-progress `TaskCard`
**When** the user triggers "Split" (from hover actions or task detail)
**Then** a `TaskSplitDialog` opens showing: the original task's title and details, a form to define sub-tasks (default: 2 sub-tasks with pre-filled data from the parent), an "Add Sub-Task" button to create more, and an optional comment field for the split rationale (FR26)

**Given** the split dialog is open
**When** the user defines sub-tasks
**Then** each sub-task has editable fields: title (required), description (optional), priority level (defaults to parent's), estimated duration (optional), deadline (defaults to parent's), subject (defaults to parent's)
**And** the user can modify each field independently per sub-task

**Given** the user confirms the split
**When** the split is submitted
**Then** the dialog closes, the original task card is replaced by the new sub-task cards (optimistic update)
**And** each sub-task card appears at its re-prioritized position on the board
**And** a success Snackbar confirms: "Task split into N sub-tasks"

**Given** a sub-task's `TaskCard` is displayed
**When** the user views it
**Then** a visual indicator shows it was created from a split (e.g., a small "split" icon or "from: [parent title]" link)
**And** clicking the parent reference navigates to the parent task detail

**Given** a parent task that has been split
**When** the user views its detail
**Then** the child sub-tasks are listed with their current status, title, and assigned day
**And** the parent-child lineage is clearly visible (FR25)

**Given** the split dialog
**When** validation fails (e.g., missing title on a sub-task)
**Then** inline errors are shown on the problematic fields (onBlur Zod validation, MUI Outlined TextField with error state)
**And** the "Confirm Split" button is disabled until all required fields are valid

---

## Epic 6: PWA & Offline Experience

A user can install the application on mobile and desktop, and consult their plan offline with a clear disconnected mode indicator and automatic sync on reconnection.

### Story 6.1: PWA Installation & Offline Read-Only Mode

As a **user**,
I want **to install the application on my device and consult my plan even without internet**,
So that **I can check my tasks on the go without depending on connectivity**.

**Acceptance Criteria:**

**Given** the application is loaded in a supported browser
**When** the PWA installation criteria are met (served over HTTPS, has manifest, has service worker)
**Then** the browser offers to install the application (install prompt)
**And** the `manifest.json` in `apps/web/public/` defines: app name, icons (multiple sizes), theme colors matching MUI theme, display mode "standalone"

**Given** the application is installed as a PWA
**When** the user launches it from their home screen or desktop
**Then** the app opens in standalone mode (no browser chrome) with the correct theme colors

**Given** the service worker is registered
**When** the user loads the dashboard with an active connection
**Then** the service worker caches: the application shell (HTML, JS, CSS bundles), the current dashboard data (task list, subjects), and static assets (icons, fonts)
**And** the caching strategy is stale-while-revalidate for task data

**Given** the user loses internet connectivity
**When** they open or refresh the application
**Then** the cached dashboard loads within 1 second (NFR5)
**And** the last known task list is displayed in priority order
**And** all data is read-only — no mutations are permitted

**Given** the application is offline
**When** the user views the dashboard
**Then** a persistent MUI Warning Alert is displayed: "Offline mode — read only" (FR48)
**And** all mutation controls (create, edit, state change, split, drag & drop) are visually disabled
**And** the alert uses i18n keys for both English and French

**Given** the user attempts a mutation while offline
**When** they try to create, edit, or change a task
**Then** the action is blocked with a Snackbar: "This action requires an internet connection"

**Given** the device regains internet connectivity
**When** the online event fires
**Then** the offline alert disappears
**And** TanStack Query automatically refetches and revalidates cached data (FR49)
**And** mutation controls are re-enabled
**And** the user sees the latest data from the server

**Given** the `useOfflineDetection` hook is active
**When** connectivity state changes
**Then** the Zustand UI store is updated with the online/offline status
**And** all dependent components react accordingly

---

## Epic 7: Analytics & Validation Instrumentation

The product team can measure and validate MVP adoption through non-intrusive tracking of key user actions.

### Story 7.1: Lightweight Event Tracking

As a **product owner**,
I want **non-intrusive tracking of key user events to measure MVP adoption and validate success metrics**,
So that **I can make data-driven decisions about product evolution**.

**Acceptance Criteria:**

**Given** the analytics module exists in `modules/analytics/`
**When** key user events occur
**Then** the following events are tracked: `user.signup` (first authentication), `session.start` (each login/app open), `task.created` (with metadata: quick-capture vs full), `task.split` (with count of sub-tasks), `task.reprioritized` (automatic engine trigger), `task.stateChanged` (with from/to states), `task.pinned` (manual override), `task.unpinned` (pin release)

**Given** the frontend `useAnalytics` hook is used
**When** a trackable event occurs in the UI
**Then** the hook sends a `POST /api/v1/analytics/events` request with `{ eventType, metadata, timestamp }`
**And** the request is fire-and-forget — it does not block the UI or await a response

**Given** the analytics endpoint receives an event
**When** the event is processed
**Then** it is persisted to an `analyticsEvents` table: id (UUID PK), userId (FK), eventType (string), metadata (JSONB), createdAt (timestamp with timezone)
**And** the `JwtAuthGuard` protects the endpoint (no `WorkspaceGuard` needed — events are user-scoped)

**Given** event tracking is active
**When** any user interaction occurs
**Then** tracking has zero perceptible impact on application performance (FR51)
**And** tracking requests are batched or debounced if multiple events fire in rapid succession
**And** failed tracking requests are silently discarded — they never surface errors to the user

**Given** the analytics table
**When** querying for MVP validation metrics
**Then** the data supports measuring: sign-up count, WAU, task creation rate per user, split feature usage rate, daily return rate, re-prioritization trigger frequency

**Given** the tracking implementation
**When** inspecting the code
**Then** no personal task content (titles, descriptions, comments) is included in analytics events — only event types, counts, and anonymous metadata
**And** the implementation respects GDPR principles (NFR14)
