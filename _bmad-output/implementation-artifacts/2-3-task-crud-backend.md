# Story 2.3: Task CRUD Backend

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user**,
I want **an API to create, read, update, and list tasks with full and quick-capture modes**,
so that **I can capture work items quickly and refine them later**.

## Acceptance Criteria

### AC1: Tasks schema, indexes, and shared contracts
**Given** DB schema is ready  
**When** Drizzle migration executes  
**Then** `tasks` table is created with required columns/enum fields and defaults  
**And** indexes exist: `idx_tasks_workspaceId`, `idx_tasks_subjectId`, `idx_tasks_status`, `idx_tasks_parentTaskId`  
**And** shared Zod schemas exist for task create (full + quick-capture) and update.

### AC2: Create task (full payload)
**Given** authenticated user with at least one subject  
**When** `POST /api/v1/tasks` with full fields is sent  
**Then** task is created with status `Open`, returned with HTTP 201 in response envelope  
**And** `workspaceId` is set from `WorkspaceGuard` context.

### AC3: Create task (quick capture)
**Given** minimal payload `{ title }` (or `{ title, subjectId }`)  
**When** create request is sent  
**Then** task is created with defaults (`status=Open`, `priorityLevel=Normal`, optional fields null)  
**And** if subjectId omitted, default/unassigned handling is applied.

### AC4: Update task fields
**Given** existing open or in-progress task  
**When** `PATCH /api/v1/tasks/:taskId` with partial fields is sent  
**Then** only provided fields are updated, `updatedAt` is refreshed, and updated task is returned.

### AC5: Reassign subject within same workspace
**Given** update request changes `subjectId`  
**When** reassignment is processed  
**Then** subject reassignment succeeds only within same workspace and other task fields remain unchanged.

### AC6: List tasks with filters
**Given** authenticated user  
**When** `GET /api/v1/tasks` is called  
**Then** workspace tasks are returned and filters are supported: `status`, `subjectId`, `includeCompleted`.

### AC7: Get task by ID
**Given** task exists in workspace  
**When** `GET /api/v1/tasks/:taskId` is called  
**Then** full task record is returned.

### AC8: Validation and tenant constraints
**Given** invalid create payload (e.g., missing title)  
**When** validation runs  
**Then** API returns HTTP 422 with RFC 7807 details.  
**And Given** request references subject from another workspace  
**When** ownership is validated  
**Then** API returns 404 (subject not found).

## Tasks / Subtasks

