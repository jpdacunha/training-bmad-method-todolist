# Story 5.1: Task Split Backend

Status: ready-for-dev

## Story

As a **user**,
I want **an API to split any open or in-progress task into independent sub-tasks with parent-child traceability**,
so that **I can decompose work into manageable pieces without losing the connection to the original task**.

## Acceptance Criteria

### AC1: Split endpoint behavior
- `POST /api/v1/tasks/:taskId/split` creates N subtasks, sets parent status to Completed (or split-terminal variant), returns 201 with subtasks.
- Each subtask has independent properties and `parentTaskId` linking to original task.

### AC2: Traceability and logging
- Optional split comment logged as `Split` on parent.
- Each subtask gets `Created` activity log entry referencing split origin.

### AC3: Reprioritization integration
- Successful split triggers reprioritization; subtasks independently participate.

### AC4: Validation/guardrails
- Terminal parent tasks cannot be split (422).
- Split with zero subtasks invalid (422, minimum 2 required).
- Task read API exposes `parentTaskId` and `childTasks` lineage.

## Tasks / Subtasks

- [ ] Add split DTO/contracts and validation in shared schemas.
- [ ] Implement split service with transactional parent/subtask persistence.
- [ ] Integrate activity log writes for parent and children.
- [ ] Trigger reprioritization after split commit.
- [ ] Enforce validation and terminal-state protections.
- [ ] Extend task retrieval shape with lineage data.
- [ ] Add backend tests for happy path, validations, and lineage payloads.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
