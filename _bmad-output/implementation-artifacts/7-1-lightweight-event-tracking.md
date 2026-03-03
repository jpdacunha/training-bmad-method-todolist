# Story 7.1: Lightweight Event Tracking

Status: ready-for-dev

## Story

As a **product owner**,
I want **non-intrusive tracking of key user events to measure MVP adoption and validate success metrics**,
so that **I can make data-driven decisions about product evolution**.

## Acceptance Criteria

### AC1: Event taxonomy tracking
- Track key events: `user.signup`, `session.start`, `task.created`, `task.split`, `task.reprioritized`, `task.stateChanged`, `task.pinned`, `task.unpinned`.

### AC2: Frontend hook behavior
- `useAnalytics` sends `POST /api/v1/analytics/events` with `{ eventType, metadata, timestamp }` fire-and-forget.

### AC3: Backend ingestion and persistence
- Persist to `analyticsEvents` table (id, userId, eventType, metadata JSONB, createdAt).
- Endpoint protected by `JwtAuthGuard` only (no WorkspaceGuard).

### AC4: Non-intrusive performance and failure behavior
- Tracking has no perceptible UI performance impact.
- Burst events batched/debounced.
- Failed tracking requests silently discarded.

### AC5: Analytics data quality and privacy
- Data supports MVP metrics (signup, WAU, creation/split/reprioritization rates, daily return).
- No personal task content in events; GDPR principles respected.

## Tasks / Subtasks

- [ ] Add analytics schema/migration for `analyticsEvents`.
- [ ] Implement analytics module/service/endpoint with auth guard.
- [ ] Implement frontend `useAnalytics` fire-and-forget hook.
- [ ] Add batching/debouncing strategy in client tracking dispatch.
- [ ] Add privacy guardrails preventing task-content leakage in payloads.
- [ ] Add tests for ingestion, auth scope, silent-failure behavior, and payload constraints.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
