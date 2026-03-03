# Story 5.2: Task Split UI

Status: ready-for-dev

## Story

As a **user**,
I want **a dialog to split a task into sub-tasks, with each sub-task getting its own properties, and see the parent-child relationship on the board**,
so that **I can decompose complex work visually and track the origin of each piece**.

## Acceptance Criteria

### AC1: Split dialog composition
- Triggering Split opens `TaskSplitDialog` with parent info, default 2 subtasks, add-subtask action, optional rationale comment.

### AC2: Subtask editing model
- Each subtask editable independently (title required, optional description/duration, defaulted priority/deadline/subject).

### AC3: Submit and board update
- Confirm split closes dialog, replaces parent with child cards via optimistic update, shows success Snackbar.

### AC4: Lineage visualization
- Subtask cards show split-origin indicator and parent reference navigation.
- Parent detail lists child subtasks with status/title/day.

### AC5: Validation UX
- Invalid subtask fields show inline errors (onBlur, MUI Outlined).
- Confirm disabled until all required fields valid.

## Tasks / Subtasks

- [ ] Build `TaskSplitDialog` form structure and add/remove subtask actions.
- [ ] Integrate split mutation + optimistic board replacement.
- [ ] Add split-origin visual indicator and parent linkage UI.
- [ ] Add parent detail child listing section.
- [ ] Implement validation/disable-submit behavior.
- [ ] Add i18n keys + MUI-only styling compliance.
- [ ] Add frontend tests for split flow, validation, and lineage display.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
