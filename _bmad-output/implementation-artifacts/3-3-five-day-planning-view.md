# Story 3.3: Five-Day Planning View

Status: ready-for-dev

## Story

As a **user**,
I want **to see a 5-day forward planning window to understand my upcoming workload**,
so that **I can anticipate capacity issues and make proactive decisions about my schedule**.

## Acceptance Criteria

### AC1: 5-day mode and date strategy
- Toggle from day view to 5-day view
- Default mode uses business days only
- Include-weekends option shows consecutive days
- Preference persisted in Zustand/localStorage

### AC2: Task distribution and overflow
- Tasks displayed in correct day columns with ordering
- Overflow behavior indicated when a day is visually full

### AC3: Overdue workflow
- OverdueTaskNotification appears when overdue tasks exist
- Actions: Re-plan All for Me / Manage Manually
- Re-plan action re-evaluates overdue tasks and animates board update

### AC4: Responsive behavior
- Tablet shows full 5 columns touch-friendly
- Mobile supports horizontal scroll with Today default visible

## Tasks / Subtasks

- [ ] Add 5-day mode toggle and board expansion logic.
- [ ] Implement business-day and include-weekend date generation strategies.
- [ ] Persist view and weekend preferences in Zustand/localStorage.
- [ ] Add OverdueTaskNotification component and action handlers.
- [ ] Integrate re-plan action feedback and board animation updates.
- [ ] Implement tablet/mobile behavior per ACs.
- [ ] Add frontend tests for toggles, persistence, overdue actions, and responsive behavior.

## Dev Notes

- Keep transitions smooth without full-page reload.
- Keep motion reductions for prefers-reduced-motion users.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