- [ ] **Task 1: Extend shared task schema + migration** (AC: #1)
  - [ ] Add/verify Drizzle `tasks` table definition in `packages/shared` with required enums, defaults, and nullable fields.
  - [ ] Add required indexes (`workspaceId`, `subjectId`, `status`, `parentTaskId`).
  - [ ] Generate migration under `apps/api/src/database/migrations/`.

- [ ] **Task 2: Add shared Zod contracts for task create/update** (AC: #1, #8)
  - [ ] Define separate Zod inputs for full create, quick capture, and patch update.
  - [ ] Export schemas/types via shared package barrel.
  - [ ] Ensure validation maps to existing 422 RFC 7807 behavior.

- [ ] **Task 3: Implement tasks module endpoints** (AC: #2, #3, #4, #5, #6, #7, #8)
  - [ ] Create/update `task.module.ts`, `task.controller.ts`, `task.service.ts`.
  - [ ] Implement `POST /api/v1/tasks`, `PATCH /api/v1/tasks/:taskId`, `GET /api/v1/tasks`, `GET /api/v1/tasks/:taskId`.
  - [ ] Return envelope format and status codes per ACs.

- [ ] **Task 4: Enforce workspace ownership and subject integrity** (AC: #2, #5, #8)
  - [ ] Use `workspaceId` from request context for all task CRUD queries.
  - [ ] Validate subject ownership on create/reassign; return 404 when subject not in workspace.
  - [ ] Prevent cross-tenant task visibility/updates.

- [ ] **Task 5: Implement listing filters and defaults** (AC: #3, #6)
  - [ ] Support `status` filtering (single/multi values according to API contract).
  - [ ] Support `subjectId` filter.
  - [ ] Support `includeCompleted` behavior for completed/cancelled visibility.
  - [ ] Ensure stable and predictable ordering strategy for API consumers.

- [ ] **Task 6: Add focused backend tests** (AC: #2, #3, #4, #5, #6, #7, #8)
  - [ ] Create full-payload and quick-capture create tests.
  - [ ] Update/partial patch tests including subject reassignment constraints.
  - [ ] List/get endpoint tests with filter combinations.
  - [ ] Validation (422) and cross-tenant/foreign-subject (404) tests.

## Dev Notes

### Story Foundation

- This story is the backend foundation for task lifecycle, prioritization, and dashboard stories in Epics 2–4.
- Depends on prior completion/readiness of auth + workspace isolation + subjects domain (Stories 1.3, 1.5, 2.1).

### Technical Requirements

- Preserve API versioning under `/api/v1/tasks`.
- Keep response envelope and RFC 7807 error model consistent.
- Respect enum/domain conventions from planning docs (status + priorityLevel).
- Keep all writes and reads tenant-scoped via `workspaceId`.

### Architecture Compliance

- Backend layering: controllers thin, services own data/business logic.
- Drizzle data access in service layer only; no controller-level SQL.
- WorkspaceGuard context is mandatory for tenant isolation.
- Ensure compatibility with upcoming reprioritization trigger contract (later stories) by keeping fields like `displayOrder`, `priorityScore`, `isPinned`, `pinnedPosition` in model.

### Library / Framework Requirements

- NestJS modules/controllers/services.
- Drizzle ORM with shared schema ownership in `packages/shared`.
- Shared Zod schemas for request validation.
- Existing guard/interceptor stack for auth, workspace isolation, envelope, and errors.

### File Structure Requirements

- Expected touchpoints (minimum):
  - `apps/api/src/modules/task/task.module.ts`
  - `apps/api/src/modules/task/task.controller.ts`
  - `apps/api/src/modules/task/task.service.ts`
  - `apps/api/src/modules/task/*.test.ts`
  - `packages/shared/src/schemas/task.schema.ts`
  - `apps/api/src/database/migrations/*` (tasks migration)

### Testing Requirements

- Add Jest tests for all endpoints and filter variants.
- Cover both happy paths and isolation/validation failures.
- Verify response envelope shape and status codes for each path.

### Previous Story Intelligence (2.2)

- Subject UI/backend now establishes subject IDs as user-facing anchors; task creation/reassignment must strictly validate subject ownership.
- UX relies on fast optimistic frontend updates; backend should return deterministic payloads and clear errors.

### Git Intelligence Summary

- Story execution in repo is incremental with sprint transitions and implementation artifacts updated together.
- Keep scope focused on CRUD and schema foundations; do not pull in state-machine/prioritization logic from 2.5/3.1 yet.

### Latest Technical Information

- No additional dependencies are expected for this story beyond current backend stack.
- Continue using `@nestjs/throttler` and existing error pipeline already present in project baseline where applicable.

### Project Context Reference

- No project-context.md file was discovered in this repository.
- Canonical context for this story:
  - `_bmad-output/planning-artifacts/epics.md` (Story 2.3)
  - `_bmad-output/planning-artifacts/architecture.md` (tenant isolation, API contracts, data model patterns)
  - `_bmad-output/planning-artifacts/prd.md` (task CRUD FRs + NFR reliability/security constraints)
  - `_bmad-output/implementation-artifacts/2-1-subject-crud-backend.md`
  - `_bmad-output/implementation-artifacts/2-2-subject-management-ui.md`

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 2, Story 2.3)
- Source: `_bmad-output/planning-artifacts/architecture.md` (tasks data model, isolation, envelope/RFC 7807)
- Source: `_bmad-output/planning-artifacts/prd.md` (task creation/edit FRs)
- Source: `_bmad-output/implementation-artifacts/2-1-subject-crud-backend.md`
- Source: `_bmad-output/implementation-artifacts/2-2-subject-management-ui.md`

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 2.3)
- Prior story intelligence: `_bmad-output/implementation-artifacts/2-2-subject-management-ui.md`

### Completion Notes List

- Selected next backlog story for Epic 2: `2-3-task-crud-backend`.
- Extracted ACs for task schema, create/update/list/get APIs, filtering, validation, and tenant ownership checks.
- Generated ready-for-dev artifact with focused backend implementation and testing checklist.

### File List

- `_bmad-output/implementation-artifacts/2-3-task-crud-backend.md` (created)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated)
