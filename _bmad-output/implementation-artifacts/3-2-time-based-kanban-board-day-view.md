# Story 3.2: Time-Based Kanban Board — Day View

Status: ready-for-dev

## Story

As a **user**,
I want **to see my tasks organized on a time-based Kanban board where today's column shows tasks in priority order**,
so that **I immediately know what to work on next when I open the app**.

## Acceptance Criteria

### AC1: Day-view board rendering
- Dashboard route renders TimeBasedKanbanBoard with day columns
- Tasks distributed by deadline and displayOrder
- No-deadline handling is explicit (No Date section or engine distribution)

### AC2: Loading and card content
- MUI Skeleton shown during fetch
- TaskCard displays title, priority icon, deadline label, status indicator
- Task state visuals match FR42

### AC3: Interaction and layout
- Desktop hover: scale 1.03 + reveal actions
- Column headers show day name/date/task count
- Today column ordering follows displayOrder
- Mobile: horizontal scroll, Today first, compact touch-friendly cards

### AC4: NFR and UX constraints
- FCP <1.5s and LCP <2.5s target context
- i18n-only text
- MUI-only styling
- prefers-reduced-motion respected

## Tasks / Subtasks

- [ ] Implement TimeBasedKanbanBoard day-view structure and column model.
- [ ] Bind task fetch via TanStack Query and skeleton loading placeholders.
- [ ] Implement TaskCard visual content and state styling requirements.
- [ ] Implement desktop hover interactions and column headers.
- [ ] Implement responsive behavior for mobile/tablet day view.
- [ ] Add i18n keys and ensure no hardcoded strings.
- [ ] Add frontend tests for rendering states, ordering, and responsive logic.

## Dev Notes

- Consume backend ordering as source of truth; avoid client-side business reprioritization.
- Keep MUI-only and accessibility constraints enforced.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
