# Story 1.3: OAuth Authentication Backend

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user**,
I want **to sign in with my Google or GitHub account and maintain a persistent session**,
so that **I can securely access my data without creating yet another password**.

## Acceptance Criteria

### AC1: OAuth login endpoints return provider authorization redirect with PKCE
**Given** a user is not authenticated  
**When** `GET /api/v1/auth/login/google` (or `/github`) is called  
**Then** the server responds with a redirect URL to the provider authorization page including PKCE parameters.

### AC2: OAuth callback creates/updates user and issues tokens
**Given** a user completes OAuth authorization  
**When** `GET /api/v1/auth/callback/google` (or `/github`) is called with a valid code  
**Then** the backend exchanges code via Arctic, upserts user, issues access token (15m), issues refresh token (7d, persisted), returns access token in response body, and sets refresh token as secure httpOnly sameSite cookie.

### AC3: Protected endpoints validate JWT access tokens
**Given** a valid access token  
**When** it is sent in `Authorization: Bearer ...` on protected routes  
**Then** `JwtAuthGuard` validates token and attaches authenticated user to request context.

### AC4: Refresh endpoint rotates refresh token
**Given** an expired access token and a valid refresh cookie  
**When** `POST /api/v1/auth/refresh` is called  
**Then** backend validates refresh token against DB, issues new access + refresh tokens, persists new refresh token, and invalidates the old one.

### AC5: Sign-out revokes refresh token and clears cookie
**Given** an authenticated user with refresh cookie  
**When** `POST /api/v1/auth/sign-out` is called  
**Then** refresh token is deleted, cookie is cleared, and old tokens become unusable.

### AC6: Invalid refresh returns RFC 7807 unauthorized
**Given** invalid/expired refresh token input  
**When** refresh is requested  
**Then** API returns HTTP 401 with RFC 7807 body `{ type, title, status, detail }`.

### AC7: Auth endpoints are rate-limited
**Given** auth rate limiter config  
**When** requests exceed limits  
**Then** API returns HTTP 429 (Too Many Requests).

## Tasks / Subtasks

