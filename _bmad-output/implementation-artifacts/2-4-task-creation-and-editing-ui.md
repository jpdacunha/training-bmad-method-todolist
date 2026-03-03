# Story 2.4: Task Creation & Editing UI

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user**,
I want **to create tasks with a full form or quick-capture mode, and edit task properties inline**,
so that **I can capture ideas instantly and refine details when I have time**.

## Acceptance Criteria

### AC1: Quick-capture entry from global actions
**Given** user is on main app view  
**When** user clicks global `+` FAB or presses `N`  
**Then** quick-capture input appears (title-only)  
**And** Enter creates task with defaults (`priorityLevel=Normal`, no deadline)  
**And** task appears immediately in list via optimistic update.

### AC2: Quick qualification after quick-capture
**Given** task just created via quick-capture  
**When** task card is focused  
**Then** quick controls appear for importance + deadline (`Today`, `Tomorrow`, `End of Week`, `Next Week`, `Specific Date`)  
**And** updates are sent via `PATCH` with optimistic UI.

### AC3: Full task creation form
**Given** user chooses full create flow  
**When** full form is opened  
**Then** user can set title, description, subject, estimated duration, priority level, deadline (future-only)  
**And** MUI Outlined TextFields + onBlur Zod validation are used  
**And** submit remains disabled while invalid.

### AC4: Inline title editing on task cards
**Given** existing task card  
**When** user clicks title  
**Then** title becomes editable TextField  
**And** Enter saves, Escape cancels  
**And** other properties remain editable via detail/expanded view.

### AC5: Subject reassignment interaction
**Given** user changes subject dropdown on task  
**When** reassignment is submitted  
**Then** task is reassigned via optimistic update and moves to new subject grouping.

### AC6: Success/error feedback behavior
**Given** any task create or edit action  
**When** action succeeds  
**Then** success Snackbar is displayed (3–4s).  
**When** action fails  
**Then** inline validation errors and/or Snackbar server errors are shown.

### AC7: Empty state
**Given** no tasks exist  
**When** task list area renders  
**Then** welcome empty-state message is shown and FAB is visually highlighted.

## Tasks / Subtasks

