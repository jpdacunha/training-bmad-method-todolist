# Story 4.1: Drag & Drop Reordering with @dnd-kit

Status: ready-for-dev

## Story

As a **user**,
I want **to manually reorder my tasks within the daily view via drag and drop**,
so that **I can take direct control of my execution sequence when I know better than the algorithm**.

## Acceptance Criteria

### AC1: DnD interaction and feedback
- Dragging a TaskCard shows semi-transparent drag state + drop indicator.
- Visual feedback starts within 100ms.

### AC2: Same-column reorder behavior
- Drop in same day column applies optimistic reorder.
- Send `PATCH /api/v1/tasks/:taskId/reorder` with new `displayOrder` and `isPinned: true`.
- Show inactive pin icon after manual reposition.

### AC3: Cross-column move behavior
- Drop in another day updates deadline + displayOrder with `isPinned: true`.

### AC4: Manual override persistence
- Manual reposition sets `isPinned=true` in DB.
- Activity log entry `ManualOverride` stores previous/new positions.

### AC5: Keyboard accessibility and animation
- Arrow + Enter keyboard reordering alternative exists.
- Reordering animation <150ms and honors reduced-motion.

### AC6: Failure handling
- On backend patch failure, optimistic reorder rolls back and error Snackbar is shown.

## Tasks / Subtasks

- [ ] Integrate `@dnd-kit` board sensors for pointer + keyboard interactions.
- [ ] Implement same-column and cross-column reorder payload mapping.
- [ ] Add optimistic mutation with rollback on failure.
- [ ] Persist/reflect `isPinned` default inactive visual state after manual reorder.
- [ ] Add accessibility keyboard flows and reduced-motion behavior.
- [ ] Add tests for DnD outcomes, keyboard path, and rollback behavior.

## Dev Notes

- Keep MUI-only styling and i18n key usage for all user-visible strings.
- Align payload contract with backend task reorder endpoint and activity-log integration.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