- [x] **Task 1: Implement auth module structure and provider wiring** (AC: #1, #2, #3, #4, #5)
  - [x] Create/update `apps/api/src/modules/auth/auth.module.ts`, `auth.controller.ts`, `auth.service.ts`.
  - [x] Add Arctic provider factory for Google/GitHub clients with env-driven config and redirect URIs.
  - [x] Add auth DTO/contracts in `packages/shared` only if missing and required by backend/frontend API contract.

- [x] **Task 2: Implement OAuth login + callback flows with PKCE/state** (AC: #1, #2)
  - [x] Implement `GET /api/v1/auth/login/google` and `GET /api/v1/auth/login/github`.
  - [x] Generate and store transient `state` and PKCE verifier securely for callback validation.
  - [x] Implement callback handlers for Google/GitHub code exchange via Arctic.
  - [x] Upsert user by provider identity and map profile fields (`email`, `name`, `avatarUrl`, `oauthProvider`, `oauthProviderId`).

- [x] **Task 3: Implement JWT access token and DB-backed refresh token strategy** (AC: #2, #4, #5, #6)
  - [x] Issue access token with 15-minute expiry and minimal claims (`sub`, provider/user identity context).
  - [x] Generate refresh token with 7-day expiry and persist hashed/token value in `refreshTokens` table.
  - [x] Set refresh cookie with `httpOnly`, `secure` (prod), `sameSite` policy per environment strategy.
  - [x] Add token rotation in `POST /api/v1/auth/refresh` with old-token invalidation.
  - [x] Add `POST /api/v1/auth/sign-out` to revoke refresh token and clear cookie.

- [x] **Task 4: Implement JwtAuthGuard and route protection model** (AC: #3)
  - [x] Add `jwt-auth.guard.ts` in common guards and attach user payload to request.
  - [x] Ensure `/api/v1/auth/*` and `/api/health` remain public while protected routes enforce guard.
  - [x] Align unauthorized behavior with global RFC 7807 exception handling.

- [x] **Task 5: Apply rate limiting and security hardening** (AC: #7)
  - [x] Add `@nestjs/throttler` config for auth endpoints.
  - [x] Enforce strict input validation for callback/refresh/sign-out payloads.
  - [x] Ensure no sensitive token values are logged.

- [x] **Task 6: Add focused tests and regression checks** (AC: #1, #2, #3, #4, #5, #6, #7)
  - [x] Controller/service tests for login redirect URL generation and callback success/error paths.
  - [x] Guard tests for valid/invalid/expired access tokens.
  - [x] Refresh rotation tests (new token issued, old token invalid).
  - [x] Sign-out tests verifying DB revoke + cookie clearing behavior.
  - [x] Rate limit behavior test for HTTP 429 on auth endpoints.

## Dev Notes

### Story Foundation

- This story is the auth backend layer of Epic 1 and depends directly on Story 1.2 database foundation (users/workspaces/refreshTokens already present).
- OAuth is Google and GitHub only for MVP scope.
- Session behavior is hybrid: short-lived access JWT + DB-backed rotating refresh token cookie.

### Technical Requirements

- Implement endpoints under `/api/v1/auth/*` following existing API versioning conventions.
- Preserve RFC 7807 error responses for all failure paths (`401`, `422`, `429`, and provider callback issues).
- Use UUID-based user IDs and existing Drizzle schema in `packages/shared`.
- Access token expiry must be `15m`; refresh token expiry must be `7d`.
- Refresh token rotation is mandatory: on successful refresh, invalidate old token before/with new token issuance.

### Architecture Compliance

- Backend: NestJS + TypeScript strict mode; DB access through services/providers, not controllers.
- ORM: Drizzle with schema source in `packages/shared`.
- Security baseline: `@nestjs/throttler`, validation pipes, guarded protected routes.
- Keep backend stateless (NFR17): do not add server-side session state.
- Public routes: auth entrypoints + health only; tenant `WorkspaceGuard` integration comes in story 1.5.

### Library / Framework Requirements

- OAuth client library: `arctic` (project architecture choice).
- JWT handling: `@nestjs/jwt` with explicit env secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`).
- Rate limiting: `@nestjs/throttler`.
- Validation: shared Zod contracts + NestJS validation pipe pattern already used in repo.
- DB and schema: `drizzle-orm` with existing tables/indexes from story 1.2.

### File Structure Requirements

- Expected backend scope (minimum):
  - `apps/api/src/modules/auth/auth.module.ts`
  - `apps/api/src/modules/auth/auth.controller.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/api/src/modules/auth/*` supporting providers/strategies/services
  - `apps/api/src/common/guards/jwt-auth.guard.ts`
  - `packages/shared/src/schemas/*` and/or `types/*` only if contracts need extension
- Keep file naming in kebab-case and avoid introducing parallel auth implementations.

### Testing Requirements

- Add co-located Jest tests for auth controller/service and guard logic.
- Verify:
  - OAuth login endpoints produce provider redirect URL.
  - Callback success upserts user and issues both token types.
  - Refresh endpoint rotates tokens and revokes old refresh token.
  - Sign-out revokes refresh token and clears cookie.
  - Invalid refresh returns `401` RFC 7807.
  - Rate limiter returns `429` under burst requests.

### Previous Story Intelligence (1.2)

- Reuse established DB patterns:
  - Shared Drizzle schema ownership in `packages/shared`.
  - API-side provider-based DB injection and health-check style.
  - Existing refresh token schema and index (`idx_refreshTokens_token`) as primary lookup path.
- Maintain existing quality discipline from 1.2:
  - Focused, co-located tests.
  - Surgical changes scoped to story requirements.
  - Avoid unrelated dependency upgrades.

### Git Intelligence Summary

- Recent commit patterns indicate strict incremental delivery by story (`1-1`, then `1-2`), with implementation artifacts and sprint-status updated in lockstep.
- Auth story should follow same pattern: backend module + tests + implementation artifact + sprint status transition.
- Existing code already has health module, DB foundation, and monorepo contracts in place; build on these instead of re-scaffolding.

### Latest Technical Information

- Arctic package/repo currently indicates `3.7.0`; note from upstream docs: minor releases may contain provider-level breaking adjustments. Pin compatible range carefully and avoid floating broad upgrades.
- NestJS official auth guidance supports modular auth service + guard pattern and JWT-based bearer validation, matching architecture decisions.
- Drizzle docs remain aligned with SQL-first schema/migrations flow used in this repository.

### Project Context Reference

- No `project-context.md` file was discovered in this repository.
- Canonical context sources used for this story:
  - `_bmad-output/planning-artifacts/epics.md` (Story 1.3 definition and BDD ACs)
  - `_bmad-output/planning-artifacts/architecture.md` (stack decisions, boundaries, and patterns)
  - `_bmad-output/planning-artifacts/prd.md` (FR/NFR security, session, and performance targets)
  - `_bmad-output/planning-artifacts/ux-design-specification.md` (frontend/auth flow expectations and interaction constraints)
  - `_bmad-output/implementation-artifacts/1-2-database-foundation-and-user-schema.md` (previous story learnings)

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.3)
- Source: `_bmad-output/planning-artifacts/architecture.md` (Auth, API, security, and implementation sequence sections)
- Source: `_bmad-output/planning-artifacts/prd.md` (FR1–FR4, NFR8–NFR13, NFR17)
- Source: `_bmad-output/implementation-artifacts/1-2-database-foundation-and-user-schema.md`

## Story Completion Status

- Status set to **review**.
- Completion note: **OAuth backend implementation completed with JWT guard, refresh rotation, rate-limiting, and test coverage passing.**

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 1.3)
- Prior story intelligence: `_bmad-output/implementation-artifacts/1-2-database-foundation-and-user-schema.md`
- Architecture source: `_bmad-output/planning-artifacts/architecture.md`

### Completion Notes List

- Selected next backlog story automatically from sprint status: `1-3-oauth-authentication-backend`.
- Performed exhaustive context synthesis from epics, PRD, architecture, UX, previous story, recent git history, and targeted web checks for NestJS/Drizzle/Arctic.
- Produced a ready-for-dev story with explicit AC mapping, implementation tasks, guardrails, testing expectations, and anti-regression guidance.
- Implemented `AuthModule` with `/api/v1/auth/login/:provider`, `/callback/:provider`, `/refresh`, and `/sign-out` endpoints.
- Added OAuth callback processing with provider code exchange, profile mapping, user upsert, access token issuance (15m), hashed refresh token persistence (7d), and refresh rotation.
- Added `JwtAuthGuard` with RFC 7807 unauthorized responses and request user payload attachment.
- Added throttling on auth endpoints and validated `429` behavior with dedicated controller test.
- Expanded shared auth schemas/contracts and enabled cookie parsing in app bootstrap.
- Validation completed successfully: `pnpm lint` and `pnpm test` in `apps/api` both pass (18 tests).

### File List

- `apps/api/package.json` (modified)
- `apps/api/src/app.module.ts` (modified)
- `apps/api/src/main.ts` (modified)
- `apps/api/src/common/guards/jwt-auth.guard.ts` (added)
- `apps/api/src/common/guards/jwt-auth.guard.test.ts` (added)
- `apps/api/src/config/env.module.ts` (added)
- `apps/api/src/config/env.service.ts` (added)
- `apps/api/src/config/env.utils.ts` (added)
- `apps/api/src/modules/auth/auth.module.ts` (added)
- `apps/api/src/modules/auth/auth.controller.ts` (added)
- `apps/api/src/modules/auth/auth.controller.rate-limit.test.ts` (added)
- `apps/api/src/modules/auth/auth.controller.integration.test.ts` (added — review 2)
- `apps/api/src/modules/auth/auth.service.ts` (added)
- `apps/api/src/modules/auth/auth.service.test.ts` (added)
- `apps/api/src/test/setup-test-env.ts` (added — review 2)
- `apps/api/src/database/database.provider.ts` (modified)
- `apps/api/src/database/database.provider.test.ts` (modified)
- `apps/api/src/database/database-connectivity.service.ts` (modified)
- `apps/api/src/database/database-connectivity.service.test.ts` (modified)
- `apps/api/src/app.module.database-bootstrap.test.ts` (modified)
- `apps/api/src/modules/health/health.controller.test.ts` (modified)
- `apps/api/drizzle.config.ts` (modified)
- `apps/api/.env.example` (modified)
- `.env.example` (modified)
- `docker-compose.yml` (modified)
- `docker-compose.prod.yml` (modified)
- `packages/shared/src/schemas/auth.schema.ts` (modified)
- `pnpm-lock.yaml` (modified)
- `_bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)

### Senior Developer Review (AI)

**Reviewer:** Jean-Paul — 2026-03-03
**Review Model:** Claude Opus 4.6

**Issues Found:** 4 High, 5 Medium, 2 Low

**Issues Fixed (HIGH):**
- **H1** PKCE `code_challenge_method` changed from `plain` to `S256` with SHA-256 hashing in `auth.service.ts`
- **H2** Added `handleCallback` integration tests (success flow + missing state cookie) in `auth.service.test.ts`
- **H3** Added `signOut` tests (DB revoke + cookie clearing, no-cookie path) in `auth.service.test.ts`
- **H4** Partially addressed via H1 fix; manual authorization URL construction noted for future Arctic `createAuthorizationURL()` migration

**Issues Fixed (MEDIUM):**
- **M1** File List expanded from 14 to 28 entries — 15 undocumented files added
- **M2** Removed dead `JWT_REFRESH_SECRET` from `env.utils.ts`, `env.service.ts`, `.env.example` files, `docker-compose` files, and test env setup
- **M3** Fixed false test count claim (was "16 tests", actually 14, now 18 after adding missing tests)
- **M4** Documented: Story 1.2 resilience tests for null DB pool were removed because EnvService now enforces fail-fast startup

**Remaining Items (LOW — not blocking):**
- **L1** GitHub email fallback uses `@github.local` domain — should call `/user/emails` API for real email
- **L2** Jest worker leak warning — likely from PG pool lifecycle in integration tests

**Verdict:** All HIGH and MEDIUM issues fixed. Story approved for done.

### Senior Developer Review 2 (AI)

**Reviewer:** Jean-Paul — 2026-03-03
**Review Model:** Claude Opus 4.6

**Issues Found:** 3 High, 5 Medium, 3 Low

**Issues Fixed (HIGH):**
- **H1** Replaced custom `DatabaseClient`/`UserRecord`/`RefreshTokenRecord` types with Drizzle's `NodePgDatabase<DatabaseSchema>` and shared `User`/`RefreshToken` types — full type safety restored
- **H2** Removed `unknown` injection + `getDatabaseClient()` null-check pattern; `this.db` is now properly typed `NodePgDatabase<DatabaseSchema>`
- **H3** Added HTTP integration tests for auth endpoints (6 new tests: login google/github with PKCE, invalid provider 400, missing callback params 400, refresh 401, sign-out 200)

**Issues Fixed (MEDIUM):**
- **M1** Added PKCE S256 code_challenge to GitHub authorization URL and passed codeVerifier to GitHub `validateAuthorizationCode()`
- **M2** Replaced `@github.local` email fallback with `GET /user/emails` API call to fetch verified primary email
- **M3** Fixed Jest open handle warning — health controller test now overrides `DATABASE_POOL` with mock instead of creating real PG pool
- **M4** Extracted `setupTestEnv()` helper to `apps/api/src/test/setup-test-env.ts` — replaced duplicated env setup in 2 test files
- **M5** Replaced manual provider validation in `AuthController.parseProvider()` with `oauthProviderSchema.safeParse()` from shared Zod schema

**Remaining Items (LOW — not blocking):**
- **L1** No Swagger decorators on AuthController endpoints
- **L2** Story status header says "done" but completion status section says "review" (cosmetic)
- **L3** Custom provider client types (`GoogleProviderClient`/`GithubProviderClient`) could be replaced with Arctic's exported types

**Verdict:** All HIGH and MEDIUM issues fixed. Tests: 32 total (shared: 7, API: 24, web: 1). Build + lint + test all pass. Story confirmed done.

## Change Log

- 2026-03-03: Implemented Story 1.3 OAuth authentication backend (Arctic OAuth, JWT guard, refresh rotation, rate limiting, 18 tests passing).
- 2026-03-03: Code review 1 — Fixed PKCE S256, added callback/signOut tests, expanded file list, removed dead JWT_REFRESH_SECRET, documented test count.
- 2026-03-03: Code review 2 — Replaced custom DB types with Drizzle NodePgDatabase + shared User/RefreshToken types, added GitHub PKCE, replaced @github.local email fallback with /user/emails API, fixed Jest PG pool leak, extracted test env helper, used Zod schema in controller. Tests: 32 total.