- [ ] **Task 1: Implement quick-capture entry points** (AC: #1)
  - [ ] Wire global `+` FAB and `N` shortcut to open quick-capture input.
  - [ ] Submit title-only payload to task create endpoint.
  - [ ] Apply optimistic insertion in task list.

- [ ] **Task 2: Implement post-create quick qualification controls** (AC: #2)
  - [ ] Show importance + deadline quick controls on focused newly-created card.
  - [ ] Support preset deadline options and specific date picker.
  - [ ] Trigger `PATCH` updates with optimistic mutation behavior.

- [ ] **Task 3: Build full task creation form** (AC: #3)
  - [ ] Include required and optional fields per AC.
  - [ ] Use MUI Outlined controls and future-date limitation for deadline.
  - [ ] Validate onBlur using shared Zod schemas and disable submit when invalid.

- [ ] **Task 4: Implement inline edit and subject reassignment** (AC: #4, #5)
  - [ ] Enable inline title edit (Enter save / Escape cancel).
  - [ ] Add subject reassignment dropdown interaction.
  - [ ] Keep updates optimistic with rollback on mutation failure.

- [ ] **Task 5: Add feedback and empty-state UX** (AC: #6, #7)
  - [ ] Add success Snackbar timing behavior (3–4s).
  - [ ] Render inline validation and server error feedback patterns.
  - [ ] Add first-use empty-state messaging and FAB highlight behavior.

- [ ] **Task 6: i18n and design-system compliance** (AC: #1, #2, #3, #6, #7)
  - [ ] Add/update locale keys (`en` + `fr`) for all task-create/edit strings.
  - [ ] Ensure no hardcoded user-facing text in components.
  - [ ] Keep styling MUI-only (`sx`/`styled`), no CSS files or inline styles.

- [ ] **Task 7: Add focused frontend tests** (AC: #1, #2, #3, #4, #5, #6, #7)
  - [ ] Quick-capture open/submit flow tests (FAB + keyboard shortcut).
  - [ ] Quick qualification update tests.
  - [ ] Full form validation/submit-state tests.
  - [ ] Inline title edit Enter/Escape tests.
  - [ ] Reassignment + success/error feedback tests.
  - [ ] Empty-state rendering test.

## Dev Notes

### Story Foundation

- This story is the primary task-entry UX layer and depends on backend task CRUD contract from Story 2.3.
- It should keep interaction speed high and predictable to support later prioritization and dashboard flows.

### Technical Requirements

- Frontend state and mutations use TanStack Query optimistic patterns.
- Validation uses shared Zod schemas onBlur with disabled submit while invalid.
- Keyboard interaction is required for quick capture (`N`) and inline editing (`Enter`/`Escape`).
- Deadline picker must enforce future-date constraints for full form.

### Architecture Compliance

- Maintain API-first pattern: frontend consumes task/subject APIs, no embedded business logic.
- MUI-only styling is mandatory; no CSS files or inline `style={{}}`.
- All user-visible copy must be i18n-driven.
- Reuse existing route/layout/store architecture rather than introducing parallel patterns.

### Library / Framework Requirements

- React + TypeScript + Vite.
- TanStack Query for server state + optimistic mutations.
- Zustand for minimal UI/client state if needed.
- react-i18next for text.
- MUI components (TextField, Snackbar, date picker integration already aligned with stack).

### File Structure Requirements

- Expected frontend touchpoints (minimum):
  - `apps/web/src/features/tasks/task-form.tsx`
  - `apps/web/src/features/tasks/task-card.tsx`
  - `apps/web/src/features/tasks/use-task-mutations.ts`
  - `apps/web/src/features/tasks/use-tasks.ts`
  - `apps/web/src/locales/en.json`
  - `apps/web/src/locales/fr.json`
  - co-located tests under `apps/web/src/features/tasks/*.test.tsx`

### Testing Requirements

- Add Vitest + RTL tests around quick-capture, full form, inline edit, reassignment, and feedback.
- Verify optimistic update + rollback for mutation failures.
- Validate i18n key rendering in both languages for new UI strings.

### Previous Story Intelligence (2.3)

- Backend now defines create/update/list/get semantics and validation boundaries; frontend should align payload shapes exactly.
- Subject ownership constraints in backend may return 404 on invalid reassignment target; UI should surface clean error feedback.

### Git Intelligence Summary

- Story progression is sequential with synchronized sprint/status and implementation artifacts.
- Keep scope focused on task create/edit UX; avoid implementing lifecycle transitions from Story 2.6.

### Latest Technical Information

- No dependency upgrade is required by default for this story.
- Continue established optimistic mutation + Snackbar feedback patterns already mandated in architecture.

### Project Context Reference

- No project-context.md file was discovered in this repository.
- Canonical context for this story:
  - `_bmad-output/planning-artifacts/epics.md` (Story 2.4)
  - `_bmad-output/planning-artifacts/architecture.md` (frontend state, validation, MUI/i18n rules)
  - `_bmad-output/planning-artifacts/prd.md` (task creation/edit user requirements)
  - `_bmad-output/implementation-artifacts/2-3-task-crud-backend.md`

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 2, Story 2.4)
- Source: `_bmad-output/planning-artifacts/architecture.md` (optimistic updates, i18n, MUI-only, validation)
- Source: `_bmad-output/planning-artifacts/prd.md` (task capture and edit goals)
- Source: `_bmad-output/implementation-artifacts/2-3-task-crud-backend.md`

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 2.4)
- Prior story intelligence: `_bmad-output/implementation-artifacts/2-3-task-crud-backend.md`

### Completion Notes List

- Selected next backlog story for Epic 2: `2-4-task-creation-and-editing-ui`.
- Extracted ACs for quick-capture, full form, inline editing, reassignment, feedback, and empty-state UX.
- Generated ready-for-dev artifact with concrete interaction tasks and frontend test expectations.

### File List

- `_bmad-output/implementation-artifacts/2-4-task-creation-and-editing-ui.md` (created)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated)
