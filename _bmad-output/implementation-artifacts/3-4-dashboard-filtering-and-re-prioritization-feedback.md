# Story 3.4: Dashboard Filtering & Re-Prioritization Feedback

Status: ready-for-dev

## Story

As a **user**,
I want **to filter my tasks by subject, state, or priority, and see visual feedback when tasks shift positions after re-prioritization**,
so that **I can focus on specific work streams and understand how my plan adapts to changes**.

## Acceptance Criteria

### AC1: Filter controls and behavior
- Filters for subject, status multi-select, priority multi-select
- Subject/status/priority filters apply correctly
- Multiple filters combine using AND logic
- Active filter indicators and Reset Filters action are visible

### AC2: Empty-filter result UX
- Show clear no-match message and Reset Filters button when filtered result is empty

### AC3: Reprioritization visual feedback
- On meta.reprioritized=true, invalidate cache and rerender board
- Changed TaskCards animate into new positions (<150ms)
- Animation is the visual reprioritization indicator (FR43)

### AC4: Accessibility and persistence
- prefers-reduced-motion disables animation
- Filter preferences persist in Zustand during session navigation

## Tasks / Subtasks

- [ ] Implement subject/status/priority filter controls and state model.
- [ ] Apply client-side filtering against loaded active tasks.
- [ ] Implement AND-combination semantics and active filter indicators.
- [ ] Add reset workflow and empty-result message state.
- [ ] Hook reprioritization response meta to cache invalidation/rerender behavior.
- [ ] Implement transition animation and reduced-motion fallback.
- [ ] Persist filter state in Zustand for session navigation.
- [ ] Add frontend tests for filtering logic, empty state, and reprioritization visual behavior.

## Dev Notes

- Keep filtering client-side per AC to avoid unnecessary API calls.
- Keep animation lightweight and accessible.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
