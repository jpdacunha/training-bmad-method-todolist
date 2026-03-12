# Story 1.4: Frontend Shell & Authentication UI

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user**,
I want **to see a login page with Google and GitHub sign-in options and remain logged in across browser sessions**,
so that **I can quickly access my workspace without re-authenticating each time**.

## Acceptance Criteria

### AC1: Protected routes redirect unauthenticated users to login
**Given** an unauthenticated user navigates to any protected route  
**When** the route guard detects no valid session  
**Then** the user is redirected to `/login`.

### AC2: Login page provides Google and GitHub actions with i18n + MUI-only UI
**Given** the user is on `/login`  
**When** the page renders  
**Then** two sign-in buttons are shown: Google and GitHub  
**And** all strings use i18n keys and are available in English and French  
**And** styling is MUI-only (no CSS files, no inline `style={{}}`).

### AC3: OAuth flow starts from frontend
**Given** user clicks Google or GitHub login  
**When** OAuth flow starts  
**Then** browser redirects to provider authorization via backend auth endpoint.

### AC4: Callback page exchanges code and authenticates session
**Given** OAuth provider redirects with authorization code  
**When** `/auth/callback` processes the response  
**Then** frontend exchanges with backend, stores access token in memory (TanStack Query/Zustand), and redirects to `/`.

### AC5: Session persistence works across browser restarts
**Given** user had a valid session before closing browser  
**When** app reopens  
**Then** refresh cookie is used to obtain a new access token and user remains authenticated without manual login.

### AC6: Sign-out clears local auth and returns to login
**Given** authenticated user clicks sign out  
**When** sign-out action is triggered  
**Then** frontend calls `POST /api/v1/auth/sign-out`, clears local auth state, and redirects to `/login`.

### AC7: Global 401 handling attempts refresh then redirects
**Given** any API call returns `401`  
**When** TanStack Query error handling runs  
**Then** app attempts token refresh first; if refresh fails, redirects user to `/login`.

### AC8: Minimal authenticated shell is rendered with loading states
**Given** authenticated session  
**When** app shell renders  
**Then** header contains app name, language switcher, theme toggle, sign-out button, plus main content area  
**And** MUI Skeleton is shown while initial data/auth state loads.

## Tasks / Subtasks

