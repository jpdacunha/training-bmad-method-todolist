# Story 1.4: Frontend Shell & Authentication UI

Status: ready-for-dev

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

- [ ] **Task 1: Add frontend auth routing and guard flow** (AC: #1, #4, #5)
  - [ ] Define/confirm public routes: `/login`, `/auth/callback`; protected routes behind auth guard.
  - [ ] Implement route guard logic to redirect unauthenticated users to `/login`.
  - [ ] Add startup auth bootstrap to attempt refresh before marking user unauthenticated.

- [ ] **Task 2: Implement login page UI with i18n and MUI-only constraints** (AC: #2, #3)
  - [ ] Build `login-page` component with Google/GitHub actions.
  - [ ] Ensure all labels/messages come from i18n keys (`en` + `fr`).
  - [ ] Keep UI strictly MUI-based (`sx`/`styled` only; no CSS files, no inline style prop).

- [ ] **Task 3: Implement OAuth callback page behavior** (AC: #4)
  - [ ] Parse callback query params safely.
  - [ ] Exchange callback payload with backend auth endpoint.
  - [ ] Persist access token in memory store and navigate to `/` on success.
  - [ ] Display deterministic error state (RFC 7807-derived messaging via i18n) on failure.

- [ ] **Task 4: Implement token lifecycle in frontend API layer** (AC: #5, #7)
  - [ ] Add API client auth interceptor/wrapper for bearer token injection.
  - [ ] Implement refresh flow using cookie-backed `POST /api/v1/auth/refresh`.
  - [ ] Add one-retry policy on `401` (refresh then replay), then hard redirect to `/login`.

- [ ] **Task 5: Implement sign-out UX + endpoint integration** (AC: #6, #8)
  - [ ] Add sign-out action in authenticated header.
  - [ ] Call backend sign-out endpoint, clear in-memory auth state, invalidate relevant query caches.
  - [ ] Redirect to `/login` and ensure protected routes no longer accessible.

- [ ] **Task 6: Build minimal authenticated app shell** (AC: #8)
  - [ ] Ensure header includes app name, language switcher, theme toggle, and sign-out.
  - [ ] Render main content outlet/layout container.
  - [ ] Show MUI Skeleton during initial auth/bootstrap loading.

- [ ] **Task 7: Add focused frontend tests** (AC: #1, #2, #4, #5, #6, #7, #8)
  - [ ] Route guard tests for unauthenticated redirect.
  - [ ] Login page rendering tests (two provider buttons + i18n keys).
  - [ ] Callback success/failure tests.
  - [ ] API `401` refresh-and-retry behavior test.
  - [ ] Sign-out flow test (API call + local state clear + redirect).

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

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 1.4)
- Prior story intelligence: `_bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md`

### Completion Notes List

- Selected next backlog story automatically from sprint status: `1-4-frontend-shell-and-authentication-ui`.
- Extracted story acceptance criteria and architecture guardrails focused on frontend auth flow.
- Generated ready-for-dev implementation artifact with concrete tasks, constraints, and test expectations.

### File List

- `_bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md` (created)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated)
