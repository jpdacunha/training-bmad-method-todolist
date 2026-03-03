# Story 4.3: Pin Release & Mobile Adaptation

Status: ready-for-dev

## Story

As a **user**,
I want **to manually release a pin to return a task to automatic prioritization, and on mobile I want quick-action alternatives to drag & drop**,
so that **I can fluidly switch between manual and automatic control on any device**.

## Acceptance Criteria

### AC1: Manual pin release flow (desktop/tablet)
- Clicking active pin opens confirmation.
- Confirm clears pin state, triggers reprioritization, animates move, and logs action.
- Success Snackbar confirms return to auto-prioritization.

### AC2: Mobile adaptation (no DnD)
- On <768px, drag & drop disabled.
- TaskCard exposes quick-action alternatives.

### AC3: Mobile move-to-day action
- “Move to…” opens day/date selector.
- Selection updates deadline, triggers reprioritization, and moves task.

### AC4: Mobile move-up/down actions
- Move Up/Down actions reorder within day and create manual override (pin) equivalent.

### AC5: Mobile pin release parity
- Pinned mobile task has tappable pin icon and same release flow as desktop.

### AC6: Mobile accessibility
- Touch targets at least 44x44px and immediate visual feedback on tap.

## Tasks / Subtasks

- [ ] Implement pin release confirmation + mutation flow across desktop/tablet.
- [ ] Add mobile breakpoint behavior to disable DnD and enable quick-action controls.
- [ ] Implement Move-to-day selector and update/reprioritize flow.
- [ ] Implement Move Up/Down actions with manual-override semantics.
- [ ] Ensure mobile pin release parity and Snackbar feedback.
- [ ] Verify accessibility touch target sizing and tap feedback.
- [ ] Add frontend tests for breakpoint-specific interactions and action outcomes.

## Dev Notes

- Keep behavior consistent with Stories 4.1 and 4.2 state contracts.
- Preserve optimistic UX while maintaining rollback/error safety.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