- [x] **Task 1: Add frontend auth routing and guard flow** (AC: #1, #4, #5)
  - [x] Define/confirm public routes: `/login`, `/auth/callback`; protected routes behind auth guard.
  - [x] Implement route guard logic to redirect unauthenticated users to `/login`.
  - [x] Add startup auth bootstrap to attempt refresh before marking user unauthenticated.

- [x] **Task 2: Implement login page UI with i18n and MUI-only constraints** (AC: #2, #3)
  - [x] Build `login-page` component with Google/GitHub actions.
  - [x] Ensure all labels/messages come from i18n keys (`en` + `fr`).
  - [x] Keep UI strictly MUI-based (`sx`/`styled` only; no CSS files, no inline style prop).

- [x] **Task 3: Implement OAuth callback page behavior** (AC: #4)
  - [x] Parse callback query params safely.
  - [x] Exchange callback payload with backend auth endpoint.
  - [x] Persist access token in memory store and navigate to `/` on success.
  - [x] Display deterministic error state (RFC 7807-derived messaging via i18n) on failure.

- [x] **Task 4: Implement token lifecycle in frontend API layer** (AC: #5, #7)
  - [x] Add API client auth interceptor/wrapper for bearer token injection.
  - [x] Implement refresh flow using cookie-backed `POST /api/v1/auth/refresh`.
  - [x] Add one-retry policy on `401` (refresh then replay), then hard redirect to `/login`.

- [x] **Task 5: Implement sign-out UX + endpoint integration** (AC: #6, #8)
  - [x] Add sign-out action in authenticated header.
  - [x] Call backend sign-out endpoint, clear in-memory auth state, invalidate relevant query caches.
  - [x] Redirect to `/login` and ensure protected routes no longer accessible.

- [x] **Task 6: Build minimal authenticated app shell** (AC: #8)
  - [x] Ensure header includes app name, language switcher, theme toggle, and sign-out.
  - [x] Render main content outlet/layout container.
  - [x] Show MUI Skeleton during initial auth/bootstrap loading.

- [x] **Task 7: Add focused frontend tests** (AC: #1, #2, #4, #5, #6, #7, #8)
  - [x] Route guard tests for unauthenticated redirect.
  - [x] Login page rendering tests (two provider buttons + i18n keys).
  - [x] Callback success/failure tests.
  - [x] API `401` refresh-and-retry behavior test.
  - [x] Sign-out flow test (API call + local state clear + redirect).

## Dev Notes

### Story Foundation

- This story depends on Story 1.3 backend auth APIs being available (`/api/v1/auth/login/*`, `/callback/*`, `/refresh`, `/sign-out`).
- Scope is frontend shell + auth UX orchestration only; do not re-implement backend auth logic in frontend.

### Technical Requirements

- Frontend stack: React + Vite + TypeScript + React Router v7.
- Server state and request lifecycle: TanStack Query.
- Client auth/UI state: Zustand (minimal state only).
- i18n: `react-i18next` with `en` and `fr`; no hardcoded user-visible strings.
- Styling rule is strict: MUI only, no CSS files, no inline `style={{}}`.

### Architecture Compliance

- Keep API-first separation: frontend consumes backend auth endpoints only.
- Keep business logic out of presentational components (extract hooks/services where needed).
- Follow existing naming conventions: kebab-case files, camelCase/PascalCase symbols.
- Error handling must stay aligned with RFC 7807 payloads surfaced by backend.

### Library / Framework Requirements

- `react-router-dom` for guarded route flows and redirect logic.
- `@tanstack/react-query` for API calls, retry strategy, and global `401` handling.
- `zustand` for token/session flags and UI-level auth state.
- `react-i18next` for all labels/messages on login/shell.
- MUI components and theme primitives for all visual elements.

### File Structure Requirements

- Expected frontend touchpoints (minimum):
  - `apps/web/src/features/auth/login-page.tsx`
  - `apps/web/src/features/auth/auth-callback.tsx`
  - `apps/web/src/features/auth/use-auth.ts`
  - `apps/web/src/api/api-client.ts`
  - `apps/web/src/layouts/app-layout.tsx`
  - `apps/web/src/routes.tsx`
  - `apps/web/src/locales/en.json` and `apps/web/src/locales/fr.json` (auth/shell keys)
- Keep tests co-located next to updated components/hooks.

### Testing Requirements

- Add Vitest + RTL coverage for route guard, login page, callback handling, and sign-out.
- Validate refresh-on-401 flow with deterministic mock API behavior.
- Validate i18n rendering for both languages on auth shell surfaces.

### Previous Story Intelligence (1.3)

- Backend auth contract is now defined with JWT access + refresh-cookie rotation and RFC 7807 errors.
- Frontend should trust backend as source of truth for token validity; avoid duplicate token validation logic client-side.
- Expected successful UX pattern: refresh on expired access token, then continue user flow transparently.

### Git Intelligence Summary

- Project history follows strict story-by-story progression and synchronized updates to implementation artifacts + sprint status.
- Existing scaffold already includes `app-layout`, `routes`, i18n bootstrap, and state stores, so extend those instead of adding parallel structures.

### Latest Technical Information

- React Router v7 + TanStack Query are already selected in architecture and should remain the routing/data primitives.
- No dependency upgrade work is required in this story unless a missing package blocks AC implementation.

### Project Context Reference

- No `project-context.md` file was discovered in this repository.
- Canonical context for this story:
  - `_bmad-output/planning-artifacts/epics.md` (Story 1.4)
  - `_bmad-output/planning-artifacts/architecture.md` (frontend architecture + enforcement rules)
  - `_bmad-output/planning-artifacts/prd.md` (FR1–FR4, FR3 persistence requirement)
  - `_bmad-output/planning-artifacts/ux-design-specification.md` (auth UX principles)
  - `_bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md` (previous story contract)

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.4)
- Source: `_bmad-output/planning-artifacts/architecture.md` (frontend architecture + enforcement guidelines)
- Source: `_bmad-output/planning-artifacts/prd.md` (authentication/session FRs)
- Source: `_bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md`

## Story Completion Status

- Status set to **done**.
- All 7 tasks and all subtasks completed.
- All 20 frontend tests pass (6 test files, 0 failures).
- Full regression suite passed (API: 24/24, Shared: 7/7, Web: 20/20).
- ESLint: 0 errors.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 1.4)
- Prior story intelligence: `_bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md`

### Completion Notes List

- Selected next backlog story automatically from sprint status: `1-4-frontend-shell-and-authentication-ui`.
- Extracted story acceptance criteria and architecture guardrails focused on frontend auth flow.
- Generated ready-for-dev implementation artifact with concrete tasks, constraints, and test expectations.
- **Implementation complete (2026-03-12):**
  - Task 1: Created `AuthGuard` component with `Navigate` redirect and bootstrap skeleton. Updated `routes.tsx` with public/protected route structure and `useAuthBootstrap` hook.
  - Task 2: Built `LoginPage` with two MUI provider buttons (Google/GitHub), i18n keys in en/fr, no CSS files or inline styles.
  - Task 3: Created `AuthCallback` page that parses `code`/`state` query params, exchanges with backend via `sessionStorage`-tracked provider, persists token in Zustand, shows i18n error states.
  - Task 4: Built `apiClient` with Bearer token injection, 401 interception, single-flight refresh deduplication via promise caching, one-retry-then-redirect policy.
  - Task 5: Added Logout icon button in `AppLayout` header, wired `useSignOut` hook that calls `POST /api/v1/auth/sign-out`, clears QueryClient + auth store, redirects to `/login`.
  - Task 6: Extended `AppLayout` with sign-out button alongside existing app title, language switcher, theme toggle. Auth guard shows MUI Skeleton during bootstrap.
  - Task 7: Created 5 co-located test files with 18 new tests covering all ACs. Updated existing `app.test.tsx` (2 tests) for auth-aware rendering.
  - **Senior code review fixes applied (2026-03-12):**
    - Added global unauthorized handling wiring in TanStack Query (`QueryCache` + `MutationCache`) through `handleGlobalUnauthorizedError`.
    - Removed never-resolving promise behavior from API client on refresh failure and replaced with deterministic redirect + explicit error throw.
    - Implemented deterministic RFC 7807-derived callback error mapping (`401` → specific i18n key) and added localized messages (en/fr).
    - Stabilized callback async test behavior to eliminate warning-prone flow and updated API client failure test for explicit rejection semantics.

### Change Log

- 2026-03-12: Implemented complete frontend authentication shell — auth guard, login page, OAuth callback, API client with 401 refresh, sign-out flow, app layout sign-out button, and comprehensive test coverage (20 tests, 6 files). All acceptance criteria satisfied.
- 2026-03-12: Senior review follow-up fixes — TanStack Query global 401 handling alignment, deterministic RFC7807 callback error mapping, API client refresh-failure flow hardening, and test suite stabilization.

### Senior Developer Review (AI)

- Outcome: **Changes Requested** issues were fixed in this pass; status promoted to **done** after verification.
- Fixed HIGH: AC7 alignment by adding global unauthorized handling entry points in TanStack Query and preserving refresh-first flow.
- Fixed HIGH: RFC 7807-derived deterministic callback error messaging via i18n mapping for unauthorized callback failures.
- Fixed HIGH: Removed hanging promise anti-pattern in API client refresh failure path.
- Fixed MEDIUM: Resolved test instability/warnings by making callback "processing" test deterministic and aligning rejection expectations.
- Verification: `pnpm test -- --run` and `pnpm lint` in `apps/web` both pass.

### File List

- `_bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md` (updated)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated)
- `apps/web/src/constants/auth.constants.ts` (created)
- `apps/web/src/stores/auth.store.ts` (created)
- `apps/web/src/api/api-client.ts` (created)
- `apps/web/src/api/api-client.test.ts` (created)
- `apps/web/src/features/auth/use-auth.ts` (created)
- `apps/web/src/features/auth/auth-guard.tsx` (created)
- `apps/web/src/features/auth/auth-guard.test.tsx` (created)
- `apps/web/src/features/auth/login-page.tsx` (created)
- `apps/web/src/features/auth/login-page.test.tsx` (created)
- `apps/web/src/features/auth/auth-callback.tsx` (created)
- `apps/web/src/features/auth/auth-callback.test.tsx` (created)
- `apps/web/src/features/auth/sign-out.test.tsx` (created)
- `apps/web/src/routes.tsx` (modified)
- `apps/web/src/app.tsx` (modified)
- `apps/web/src/layouts/app-layout.tsx` (modified)
- `apps/web/src/locales/en.json` (modified)
- `apps/web/src/locales/fr.json` (modified)
- `apps/web/src/app.test.tsx` (modified)
