# Story 1.2: Database Foundation & User Schema

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **a Drizzle ORM setup with PostgreSQL connection and user/workspace/refresh-token tables**,
so that **the authentication system has the data foundation it needs**.

## Acceptance Criteria

### AC1: Core auth tables and indexes are created with Drizzle migrations
**Given** the API application is running with a PostgreSQL connection  
**When** Drizzle migrations are executed  
**Then** the following tables are created:
- `users` (`id` UUID PK, `email`, `name`, `avatarUrl`, `oauthProvider`, `oauthProviderId`, `createdAt`, `updatedAt`)
- `workspaces` (`id` UUID PK, `userId` FK, `name`, `createdAt`, `updatedAt`)
- `refreshTokens` (`id` UUID PK, `userId` FK, `token`, `expiresAt`, `createdAt`)
**And** all column names use camelCase with quoted identifiers  
**And** appropriate indexes exist: `idx_users_email`, `idx_users_oauthProviderId`, `idx_workspaces_userId`, `idx_refreshTokens_token`

### AC2: Shared schema contract is consumable by backend
**Given** the Drizzle schema is defined in `packages/shared`  
**When** the backend imports the schema  
**Then** TypeScript types are automatically inferred from the schema and available for use in services.

### AC3: Drizzle Kit config in API app references shared schema
**Given** `drizzle.config.ts` exists in `apps/api`  
**When** the developer runs Drizzle Kit migration commands  
**Then** migrations are generated and applied correctly, referencing schemas from `packages/shared`.

### AC4: NestJS database provider bootstraps Drizzle using env config
**Given** the database provider module exists  
**When** the NestJS application starts  
**Then** Drizzle connects to PostgreSQL using `DATABASE_URL`  
**And** connection is validated with a health query.

### AC5: Environment contract is documented
**Given** `.env.example` files exist  
**When** a developer sets up the project  
**Then** documented environment variables include: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.

## Tasks / Subtasks

