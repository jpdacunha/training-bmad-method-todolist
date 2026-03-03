# Story 1.5: Workspace Auto-Creation & Tenant Isolation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **new user**,
I want **my personal workspace to be automatically created when I first sign in**,
so that **I can start using the application immediately without any setup**.

## Acceptance Criteria

### AC1: First login auto-creates workspace
**Given** user authenticates for the first time (new user record)  
**When** auth flow completes  
**Then** a workspace is auto-created with user name as default workspace name  
**And** workspace ID is associated with the user record.

### AC2: Existing users do not get duplicate workspaces
**Given** user already has a workspace  
**When** user signs in again  
**Then** no duplicate workspace is created and existing workspace is reused.

### AC3: Global WorkspaceGuard injects tenant context on protected endpoints
**Given** WorkspaceGuard is globally registered  
**When** request hits protected endpoint except auth and health  
**Then** guard resolves workspaceId from authenticated user context and injects it into request  
**And** downstream service queries apply workspace filtering automatically.

### AC4: Data isolation is enforced for all users
**Given** User A and User B have separate workspaces  
**When** User A calls any data endpoint  
**Then** only User A workspace data is returned, even with manipulated parameters.

### AC5: Missing workspace context returns RFC 7807 forbidden
**Given** WorkspaceGuard cannot determine workspace for authenticated user  
**When** request continues through protected flow  
**Then** API returns HTTP 403 with RFC 7807 error response.

## Tasks / Subtasks

- [ ] **Task 1: Add workspace lifecycle logic to auth completion flow** (AC: #1, #2)
  - [ ] On successful OAuth callback, check whether workspace exists for authenticated user.
  - [ ] If none exists, create default workspace using user display name fallback strategy.
  - [ ] Persist workspace association on user and ensure idempotency for repeated callbacks/sign-ins.

- [ ] **Task 2: Implement workspace module service boundaries** (AC: #1, #2)
  - [ ] Add or update workspace service methods for get-or-create semantics.
  - [ ] Keep DB access in service/provider layer only, no direct query logic in controllers/guards.
  - [ ] Ensure schema and query contracts stay aligned with shared Drizzle models.

- [ ] **Task 3: Implement global WorkspaceGuard** (AC: #3, #5)
  - [ ] Add guard under common guards and wire as global guard in app bootstrap/module.
  - [ ] Exclude auth endpoints and health endpoint from workspace enforcement.
  - [ ] Resolve authenticated user identity from request context, load workspace, and attach workspaceId to request.
  - [ ] Return 403 RFC 7807 when workspace cannot be determined.

- [ ] **Task 4: Enforce tenant filtering in protected service queries** (AC: #3, #4)
  - [ ] Ensure protected modules use workspaceId from request context for all reads and writes.
  - [ ] Add explicit safeguards against caller-controlled workspace parameter bypass.
  - [ ] Verify no endpoint leaks cross-tenant existence metadata.

- [ ] **Task 5: Add focused tests for tenant isolation guarantees** (AC: #1, #2, #3, #4, #5)
  - [ ] Test first-login workspace creation path.
  - [ ] Test repeat-login idempotency (single workspace retained).
  - [ ] Test WorkspaceGuard success path with workspace injection.
  - [ ] Test WorkspaceGuard failure path returns 403 RFC 7807.
  - [ ] Test cross-tenant access attempts return no foreign data.

## Dev Notes

### Story Foundation

- This story extends auth foundation from Story 1.3 and introduces tenant isolation guarantees required by FR10 and NFR8.
- Workspace provisioning belongs to backend auth completion workflow and must be idempotent.

### Technical Requirements

- Keep endpoint security model aligned with architecture:
  - Public: auth and health.
  - Protected: workspace, subject, task, activity-log endpoints enforce JwtAuthGuard + WorkspaceGuard.
- Error format for denied access and missing workspace context must use RFC 7807.
- Tenant enforcement rule is mandatory: all protected data access must include workspaceId filter with no exceptions.

### Architecture Compliance

- Tenant isolation implementation is application-level via global WorkspaceGuard.
- Guard injects workspace context into request; services consume that context and enforce query scoping.
- Preserve strict layering: controllers remain thin, services own business/data logic.
- Keep backend stateless; do not introduce server-side sessions.

### Library / Framework Requirements

- NestJS guards/interceptors pattern for global request protection.
- Drizzle ORM query layer with shared schema contracts in packages/shared.
- Existing JWT auth guard from Story 1.3 remains prerequisite and should not be duplicated.

### File Structure Requirements

- Expected backend touchpoints (minimum):
  - apps/api/src/common/guards/workspace.guard.ts
  - apps/api/src/modules/workspace/workspace.module.ts
  - apps/api/src/modules/workspace/workspace.service.ts
  - apps/api/src/modules/auth/auth.service.ts (workspace get-or-create integration)
  - apps/api/src/common/types/request.types.ts (workspace context typing if needed)
- Keep tests co-located with guard/service implementations.

### Testing Requirements

- Add Jest coverage for guard behavior, workspace auto-creation, and cross-tenant isolation.
- Include negative tests for manipulated identifiers to verify strict tenant boundaries.
- Validate that excluded endpoints (auth/health) are not blocked by WorkspaceGuard.

### Previous Story Intelligence (1.4)

- Frontend auth shell assumes backend can establish workspace context post-login; this story provides that invariant.
- Session refresh and sign-out flows from previous stories must continue to work unchanged after guard introduction.

### Git Intelligence Summary

- Repository follows strict sequential story progression with synchronized artifact and sprint updates.
- Keep changes surgical and avoid widening scope into subject/task feature implementation.

### Latest Technical Information

- No external dependency change is required for this story by default.
- Focus remains on framework primitives already selected in architecture: NestJS guards + Drizzle service-scoped queries.

### Project Context Reference

- No project-context.md file was discovered in this repository.
- Canonical context for this story:
  - _bmad-output/planning-artifacts/epics.md (Story 1.5)
  - _bmad-output/planning-artifacts/architecture.md (tenant isolation and guard model)
  - _bmad-output/planning-artifacts/prd.md (FR10, NFR8)
  - _bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md (downstream dependency)
  - _bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md (auth prerequisite)

### References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 1, Story 1.5)
- Source: _bmad-output/planning-artifacts/architecture.md (tenant isolation, API guard boundaries)
- Source: _bmad-output/planning-artifacts/prd.md (FR10, NFR8)
- Source: _bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md
- Source: _bmad-output/implementation-artifacts/1-3-oauth-authentication-backend.md

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: _bmad-output/implementation-artifacts/sprint-status.yaml
- Story source: _bmad-output/planning-artifacts/epics.md (Story 1.5)
- Prior story intelligence: _bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md

### Completion Notes List

- Selected next backlog story automatically from sprint status: 1-5-workspace-auto-creation-and-tenant-isolation.
- Extracted story acceptance criteria and architecture tenant-isolation constraints.
- Generated ready-for-dev implementation artifact with explicit tasks, guardrails, and test expectations.

### File List

- _bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md (created)
- _bmad-output/implementation-artifacts/sprint-status.yaml (updated)
