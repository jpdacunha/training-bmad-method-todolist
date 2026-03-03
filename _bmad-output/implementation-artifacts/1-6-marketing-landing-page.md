# Story 1.6: Marketing Landing Page

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **unauthenticated visitor**,
I want **to view a public landing page describing the product**,
so that **I can understand the value proposition before signing up**.

## Acceptance Criteria

### AC1: Root route shows public landing page for unauthenticated users
**Given** an unauthenticated visitor navigates to `/`  
**When** no authenticated session is present  
**Then** a public marketing landing page is shown (not authenticated dashboard)  
**And** the page is accessible without authentication.

### AC2: Landing content includes value proposition and CTA
**Given** landing page is displayed  
**When** visitor reads the page  
**Then** it includes product headline + value proposition, key feature highlights, and a prominent sign-up/sign-in CTA to `/login`  
**And** all text uses i18n keys in English and French.

### AC3: Landing page meets performance targets
**Given** landing page is loaded  
**When** measured under target conditions  
**Then** it meets NFR2: FCP < 1.5s and LCP < 2.5s on 4G.

### AC4: CTA navigates to login
**Given** visitor clicks landing CTA  
**When** action triggers  
**Then** visitor is redirected to `/login`.

## Tasks / Subtasks

- [ ] **Task 1: Define route behavior for public root page** (AC: #1, #4)
  - [ ] Ensure unauthenticated `/` resolves to marketing landing view.
  - [ ] Ensure authenticated users are routed to app dashboard path according to existing auth guard rules.
  - [ ] Keep route configuration aligned with React Router v7 structure.

- [ ] **Task 2: Build landing page UI with strict design-system rules** (AC: #1, #2)
  - [ ] Create landing page component under web app feature/page structure.
  - [ ] Include headline, value proposition block, key feature highlights, and primary CTA.
  - [ ] Use MUI components only (`sx`/`styled`), no CSS files and no inline `style={{}}`.

- [ ] **Task 3: Integrate i18n content for en/fr** (AC: #2)
  - [ ] Add landing translation keys in `apps/web/src/locales/en.json` and `fr.json`.
  - [ ] Ensure zero hardcoded user-visible strings in the component.
  - [ ] Validate rendering in both languages via language switch flow.

- [ ] **Task 4: Implement CTA navigation semantics** (AC: #4)
  - [ ] Wire CTA button/link to `/login` using router navigation.
  - [ ] Ensure keyboard accessibility and visible focus state for CTA.

- [ ] **Task 5: Add performance and rendering guardrails** (AC: #3)
  - [ ] Keep initial render lightweight (minimal blocking assets/components).
  - [ ] Avoid heavy runtime logic on first paint.
  - [ ] Verify page composition supports FCP/LCP targets in standard dev/prod build checks.

- [ ] **Task 6: Add focused frontend tests** (AC: #1, #2, #4)
  - [ ] Route test: unauthenticated `/` renders landing page.
  - [ ] Content test: headline/features/CTA are present via i18n keys.
  - [ ] CTA test: click/keyboard activation navigates to `/login`.

## Dev Notes

### Story Foundation

- This story closes Epic 1 public-facing entry requirements by delivering a clear pre-auth experience for visitors.
- It must coexist with auth shell flows from Story 1.4 and workspace/auth backend prerequisites from Stories 1.3/1.5.

### Technical Requirements

- Root path behavior must separate public visitor experience from authenticated app shell behavior.
- Public landing content must be fully internationalized (`en` + `fr`) via `react-i18next`.
- Design system constraints remain strict: MUI-only styling.
- CTA target is `/login`.

### Architecture Compliance

- Keep frontend as pure API consumer with no backend business logic duplication.
- Respect existing route guard architecture and avoid creating parallel auth checks.
- Maintain naming conventions: kebab-case files, camelCase/PascalCase symbols.
- Preserve accessibility and semantic structure baseline from NFR23–NFR26.

### Library / Framework Requirements

- React Router v7 for route mapping and navigation behavior.
- MUI for all visual/UI primitives.
- react-i18next for all user-facing text.
- Existing TanStack Query/Zustand stack remains unchanged; this story does not require new state management patterns.

### File Structure Requirements

- Expected frontend touchpoints (minimum):
  - apps/web/src/routes.tsx
  - apps/web/src/features/auth/login-page.tsx (if route links shared)
  - apps/web/src/features/marketing/landing-page.tsx (or equivalent feature path)
  - apps/web/src/locales/en.json
  - apps/web/src/locales/fr.json
- Keep tests co-located with the landing component/route logic.

### Testing Requirements

- Add Vitest + RTL tests for unauthenticated root routing, landing content rendering, and CTA redirect behavior.
- Verify no regression in authenticated route behavior when adding/modifying root route mapping.

### Previous Story Intelligence (1.5)

- Tenant/auth guards were strengthened in backend; landing route remains public and must not rely on protected API context.
- Authenticated flow and session refresh logic from 1.4 should remain unchanged when adding public root UX.

### Git Intelligence Summary

- Story delivery in this repo follows sequential implementation-artifact creation and sprint status transitions.
- Keep scope focused on landing page UX and routing behavior only; do not fold in unrelated dashboard/auth refactors.

### Latest Technical Information

- No new dependency is required for this story; use existing frontend stack and project conventions.
- For SEO direction from PRD, prefer a clean public route structure and metadata-friendly page composition; full SSR/SSG changes are out of this story scope.

### Project Context Reference

- No project-context.md file was discovered in this repository.
- Canonical context for this story:
  - _bmad-output/planning-artifacts/epics.md (Story 1.6)
  - _bmad-output/planning-artifacts/prd.md (FR4 + NFR2 + public landing SEO note)
  - _bmad-output/planning-artifacts/architecture.md (frontend/i18n/enforcement rules)
  - _bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md
  - _bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md

### References

- Source: _bmad-output/planning-artifacts/epics.md (Epic 1, Story 1.6)
- Source: _bmad-output/planning-artifacts/prd.md (FR4, NFR2, public landing SEO guidance)
- Source: _bmad-output/planning-artifacts/architecture.md (i18n and enforcement guidelines)
- Source: _bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md
- Source: _bmad-output/implementation-artifacts/1-4-frontend-shell-and-authentication-ui.md

## Story Completion Status

- Status set to **ready-for-dev**.
- Completion note: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Sprint source: _bmad-output/implementation-artifacts/sprint-status.yaml
- Story source: _bmad-output/planning-artifacts/epics.md (Story 1.6)
- Prior story intelligence: _bmad-output/implementation-artifacts/1-5-workspace-auto-creation-and-tenant-isolation.md

### Completion Notes List

- Selected next backlog story automatically from sprint status: 1-6-marketing-landing-page.
- Extracted acceptance criteria for public route behavior, i18n content, CTA flow, and performance constraints.
- Produced ready-for-dev artifact with implementation tasks, constraints, and test expectations.

### File List

- _bmad-output/implementation-artifacts/1-6-marketing-landing-page.md (created)
- _bmad-output/implementation-artifacts/sprint-status.yaml (updated)