- [x] **Task 1: Add Drizzle dependencies and scripts** (AC: #1, #3)
  - [x] Add `drizzle-orm` runtime dependency where needed for API/shared integration.
  - [x] Add `drizzle-kit` dev dependency in API package for migration workflow.
  - [x] Add migration scripts in `apps/api/package.json` (generate/migrate).

- [x] **Task 2: Define DB schema in shared package** (AC: #1, #2)
  - [x] Create shared schema files in `packages/shared/src/schemas/` for `users`, `workspaces`, `refreshTokens`.
  - [x] Use UUID v4 PKs and camelCase column names (Drizzle quoted identifiers).
  - [x] Add FK: `workspaces.userId -> users.id`, `refreshTokens.userId -> users.id`.
  - [x] Add required indexes exactly as AC1.
  - [x] Export schema from `packages/shared/src/index.ts`.

- [x] **Task 3: Configure Drizzle Kit in API app** (AC: #3)
  - [x] Create `apps/api/drizzle.config.ts`.
  - [x] Ensure config points to shared schema path (`../../packages/shared/src/schemas/*.ts`).
  - [x] Ensure migrations output to API-side migrations folder.

- [x] **Task 4: Implement API database module/provider for Drizzle** (AC: #4)
  - [x] Create `apps/api/src/database/database.module.ts` and `database.provider.ts`.
  - [x] Use `DATABASE_URL` to create PostgreSQL connection and Drizzle client.
  - [x] Keep/align startup connectivity check with provider health query.
  - [x] Wire module into `AppModule` without breaking health endpoint.

- [x] **Task 5: Generate and apply initial migration** (AC: #1, #3)
  - [x] Generate migration SQL files for the three tables and indexes.
  - [x] Apply migration against local PostgreSQL.
  - [x] Verify tables and index names in DB match acceptance criteria.

- [x] **Task 6: Verify env contracts and docs parity** (AC: #5)
  - [x] Confirm `apps/api/.env.example` includes all required env vars (already present in scaffold).
  - [x] Add/update root `.env.example` only if mismatched.

- [x] **Task 7: Add focused tests for DB foundation** (AC: #2, #4)
  - [x] Unit test for database provider/module initialization path.
  - [x] Integration-level check that DB connectivity query still passes on app bootstrap.
  - [x] Keep tests co-located and aligned with existing Jest setup.

## Dev Notes

### Story Foundation

- This story is the second implementation step in Epic 1 and the mandatory data foundation for Story 1.3 (OAuth backend).
- Scope is strictly database foundation + schema wiring; do not implement auth endpoints/guards in this story.
- Keep API-first layering: schema in shared package, DB access in backend services/providers only.

### Technical Requirements

- Stack constraints: NestJS 11 + PostgreSQL 16 + Drizzle ORM (SQL-first).
- Naming rule must be enforced:
  - File names: kebab-case.
  - DB/API/code identifiers: camelCase or PascalCase.
- PostgreSQL camelCase columns must remain quoted (Drizzle handles this natively).
- Date columns should use `timestamp with time zone` / UTC-compatible patterns.
- IDs must use UUID v4 format.

### Architecture Compliance

- Keep schema source of truth in `packages/shared` so backend and future frontend typing remain aligned.
- `drizzle.config.ts` lives in `apps/api` and must reference shared schemas via relative path.
- Database queries and connection logic belong to API database layer, not controllers.
- Preserve current API foundation behaviors from Story 1.1:
  - `/api/health` remains functional.
  - Existing startup DB connectivity check remains intact or is cleanly superseded by Drizzle-backed equivalent.
- Do not introduce tenant filtering logic here (WorkspaceGuard arrives later with auth flow dependencies).

### Library / Framework Requirements

- Existing repo baseline (from implemented scaffold):
  - Node `>=22`, pnpm `10.x`, TypeScript `5.9.x`
  - NestJS `11.1.x`, pg `8.16.x`, Zod `4.x`
  - Jest `29.x` in API (intentional compatibility choice from Story 1.1)
- Drizzle requirements for this story:
  - Use current stable `drizzle-orm` and `drizzle-kit` compatible with current TypeScript/Nest setup.
  - Do not alter unrelated framework versions.

### File Structure Requirements

- Expected additions/updates (minimum):
  - `apps/api/drizzle.config.ts`
  - `apps/api/src/database/database.module.ts`
  - `apps/api/src/database/database.provider.ts`
  - `apps/api/src/database/migrations/*` (generated)
  - `packages/shared/src/schemas/*` (DB tables)
  - `packages/shared/src/index.ts` (schema exports)
  - `apps/api/package.json` scripts/dependencies updates
- Preserve monorepo boundaries and existing naming conventions.

### Testing Requirements

- Keep backend tests in Jest, co-located with source.
- Add focused tests for DB provider/module bootstrap behavior.
- Verify no regression on health endpoint behavior and app bootstrap checks.
- Run at least targeted API tests for changed modules before handing off to `dev-story` completion.

### Previous Story Intelligence (1.1)

- Reuse what already works:
  - Existing bootstrap DB connectivity service (`SELECT 1`) and logger patterns.
  - Existing monorepo scaffolding and strict lint/test setup.
  - Existing `.env.example` API contract already includes required DB/JWT/OAuth vars.
- Avoid repeating prior mistakes fixed in 1.1:
  - No hard-coded user-visible text patterns in web (not in scope here, but keep consistency mindset).
  - Keep CI-friendly formatting/linting discipline.
  - Keep implementation surgical to story scope.

### Git Intelligence Summary

- Recent commits indicate sequence discipline: planning artifacts → architecture/UX → Story 1.1 scaffold.
- Current codebase state confirms:
  - API module structure and health endpoint are present.
  - Shared package already exports Zod schemas and types.
  - DB connectivity check exists but Drizzle stack is not yet integrated.
- Implementation should extend existing scaffold rather than rework it.

### Latest Technical Information

- External web lookup could not be executed in this environment; use project-locked versions and architecture constraints as source of truth.
- Guardrail for dev agent:
  - Resolve versions from `package.json`/lockfile first.
  - Introduce Drizzle packages in the narrowest compatible range.
  - Do not perform opportunistic upgrades of NestJS/Jest/TypeScript during this story.

### Project Context Reference

- No `project-context.md` discovered in repository.
- Canonical references for this story are:
  - `_bmad-output/planning-artifacts/epics.md` (Story 1.2 acceptance criteria)
  - `_bmad-output/planning-artifacts/architecture.md` (stack, naming, structure)
  - `_bmad-output/planning-artifacts/prd.md` (NFR/security/performance context)
  - `_bmad-output/planning-artifacts/ux-design-specification.md` (global UX constraints, mostly non-blocking for this backend-focused story)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2] — Story definition and acceptance criteria.
- [Source: _bmad-output/planning-artifacts/architecture.md#Selected Stack Summary] — Drizzle + PostgreSQL stack decision.
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules] — Naming, validation, boundaries.
- [Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure] — `drizzle.config.ts` + database module placement.
- [Source: _bmad-output/implementation-artifacts/1-1-monorepo-initialization-and-project-scaffold.md] — prior implementation patterns and constraints.

## Story Completion Status

- Status set to **done**.
- Completion note: **Story 1.2 implemented: Drizzle schema, API DB module/providers, migrations, and focused tests completed**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 1.2)
- Prior story intelligence: `_bmad-output/implementation-artifacts/1-1-monorepo-initialization-and-project-scaffold.md`

### Completion Notes List

- Installed Drizzle dependencies in API and shared packages; added API migration scripts (`db:generate`, `db:migrate`).
- Added shared DB schemas for `users`, `workspaces`, `refreshTokens` with UUID PKs, camelCase columns, required FK/index constraints.
- Added `apps/api/drizzle.config.ts` pointing to shared schema and API-side migration output folder.
- Implemented API DB foundation (`database.module.ts`, `database.provider.ts`, `database.constants.ts`) and aligned connectivity check with provider pool.
- Generated migration `0000_early_nitro.sql` and applied it after starting PostgreSQL container via `docker compose up -d db`.
- Added focused tests: provider path, connectivity service behavior, and AppModule bootstrap database query behavior.
- Fixed Jest module mapping path for shared workspace imports from API tests.
- Validation completed: `pnpm --filter @training-bmad-method-todolist/api test`, `pnpm test`, `pnpm lint`.

### File List

- `apps/api/package.json` (modified)
- `apps/api/jest.config.js` (modified)
- `apps/api/drizzle.config.ts` (new)
- `apps/api/src/app.module.ts` (modified)
- `apps/api/src/app.module.database-bootstrap.test.ts` (new)
- `apps/api/src/database/database.constants.ts` (new)
- `apps/api/src/database/database.provider.ts` (new)
- `apps/api/src/database/database.module.ts` (new)
- `apps/api/src/database/database.provider.test.ts` (new)
- `apps/api/src/database/database-connectivity.service.ts` (modified)
- `apps/api/src/database/database-connectivity.service.test.ts` (new)
- `apps/api/src/database/migrations/0000_early_nitro.sql` (new)
- `apps/api/src/database/migrations/meta/_journal.json` (new)
- `apps/api/src/database/migrations/meta/0000_snapshot.json` (new)
- `packages/shared/src/index.ts` (modified)
- `packages/shared/src/schemas/users.schema.ts` (new)
- `packages/shared/src/schemas/workspaces.schema.ts` (new)
- `packages/shared/src/schemas/refresh-tokens.schema.ts` (new)
- `packages/shared/src/schemas/task.schema.ts` (modified — Zod 4 API alignment: z.uuid(), z.iso.datetime(), z.enum())
- `apps/api/package.json` and `packages/shared/package.json` lockstep updates reflected in workspace lockfile
- `pnpm-lock.yaml` (modified)

## Change Log

- 2026-03-03: Implemented Story 1.2 database foundation end-to-end (Drizzle setup, shared schemas, API providers/module, generated+applied migration, focused tests, full regression/lint validation).
- 2026-03-03: Code review fixes — added UNIQUE constraints (email, oauth composite, refresh token), added $onUpdate on updatedAt columns, removed double connectivity check, narrowed drizzle.config glob, documented task.schema.ts Zod 4 migration.
