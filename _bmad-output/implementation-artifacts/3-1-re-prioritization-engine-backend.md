# Story 3.1: Re-Prioritization Engine Backend

Status: ready-for-dev

## Story

As a **user**,
I want **the system to automatically calculate a priority score for every active task and re-order them whenever anything changes**,
so that **my plan always reflects the optimal execution sequence without manual effort**.

## Acceptance Criteria

### AC1: Priority calculator formula and tie-breakers
- Weighted formula: Impact 50% + Deadline Urgency 30% + Effort Efficiency 20%
- Impact mapping: Urgent=1.0, High=0.75, Normal=0.5, Low=0.25
- Deadline urgency and effort efficiency applied as specified
- Tie-breakers: earlier deadline, then shorter estimatedDuration, then earlier createdAt
- Pure function design with configurable weights in shared constants

### AC2: Automatic recalculation on task mutations
- After task create/edit/state changes, call prioritization service recalculate(workspaceId)
- Recalculate across all active tasks (Open/InProgress)
- Persist priorityScore + displayOrder
- Keep pinned tasks fixed at pinnedPosition

### AC3: Response and performance behavior
- Return updated task list with priorityScore/displayOrder
- Include meta.reprioritized=true
- Meet NFR1 target (<2s for 50+ active tasks)

### AC4: Resilience and logging
- On engine error, dashboard falls back to last known displayOrder
- Log errors through NestJS Logger with structured context
- No activity-log entries for automatic position changes

## Tasks / Subtasks

- [ ] Implement modules/prioritization priority calculator as pure function with configurable weights.
- [ ] Add recalculate(workspaceId) service that loads active tasks and computes scores/orders.
- [ ] Integrate automatic trigger from task mutations.
- [ ] Preserve pin constraints during reorder.
- [ ] Return meta.reprioritized indicator in API output contract.
- [ ] Implement graceful fallback + structured logging on engine failures.
- [ ] Add focused backend tests: formula, tie-breakers, pinned behavior, performance-oriented execution path, fallback path.

## Dev Notes

- Keep workspace scoping strict on every recalculation query.
- Do not emit activity log rows for automatic reprioritization movement.
- Keep implementation isolated from manual override release flows (Epic 4).

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
