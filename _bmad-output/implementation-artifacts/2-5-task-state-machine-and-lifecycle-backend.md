# Story 2.5: Task State Machine & Lifecycle Backend

Status: ready-for-dev

## Story

As a **user**,
I want **tasks to follow a strict lifecycle with proper state transitions and mandatory comments for cancellation and archival**,
so that **every decision is traceable and no task silently disappears**.

## Acceptance Criteria

### AC1: Valid transitions only with RFC 7807 errors for invalid transitions
Open → InProgress, InProgress → Completed, Open/InProgress → Cancelled, Open/InProgress/Completed → Archived. Invalid transitions return HTTP 422 RFC 7807.

### AC2: Start/complete transitions
`PATCH /api/v1/tasks/:taskId/status` supports `InProgress` and `Completed`, updates `updatedAt`, persists atomically.

### AC3: Mandatory comment for Cancelled and Archived
`Cancelled`/`Archived` without comment returns HTTP 422; with comment transition succeeds and comment is persisted.

### AC4: Terminal protections and delete semantics
Terminal transitions are rejected; `DELETE /api/v1/tasks/:taskId` is permanent and distinct from cancel/archive; terminal states are irreversible.

## Tasks / Subtasks

- [ ] Build task state machine service with explicit transition map and 422 errors.
- [ ] Add `PATCH /api/v1/tasks/:taskId/status` endpoint with status/comment payload validation.
- [ ] Enforce mandatory comment rule for cancel/archive paths.
- [ ] Enforce irreversible terminal state rules and permanent delete behavior.
- [ ] Persist state transitions atomically and keep workspace scoping.
- [ ] Add Jest tests for valid transitions, invalid transitions, mandatory comment cases, delete, and terminal protections.

## Dev Notes

- Keep RFC 7807 error contract and response envelope consistency.
- Use workspace-scoped ownership checks for all task operations.
- Do not mix activity-log persistence implementation details here beyond integration hooks (full log story is 2.7).

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Comprehensive state-machine implementation guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
