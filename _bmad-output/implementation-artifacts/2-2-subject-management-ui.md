# Story 2.2: Subject Management UI

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **user**,
I want **a visual interface to create, rename, and archive my subjects**,
so that **I can organize my work streams without leaving the application**.

## Acceptance Criteria

### AC1: Subject list with task counts and archived toggle
**Given** authenticated user in main app  
**When** subject management area is opened  
**Then** active subjects are shown with names and task counts  
**And** archived subjects are hidden by default with an option to show them.

### AC2: Create subject flow with optimistic UX and validation feedback
**Given** user clicks create action  
**When** input/form appears and user submits name  
**Then** subject is created and list updates immediately (optimistic update)  
**And** success Snackbar is shown  
**And** validation errors are shown inline in error color.

### AC3: Inline rename flow
**Given** user clicks subject name  
**When** inline edit activates  
**Then** name becomes MUI Outlined TextField  
**And** Enter saves rename (optimistic update), Escape cancels edit  
**And** success Snackbar is shown.

### AC4: Archive flow with confirmation
**Given** user triggers archive on subject  
**When** confirmation dialog is accepted  
**Then** subject is archived and removed from active list immediately (optimistic update)  
**And** success Snackbar is shown.

### AC5: Empty state for first-time usage
**Given** no subjects exist  
**When** list is rendered  
**Then** empty-state message is shown and create action is prominently highlighted.

### AC6: UX/tech consistency constraints
**Given** any subject-management interaction  
**When** UI renders or actions execute  
**Then** all text uses i18n keys, styling is MUI-only (no CSS files, no inline styles), and frontend validation uses shared Zod schemas onBlur.

## Tasks / Subtasks

- [ ] **Task 1: Build subject management UI surface** (AC: #1, #5)
  - [ ] Create/extend subject management component in authenticated area (sidebar or dedicated section).
  - [ ] Render active subject list with `taskCount`.
  - [ ] Add toggle/control to include archived subjects.
  - [ ] Add empty-state UI with highlighted create action.

- [ ] **Task 2: Integrate subject API hooks with TanStack Query** (AC: #1, #2, #3, #4)
  - [ ] Implement query hooks for subject listing (`includeArchived` support).
  - [ ] Implement mutations for create, rename, and archive.
  - [ ] Use optimistic updates with rollback on error.

- [ ] **Task 3: Implement create-subject interaction** (AC: #2, #6)
  - [ ] Add create input/form using MUI Outlined TextField.
  - [ ] Validate onBlur with shared Zod schema.
  - [ ] Display inline validation errors and success/error Snackbar feedback.

- [ ] **Task 4: Implement inline rename interaction** (AC: #3, #6)
  - [ ] Enable click-to-edit subject name.
  - [ ] Enter commits rename mutation; Escape reverts local edit state.
  - [ ] Preserve keyboard accessibility and focus handling.

- [ ] **Task 5: Implement archive confirmation flow** (AC: #4)
  - [ ] Add confirmation dialog before archive mutation.
  - [ ] On confirm, apply optimistic removal from active list and show success Snackbar.

- [ ] **Task 6: i18n + MUI-only enforcement** (AC: #6)
  - [ ] Add/extend locale keys in `en.json` and `fr.json` for all labels/messages.
  - [ ] Verify no hardcoded user-visible strings remain in components.
  - [ ] Ensure styling uses MUI components + `sx`/`styled` only.

- [ ] **Task 7: Add focused frontend tests** (AC: #1, #2, #3, #4, #5, #6)
  - [ ] Render tests for list state, empty state, and archived toggle behavior.
  - [ ] Interaction tests for create/rename/archive flows.
  - [ ] Keyboard behavior test for Enter/Escape inline edit.
  - [ ] Validation error rendering test for invalid subject name.

## Dev Notes

### Story Foundation

- UI story depends on Story 2.1 backend API readiness for subjects CRUD + task counts.
- This story establishes reusable subject UX patterns that later task-management screens can follow.

### Technical Requirements

- Use TanStack Query for subjects server state and mutation workflows.
- Maintain optimistic update behavior for create/rename/archive operations.
- Validation must use shared Zod contracts and onBlur feedback pattern.
- Success and failure feedback via MUI Snackbar/inline field errors.

### Architecture Compliance

- Frontend remains API consumer only; no business logic duplication from backend.
- Respect design system rule: MUI-only styling (no CSS files, no inline `style={{}}`).
- Respect i18n rule: no hardcoded user-visible text.
- Keep component/file naming conventions aligned (kebab-case files).

### Library / Framework Requirements

- React + TypeScript + Vite frontend baseline.
- TanStack Query for list/mutation state.
- Zustand only for lightweight client state where needed (no Redux).
- react-i18next for all copy.
- MUI components (`TextField`, `Dialog`, `Snackbar`, etc.).

### File Structure Requirements

- Expected frontend touchpoints (minimum):
  - `apps/web/src/features/workspace/subject-manager.tsx`
  - `apps/web/src/features/workspace/use-workspace.ts` (or equivalent query/mutation hooks)
  - `apps/web/src/locales/en.json`
  - `apps/web/src/locales/fr.json`
  - co-located tests near updated components/hooks

### Testing Requirements

- Add Vitest + RTL coverage for rendering states and create/rename/archive interactions.
- Verify optimistic update and rollback behavior on mutation failure paths.
- Verify onBlur validation and keyboard Enter/Escape interaction behavior.

### Previous Story Intelligence (2.1)

- Backend returns workspace-scoped subject data and 404 semantics for cross-tenant targets; frontend should surface generic not-found/server errors without leaking assumptions.
- Subject list endpoint includes `taskCount`; UI should display it directly without client-side derivation.

### Git Intelligence Summary

- Repo progression remains story-by-story with sprint status transitions in lockstep.
- Keep scope limited to subject UI management; do not blend with task CRUD UI concerns from Story 2.4.

### Latest Technical Information

- No dependency upgrade is required for this story; rely on existing frontend stack and conventions.
- Continue current optimistic update pattern consistent with architecture guidance.

### Project Context Reference

- No project-context.md file was discovered in this repository.
- Canonical context for this story:
  - `_bmad-output/planning-artifacts/epics.md` (Story 2.2)
  - `_bmad-output/planning-artifacts/architecture.md` (frontend state, styling, i18n, validation conventions)
  - `_bmad-output/planning-artifacts/prd.md` (FR6–FR9 UX intent)
  - `_bmad-output/implementation-artifacts/2-1-subject-crud-backend.md`

### References

- Source: `_bmad-output/planning-artifacts/epics.md` (Epic 2, Story 2.2)
- Source: `_bmad-output/planning-artifacts/architecture.md` (TanStack Query, MUI-only, i18n, validation)
- Source: `_bmad-output/planning-artifacts/prd.md` (subject management requirements)
- Source: `_bmad-output/implementation-artifacts/2-1-subject-crud-backend.md`

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story source: `_bmad-output/planning-artifacts/epics.md` (Story 2.2)
- Prior story intelligence: `_bmad-output/implementation-artifacts/2-1-subject-crud-backend.md`

### Completion Notes List

- Selected next backlog story for Epic 2: `2-2-subject-management-ui`.
- Extracted UI acceptance criteria: list/counts, create/rename/archive, empty state, and UX constraints.
- Generated ready-for-dev artifact with interaction tasks and focused tests.

### File List

- `_bmad-output/implementation-artifacts/2-2-subject-management-ui.md` (created)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (updated)
