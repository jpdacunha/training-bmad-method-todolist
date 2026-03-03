# Story 2.1: Subject CRUD Backend

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user**,
I want **an API to create, rename, archive, and list my subjects with task counts**,
so that **I can organize my tasks into meaningful groups that reflect my work streams**.

## Acceptance Criteria

### AC1: Subjects schema, migration, and shared validation contracts
**Given** DB schema is ready  
**When** Drizzle migration for this story executes  
**Then** `subjects` table exists with fields: `id` (UUID PK), `workspaceId` (FK), `name` (required), `isArchived` (default false), `createdAt`, `updatedAt` (tz)  
**And** index `idx_subjects_workspaceId` exists  
**And** Zod schemas for create/update subject exist in `packages/shared`.

### AC2: Create subject endpoint
**Given** authenticated user with workspace  
**When** `POST /api/v1/subjects` with `{ name: "Client A" }` is sent  
**Then** subject is created in user workspace and returned with HTTP 201 in envelope format  
**And** `workspaceId` is sourced from `WorkspaceGuard` context.

### AC3: Rename subject endpoint
**Given** existing subject in same workspace  
**When** `PATCH /api/v1/subjects/:subjectId` with `{ name: "Client B" }` is sent  
**Then** subject is renamed and updated record is returned with HTTP 200.

### AC4: Archive subject endpoint
**Given** existing active subject  
**When** `PATCH /api/v1/subjects/:subjectId` with `{ isArchived: true }` is sent  
**Then** subject is archived (hidden from active view) while preserving data and associated tasks.

### AC5: List subjects with active task counts
**Given** authenticated user  
**When** `GET /api/v1/subjects` is sent  
**Then** all active subjects for current workspace are returned with active `taskCount` and response envelope.

### AC6: Optional includeArchived listing
**Given** authenticated user  
**When** `GET /api/v1/subjects?includeArchived=true` is sent  
**Then** active and archived subjects are returned.

### AC7: Validation errors
**Given** subject creation with missing/empty name  
**When** Zod validation pipe processes request  
**Then** API returns HTTP 422 with RFC 7807 details.

### AC8: Cross-tenant isolation behavior
**Given** user attempts to access subject outside own workspace  
**When** request is processed  
**Then** API returns HTTP 404 (not found), never exposing cross-tenant existence.

## Tasks / Subtasks

