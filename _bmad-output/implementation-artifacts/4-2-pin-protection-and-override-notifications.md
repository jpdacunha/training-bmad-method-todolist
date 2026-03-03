# Story 4.2: Pin Protection & Override Notifications

Status: ready-for-dev

## Story

As a **user**,
I want **my manually positioned tasks to be protected from automatic re-prioritization, with clear notifications when the system suggests a different position**,
so that **I can trust that my deliberate arrangements are respected while staying informed about the system's recommendations**.

## Acceptance Criteria

### AC1: Pinned-task protection in engine
- Reprioritization keeps pinned tasks fixed at pinnedPosition.
- Non-pinned tasks are reordered around pinned ones.

### AC2: Conflict reporting contract
- If suggested position differs, API returns `meta.pinnedConflicts` with taskId, pinnedPosition, suggestedPosition.

### AC3: Notification UX
- Frontend shows non-intrusive conflict notification preserving override context.
- Notification supports “Accept suggestion” and dismiss.

### AC4: Accept-suggestion flow
- Accepting suggestion unpins task, clears pinnedPosition, reruns reprioritization, moves task, logs override release.

### AC5: Pinned visual language
- Pinned icon active/filled, highlighted left border, explanatory tooltip.

### AC6: Auto-break pin on critical field edits
- Changing priorityLevel or deadline auto-unpins task, reruns reprioritization, logs reason, shows Snackbar feedback.

## Tasks / Subtasks

- [ ] Extend backend reprioritization response with `meta.pinnedConflicts`.
- [ ] Implement pinned protection and conflict detection logic in prioritization service.
- [ ] Implement frontend conflict notification component and actions.
- [ ] Implement accept-suggestion unpin + rerun flow.
- [ ] Add pinned card visuals + tooltip behavior.
- [ ] Add auto-break pin flow on priority/deadline edits with logging and Snackbar.
- [ ] Add tests for conflict generation, UI notifications, and unpin flows.

## Dev Notes

- Keep traceability via activity log entries for override release and auto-release events.
- Ensure reduced-motion and accessibility constraints remain respected.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
