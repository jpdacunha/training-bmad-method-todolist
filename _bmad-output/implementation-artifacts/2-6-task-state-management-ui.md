# Story 2.6: Task State Management UI

Status: ready-for-dev

## Story

As a **user**,
I want **visual controls to manage task states, with mandatory comment dialogs for cancellation and archival**,
so that **I can confidently manage my task lifecycle with full traceability**.

## Acceptance Criteria

### AC1: Distinct visual state rendering
Task cards distinguish Open/InProgress/Completed/Cancelled/Archived visually.

### AC2: Start and Complete actions
Open → InProgress and InProgress → Completed with optimistic updates and success Snackbar.

### AC3: Cancel/Archive require comment dialog
Cancel and Archive open dialog with mandatory MUI Outlined comment field; confirm button disabled until comment exists; optimistic update on confirm.

### AC4: Delete confirmation
Delete requires permanent-action warning confirmation and then hard delete.

### AC5: Filtered view and terminal protections
Completed/Cancelled tasks appear via filters; terminal tasks hide/disable mutation controls.

## Tasks / Subtasks

- [ ] Add task-state action controls on task cards.
- [ ] Implement optimistic transitions for Start/Complete.
- [ ] Implement mandatory-comment dialogs for Cancel/Archive with disabled confirm until valid input.
- [ ] Implement delete confirmation flow and backend integration.
- [ ] Respect terminal-state UI lockout behavior.
- [ ] Add success/error Snackbar handling and i18n keys for all labels/messages.
- [ ] Add Vitest/RTL tests for dialogs, button enablement, optimistic behavior, and terminal-state UI restrictions.

## Dev Notes

- MUI-only styling, i18n-only strings, TanStack Query optimistic mutations are mandatory.
- Keep behavior aligned with backend state-machine constraints from Story 2.5.

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Comprehensive task-state UI implementation guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