- [ ] **Task 1: Extend shared schema and migrations for subjects** (AC: #1)
  - [ ] Add `subjects` Drizzle table schema in `packages/shared/src/schemas/`.
  - [ ] Include required FK (`workspaceId`) and default values.
  - [ ] Add index `idx_subjects_workspaceId`.
  - [ ] Generate migration in `apps/api/src/database/migrations/`.

- [ ] **Task 2: Add shared Zod contracts for subject create/update** (AC: #1, #7)
  - [ ] Define create/update Zod schemas in `packages/shared`.
  - [ ] Export schemas/types through shared package barrel.
  - [ ] Ensure empty-name validation maps to 422 via existing Nest Zod pipe.

- [ ] **Task 3: Implement subject module endpoints and service logic** (AC: #2, #3, #4, #5, #6, #8)
  - [ ] Create/update `subject.module.ts`, `subject.controller.ts`, `subject.service.ts`.
  - [ ] Implement create, update (rename/archive), list endpoints under `/api/v1/subjects`.
  - [ ] Use `workspaceId` from request context injected by `WorkspaceGuard`.
  - [ ] Enforce not-found semantics for cross-tenant subject IDs.

- [ ] **Task 4: Add task count aggregation on list endpoint** (AC: #5)
  - [ ] Return `taskCount` for active tasks per subject in listing response.
  - [ ] Keep query performant and workspace-scoped.

- [ ] **Task 5: Ensure response and error format compliance** (AC: #2, #3, #4, #5, #6, #7, #8)
  - [ ] Verify response envelope shape `{ data, meta, errors }` via existing interceptors.
  - [ ] Ensure RFC 7807 for validation and other error conditions.
  - [ ] Preserve HTTP status mapping: create `201`, updates/list `200`, invalid input `422`, unauthorized/forbidden by guards, cross-tenant target `404`.

- [ ] **Task 6: Add focused backend tests** (AC: #2, #3, #4, #5, #6, #7, #8)
  - [ ] Service/controller tests for create/rename/archive/list flows.
  - [ ] Include `includeArchived=true` behavior.
  - [ ] Validate taskCount presence and shape in response data.
  - [ ] Validate 422 on invalid input and 404 on cross-tenant subject access.

## Dev Notes

### Story Foundation

- First implementation story of Epic 2; it establishes the subject domain foundation for later task stories.
- Depends on auth/workspace isolation from Epic 1 (JWT + WorkspaceGuard context).

### Technical Requirements

- API routes live under `/api/v1/subjects`.
- All subject queries must be strictly workspace-scoped.
- DB model conventions: camelCase identifiers, UUID v4 IDs, timestamp with timezone.
- Validation contracts belong in `packages/shared` and are reused across front/back.

### Architecture Compliance

- Tenant isolation is mandatory: every read/write filtered by `workspaceId` from request context.
- No raw SQL in controllers; services handle data access via Drizzle.
- Response envelope and RFC 7807 patterns must remain consistent with existing app baseline.

### Library / Framework Requirements

- NestJS modules/controllers/services + guards.
- Drizzle ORM migrations and query builder.
- Shared Zod schemas from `packages/shared`.
- Existing `WorkspaceGuard` and auth guard flow from Epic 1.

### File Structure Requirements

- Expected backend touchpoints (minimum):
  - `apps/api/src/modules/subject/subject.module.ts`
  - `apps/api/src/modules/subject/subject.controller.ts`
  - `apps/api/src/modules/subject/subject.service.ts`
  - `apps/api/src/modules/subject/*.test.ts`
  - `packages/shared/src/schemas/subjects.schema.ts`
  - `apps/api/src/database/migrations/*` (subjects migration)

### Testing Requirements

- Add Jest coverage for CRUD operations and isolation behavior.
- Include negative tests for cross-workspace subject ID access.
- Verify list response includes task counts and respects includeArchived filter.

### Previous Story Intelligence (1.6)

- Public landing/auth routing work is complete/planned; this story operates fully in protected API context.
- Workspace isolation invariants introduced in story 1.5 must be treated as non-negotiable constraints for subject APIs.

### Git Intelligence Summary

- Repo execution pattern is sequential by story with synchronized sprint-status updates.
- Keep changes scoped to backend subject domain and avoid pulling in task CRUD concerns from story 2.3.

### Latest Technical Information

- No new framework selection is needed; use the existing NestJS + Drizzle + shared Zod stack.
- Continue using current dependency set in `apps/api/package.json` unless implementation uncovers a hard requirement.

### Project Context Reference

- No project-context.md file was discovered in this repository.
- Canonical context for this story:
  - `_bmad-output/planning-artifacts/epics.md` (Story 2.1)
  - `_bmad-output/planning-artifacts/architecture.md` (tenant isolation, API conventions)
  - `_bmad-output/planning-artifacts/prd.md` (FR6–FR9, FR10, NFR8)
  - `_bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md`

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 2, Story 2.1)
- Source: `_bmad-output/planning-artifacts/architecture.md` (REST envelope, RFC 7807, WorkspaceGuard)
- Source: `_bmad-output/planning-artifacts/prd.md` (subject management + isolation requirements)
- Source: `_bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md`

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 2.1)
- Prior story intelligence: `_bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md`

### Completion Notes List

- Selected next backlog story for Epic 2: `2-1-subject-crud-backend`.
- Extracted ACs for subject schema, CRUD endpoints, task counts, validation, and tenant-isolation semantics.
- Generated ready-for-dev artifact with implementation tasks and focused test guardrails.

### File List

- `_bmad-output/implementation-artifacts/2-1-subject-crud-backend.md` (created)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated)
