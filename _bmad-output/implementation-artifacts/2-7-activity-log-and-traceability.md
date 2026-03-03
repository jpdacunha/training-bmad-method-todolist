# Story 2.7: Activity Log & Traceability

Status: ready-for-dev

## Story

As a **user**,
I want **a complete chronological history of every action on my tasks, with optional comments on most actions and mandatory comments on cancel/archive**,
so that **I can always understand why a task was modified, split, or cancelled**.

## Acceptance Criteria

### AC1: Activity log schema and index
Create `activityLogs` table with required fields and index `idx_activityLogs_taskId`.

### AC2: Atomic logging on task mutations
For create/edit/state change (and future split/override), write activity log entry in same transaction as action (NFR19).

### AC3: Action-specific payload semantics
Created stores initial `newValue`; Updated stores `previousValue` and `newValue`; StatusChanged stores status delta + comment rule behavior.

### AC4: Activity log API
`GET /api/v1/tasks/:taskId/activity-log` returns chronological entries (`createdAt` ascending) in response envelope.

### AC5: Optional comment propagation
Mutation endpoints with optional `comment` persist it in corresponding activity log entry.

### AC6: UI traceability contract support
Data returned supports timestamp, action type, previous/new summary, and comment display.

## Tasks / Subtasks

- [ ] Add `activityLogs` Drizzle schema + migration + index.
- [ ] Add activity-log service and module integration with task mutation flows.
- [ ] Ensure atomic transaction boundaries include task mutation + log write.
- [ ] Add endpoint `GET /api/v1/tasks/:taskId/activity-log` with workspace-scoped access.
- [ ] Wire comment propagation from mutation DTOs into log entries.
- [ ] Add backend tests for ordering, payload content, and transactional behavior.

## Dev Notes

- Keep tenant isolation strict: all log reads/writes workspace-scoped.
- Preserve RFC 7807 + envelope patterns.
- Avoid duplicating logging logic in controllers; centralize in service layer.

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Comprehensive activity-log implementation guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
