---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional']
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-training-bmad-method-todolist-2026-02-23.md'
  - '_bmad-output/planning-artifacts/research/market-application-de-gestion-de-taches-pour-freelancers-occupes-research-2026-02-19.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-02-19.md'
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 1
  projectDocs: 0
workflowType: 'prd'
classification:
  projectType: 'web_app'
  domain: 'general'
  complexity: 'low'
  projectContext: 'greenfield'
---

# Product Requirements Document - training-bmad-method-todolist

**Author:** Jean-Paul
**Date:** 2026-02-23

## Executive Summary

Training-bmad-method-todolist is a web-based daily execution cockpit for busy freelancers and team leaders managing concurrent client workstreams. It solves the persistent problem that no existing tool reliably answers the question "what should I work on right now?" while gracefully absorbing the unplanned tasks that inevitably disrupt every working day.

The product delivers a living 5-day plan — an intelligently ordered daily dashboard where tasks are ranked by a combined priority score that puts reliable delivery first and uses economic value as a secondary optimizer. When new tasks arrive mid-day, the system automatically re-evaluates all active tasks and presents the updated optimal execution sequence. The plan adapts to reality in real time without destroying the user's existing organization.

Primary users are solo freelancers managing 4–6 concurrent clients and team leaders coordinating execution across multiple projects. Both share the same core need: start each day knowing exactly what to do first, absorb surprises without losing control, and protect long-term client relationships through consistent, reliable delivery.

### What Makes This Special

**Instant plan absorption:** When an unplanned task arrives, the user adds it and immediately sees the re-ordered plan with the downstream impact visible. This transforms the moment of disruption from anxiety ("everything is ruined") into confidence ("I have a new credible plan").

**Delivery-first prioritization:** The engine prioritizes reliable client delivery over short-term revenue maximization. Building long-term client trust through consistent execution is more profitable than optimizing individual task margins — the system encodes this principle directly into its ranking logic.

**User sovereignty over automation:** The system is a decision-support assistant, never an autocratic optimizer. Manual task ordering is treated as sacred — the system will never silently override a user's deliberate arrangement. If automatic re-prioritization would conflict with a manual override, the user is warned but never overruled. This design choice reflects a core insight: an optimization that destroys the user's carefully built organization is worse than no optimization at all, because recovering from an unwanted re-shuffle is extremely costly and frustrating.

**Zero-friction, zero-config:** Immediate value from first use with intelligent defaults. No complex setup, no learning curve before first productive session.

## Project Classification

| Attribute | Value |
|---|---|
| **Project Type** | Web Application (SPA/PWA) |
| **Domain** | Productivity / Task Management |
| **Complexity** | Low (no regulatory or compliance constraints) |
| **Project Context** | Greenfield (new product, no existing codebase) |

## Success Criteria

### User Success

| Metric | Description | Target |
|---|---|---|
| **Next-action clarity** | % of sessions where user starts work within 2 minutes of opening the dashboard | > 80% |
| **Unplanned task absorption** | Time to add a new unplanned task and see the updated plan | < 30 seconds |
| **Zero-forgotten tasks** | % of tasks reaching a terminal state (completed, cancelled, archived) vs. abandoned/stale | > 95% |
| **Daily re-prioritization usage** | % of active users triggering at least one re-prioritization per day | > 60% |
| **Task split adoption** | % of active users using the split feature at least once per week | > 30% within first month |
| **Time management confidence** | User-reported confidence in their daily plan (periodic in-app micro-survey, 1–5 scale) | > 4/5 average |

**Core success statement:** "I always know what to do next, and I can handle the unexpected without losing control."

### Business Success

| KPI | 3-Month Target | 12-Month Target |
|---|---|---|
| **Registered users** | 200+ | 2,000+ |
| **Weekly Active Users (WAU)** | 50+ | 500+ |
| **Retention (Week 4)** | > 25% | > 40% |
| **Tasks created per active user/week** | > 10 | > 15 |
| **Feature evolution requests/month** | 10+ | 50+ |
| **Split feature usage rate** | > 15% | > 30% |
| **Daily return rate** | Tracked as leading indicator | Tracked as leading indicator |

**Anti-metrics (do NOT optimize):**
- Raw task count without completion quality
- Session duration (longer ≠ better — the tool should be fast)
- Feature usage breadth over core workflow depth

### Technical Success

| Metric | Target |
|---|---|
| **Re-prioritization engine response** | < 2 seconds for dense projects (50+ active tasks across multiple subjects) |
| **Page load (dashboard)** | < 1.5 seconds on standard connection |
| **Task CRUD operations** | < 500ms perceived response |
| **Drag & drop reorder feedback** | < 100ms visual feedback |
| **Availability** | 99.5% uptime (planned maintenance excluded) |
| **Data integrity** | Zero data loss — all task state transitions are atomic and persisted |
| **Manual override protection** | System must never silently overwrite a user's manual ordering |

### Measurable Outcomes

**MVP validation gate — proceed to V2 when ALL are true:**
1. Users can create tasks, see them ordered, add unplanned tasks mid-day, and trust the re-prioritized plan
2. At least 15% of active users split tasks within the first month
3. Daily return rate demonstrates habitual usage
4. Task creation, re-ordering, and state changes feel fast and natural (< 30s per action)
5. Active users submit feature evolution requests (indicating engagement and investment)

## Product Scope

### MVP — Minimum Viable Product

| Feature | Description |
|---|---|
| **F1 — Task Dashboard** | Ordered daily task list in calculated priority sequence + 5-day forward planning view. Visual distinction between task states (open, in progress, completed, cancelled, archived). |
| **F2 — Manual Task Creation** | Create tasks with title, description, subject, estimated duration, priority, deadline. Assign to subjects. Quick-capture mode for minimal-friction entry. |
| **F3 — Automatic Re-Prioritization Engine** | On any task add/modify/state-change, all active tasks re-evaluate position. Priority score based on combined priority/deadline/effort weighting. Response < 2s. |
| **F4 — Manual Re-Prioritization (Drag & Drop)** | Drag & drop reorder within daily view. Manual overrides detected and protected — system warns but never silently overrules. |
| **F5 — Task Split with Filiation** | Split any open/in-progress task into independent sub-tasks with own priority, estimate, deadline. Parent-child relationship preserved for traceability. Enables fluid reorganization and effective deprioritization. |
| **F6 — Task State Management** | States: Open → In Progress → Completed / Cancelled / Archived. Cancel/archive with mandatory comment. Terminal states irreversible. Permanent deletion as separate intentional action. |

**MVP instrumentation:** Lightweight event tracking on key actions (sign-up, session start, task create, split, re-prioritization trigger) to measure validation KPIs. No user-facing analytics dashboard required.

### Growth Features (Post-MVP — V2)

| Feature | Rationale |
|---|---|
| AI-assisted task description writing | Better inputs for prioritization engine — not essential for core loop |
| Effort tracking triangle (estimate/spent/remaining) | Adds complexity before core is validated |
| Task health badges (on-track/risk/problem) | Depends on effort tracking |
| Drift signal / deadline risk alerts | Requires effort tracking foundation |
| Smart prefill from historical patterns | Requires usage data |
| Daily output in "days" tracking | Depends on effort tracking |

### Vision (Future — V3+)

| Feature | Rationale |
|---|---|
| External integrations (Jira, Teams) | Ecosystem play, not solo-user MVP |
| Multi-user collaboration | Core product is single-user first |
| Client value evidence pack | Requires mature task data and reporting |
| Gamification / overperformance badges | Engagement feature, not core value |
| Advanced analytics and productivity insights | Requires historical data depth |

## User Journeys

### Journey 1: Alex — A Productive Day Under Control

**Persona:** Alex, freelance developer managing 5 active clients. Today: 12 tasks across 3 subjects.

**Opening Scene:** Monday 8h30. Alex opens the dashboard with coffee in hand. The weekend brought two client emails requesting changes. The 5-day view shows the week ahead — today's column has 6 tasks ordered by priority. Two high-priority deliverables for Client A sit at the top, followed by a review task for Client B.

**Rising Action:** At 10h15, Client C calls — an urgent production bug. Alex creates the task with "urgent" priority and a 2-hour estimate. The engine re-calculates. The dashboard re-orders: the bug rises to position 2 (after the Client A deliverable already in progress), and two end-of-day tasks shift to tomorrow. Alex sees the impact instantly — Client B's review moves from today to tomorrow morning, but its deadline is Wednesday, so no risk.

**Climax:** At 14h, Alex realizes the Client A feature is bigger than estimated. Instead of panicking, Alex splits the task: "API integration" (2h, must finish today for the client demo) and "UI polish" (3h, can wait until Wednesday). Alex adds a comment on the split: "Demo requires only API integration — UI polish deferred to Wednesday, no client impact." The split sub-tasks each get their own priority. The engine repositions "UI polish" to Wednesday. Alex finishes the API integration, fixes Client C's bug, and marks both complete.

**Resolution:** At 17h30, Alex reviews the day: 4 tasks completed, 2 moved to tomorrow with no deadline risk, 1 task split strategically. Tomorrow's column already shows the updated plan. Alex sends Client B a message confirming the review delivery for tomorrow morning — with confidence, not guesswork.

---

### Journey 2: Alex — Three Fires, One Day

**Persona:** Alex, same freelance developer. Bad day scenario — everything hits at once.

**Opening Scene:** Wednesday 9h. Alex opens the dashboard: 8 tasks planned, a clean day. Then three things happen in 90 minutes: Client A escalates a deadline to today (was Friday), Client D sends an unexpected 4-hour task marked "blocking their release," and Alex discovers a dependency error in yesterday's Client C fix.

**Rising Action:** Alex adds all three disruptions. After each addition, the engine re-orders. The dashboard becomes dense — 11 tasks, 3 marked urgent. Alex looks at the 5-day view: Thursday and Friday are now overloaded. The system shows the cascade clearly, but doesn't panic — it presents the optimal sequence given all constraints.

**Climax:** Alex needs to make hard choices. He drags Client D's task down manually — it's important but Alex judges the dependency fix is more critical. The system detects the manual override and marks it with a visual indicator. No silent re-shuffle. Alex adds a comment: "Client D deprioritized — dependency fix for C blocks production, must resolve first." He then splits Client A's escalated deliverable into "minimum viable delivery" (2h) and "full polish" (3h, Friday), commenting: "Client A needs only core feature for today's go-live, polish can follow Friday." The minimum viable piece rises to position 1.

**Resolution:** By 18h, Alex has delivered the critical minimum to Client A, fixed the Client C dependency, and started Client D's task. Client D's remaining work sits cleanly in Thursday's column. Two tasks were deprioritized to Friday. It was a rough day, but Alex never lost the thread. Every decision was visible, every trade-off explicit, every rationale documented in comments. No task was forgotten or silently reshuffled.

---

### Journey 3: Marc — Unblocking the Team

**Persona:** Marc, technical team leader at a services agency. 3 client projects, 25 active tasks mixing deep feature work, access requests, code reviews, and meeting prep.

**Opening Scene:** Thursday 8h. Marc opens his dashboard and navigates between his subjects: "Client Projects" and "Internal Ops." In Client Projects, a 3-day feature for Client X is in progress, but a junior developer pinged overnight — she's blocked waiting for Marc's code review and a staging environment access request. In Internal Ops, sprint planning is at 14h and Marc hasn't prepared.

**Rising Action:** Marc splits his in-progress feature: "Review-ready code" (the part he can push now, 1h) and "Remaining integration" (continues tomorrow, 2h). He comments: "Push review-ready code to unblock Julie, remaining integration is non-blocking." He creates the access request task (10 min, high priority — it's blocking someone else). The engine positions it right after the code push. Marc handles it immediately — code pushed, access granted, junior developer unblocked by 9h30.

**Climax:** At 11h, the PM drops an urgent client escalation. Marc adds it with a 3-hour estimate. The engine re-prioritizes: the escalation slots in at position 1 for the afternoon, sprint prep moves to a 30-minute slot before the 14h meeting, and the remaining feature integration shifts to Friday. Marc sees the whole cascade. He splits sprint prep into "prepare deck" (20 min) and "detailed backlog grooming" (1h, move to Friday), commenting: "Minimum prep for today's meeting, detailed grooming merged into Friday planning session." The minimum prep fits before the meeting.

**Resolution:** Marc finishes the day having unblocked his developer, handled the escalation, run sprint planning with adequate prep, and kept the feature on track for Friday. His cancelled tasks carry mandatory comments explaining why. The activity log on each task tells the story of every decision. Nothing was lost, nothing silently disappeared.

---

### Journey 4: New User — From Zero to "Aha!"

**Persona:** Sophie, freelance UX designer. Heard about the tool from a colleague after a week of missed deadlines.

**Opening Scene:** Sophie signs up on a Sunday evening. No complex onboarding form — she enters her name, creates her first workspace ("Freelance"), and sees an empty dashboard. The interface is clean, not overwhelming. A subtle prompt suggests: "Create your first subject."

**Rising Action:** Sophie creates two subjects: "Client Rebranding" and "Mobile App Redesign." She adds 6 tasks across both — rough estimates, basic priorities. Within 5 minutes, the dashboard shows her Monday ordered by priority. She didn't configure any priority weights, scoring rules, or workflow — the intelligent defaults handle everything. She drags one task up manually because she knows it needs to go first — the system accepts it and marks it as a manual override.

**Climax:** Monday morning, Sophie opens the dashboard. Her day is laid out. She starts working. At 11h, a client emails an urgent wireframe revision. Sophie adds it — 1h, high priority, deadline today. The dashboard reshuffles. One task moves to Tuesday. Sophie sees exactly what shifted and why. For the first time, she doesn't feel the anxiety of "what did I just break in my schedule?" She feels informed.

**Resolution:** By Wednesday, Sophie has completed 15 tasks, split 2 that were too large, and absorbed 3 unplanned requests. She trusts the daily order. She hasn't touched a settings page. The tool works *for her* without asking her to work *for it*. She tells her colleague: "It's the first tool that actually showed me what happens to my plan when things change."

---

### Journey 5: Developer — API-First Architecture

**Persona:** Dev team consuming the backend API to build the SPA frontend and any future client.

**Opening Scene:** A developer starts building the frontend SPA. The backend exposes a complete REST API covering all product capabilities: workspaces, subjects, tasks, priorities, state transitions, split operations, re-prioritization triggers, and chronological activity logs.

**Rising Action:** The developer authenticates via the API, creates a workspace, adds subjects, and starts CRUD operations on tasks. Every operation that modifies tasks triggers the re-prioritization engine server-side — the API returns the updated ordered task list. Manual override flags are explicit in the API contract: when a task is repositioned via drag & drop, the frontend sends a manual-override signal, and the API persists this flag. Comments can be attached to any task action via the API.

**Climax:** The developer tests the split endpoint: POST a split request on a task with an optional comment explaining the split rationale, receive two new sub-tasks with independent properties and a parent reference. The re-prioritization runs automatically. The activity log endpoint returns the full chronological history of actions and comments for any task. The developer confirms that the API contract is complete — every feature in the product can be built entirely through API calls, with no business logic in the frontend.

**Resolution:** The API-first architecture means the SPA is a pure consumer. Any future client (mobile app, CLI tool, integration service) can deliver the same product experience by consuming the same API. The architectural investment pays forward into V2 and V3 without retrofit.

---

### Journey Requirements Summary

| Journey | Key Capabilities Revealed |
|---|---|
| **Alex — Productive Day** | Dashboard daily/5-day view, task creation, auto re-prioritization, task completion, state management |
| **Alex — Three Fires** | Multi-disruption handling, manual override with visual indicator, task split under pressure, cascade visibility, decision comments |
| **Marc — Unblocking** | Subject-based organization within single workspace, task split for partial delivery, cross-subject prioritization, cancel with comment traceability, activity log |
| **Sophie — Onboarding** | Zero-config first use, workspace/subject creation, intelligent defaults, first re-prioritization "aha" moment |
| **Developer — API** | Full REST API, server-side re-prioritization, manual override flag, split endpoint, activity log endpoint, stateless frontend |

**Cross-cutting capability: Chronological task activity log**

All task actions (creation, state changes, splits, manual overrides, cancellations) support optional user comments stored chronologically. This activity log provides full decision traceability — users can always understand *why* a task was split, moved, or cancelled by reading its history. Comments are mandatory for cancel/archive actions and optional for all other actions.

## Web Application Specific Requirements

### Project-Type Overview

Single-Page Application (SPA) built as a Progressive Web App (PWA), consumed via all major desktop and mobile browsers. The frontend is a stateless API consumer — all business logic lives server-side. The PWA approach enables mobile installation and offline task consultation without building native apps.

### Technical Architecture Considerations

**Architecture:** API-first with strict separation — SPA frontend consumes REST API backend. Zero business logic in the frontend. This architectural constraint is non-negotiable as it enables future clients (mobile native, CLI, integrations) without retrofit.

**Communication model:** Request-response (REST) for MVP. No WebSocket/SSE required for single-user mode. Architecture should accommodate future long-running async processing (AI features in V2+) — consider a job/queue pattern that can be introduced later without breaking the API contract.

**PWA capabilities:**
- Installable on mobile and desktop via manifest
- Service worker for offline read access to cached dashboard and task data
- Offline task viewing: users can consult their current plan without connectivity
- Task mutations (create, edit, split, state change) require connectivity — queued offline mutations are out of scope for MVP
- Background sync for reconnection is a V2 consideration

### Browser Support Matrix

| Browser | Version | Priority |
|---|---|---|
| Chrome | Latest 2 versions | Primary |
| Firefox | Latest 2 versions | Primary |
| Safari | Latest 2 versions | Primary (including iOS Safari) |
| Edge | Latest 2 versions | Primary |
| Chrome Mobile (Android) | Latest 2 versions | Primary |
| Safari Mobile (iOS) | Latest 2 versions | Primary |

### Responsive Design

| Breakpoint | Target | Experience |
|---|---|---|
| Desktop (≥1024px) | Primary workspace | Full dashboard, 5-day view, drag & drop |
| Tablet (768–1023px) | Secondary workspace | Adapted dashboard, touch-friendly drag & drop |
| Mobile (< 768px) | On-the-go consultation & quick actions | Day view priority, quick task creation, state changes. Simplified 5-day view. |

**Mobile-specific considerations:**
- Touch-optimized drag & drop for manual re-prioritization
- Swipe gestures for task state changes (optional V2 enhancement)
- Compact task cards optimized for small screens
- Quick-capture mode prominent for mobile task entry

### Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s on 4G connection |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Re-prioritization engine response | < 2s for 50+ active tasks |
| Task CRUD perceived response | < 500ms |
| Drag & drop visual feedback | < 100ms |
| PWA install prompt | Available after first session |
| Offline dashboard load | < 1s from service worker cache |

### SEO Strategy

SEO applies exclusively to the public-facing marketing/landing pages, not the authenticated application. The SPA behind authentication requires no SEO optimization. Marketing pages should be server-rendered or statically generated for search engine indexing.

### Accessibility (MVP Level)

Pragmatic accessibility approach for MVP, focusing on high-impact, low-effort standards:

| Area | Requirement |
|---|---|
| **Color contrast** | WCAG 2.1 AA minimum contrast ratios (4.5:1 for normal text, 3:1 for large text) |
| **Semantic HTML** | Proper heading hierarchy, landmark regions, button/link distinction |
| **Keyboard navigation** | All interactive elements reachable and operable via keyboard |
| **Focus indicators** | Visible focus states on all interactive elements |
| **ARIA labels** | Meaningful labels on icon-only buttons, drag & drop regions, and dynamic content updates |
| **Screen reader basics** | Task state changes and re-prioritization results announced to assistive technology |
| **Reduced motion** | Respect `prefers-reduced-motion` for animations and transitions |

Full WCAG 2.1 AA compliance is a V2 goal. MVP focuses on clean semantic code, contrast, and keyboard operability as the foundation.

### Implementation Considerations

**Frontend framework:** SPA framework with strong PWA support and component model suited to complex interactive dashboards (React, Vue, or Svelte — decision deferred to architecture phase).

**Offline strategy:** Service worker caches the dashboard view and task data on each authenticated session. Stale-while-revalidate pattern for task list. Clear visual indicator when offline ("read-only mode").

**State management:** Client-side state must handle optimistic updates for perceived performance on task actions, with server reconciliation on response.

**Future-proofing for async processing:** API design should support a pattern where long-running operations (future AI features) return a job ID with polling or callback, rather than blocking the request. This can be introduced without breaking existing synchronous endpoints.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — validate that the core loop (create → prioritize → absorb disruptions → split → execute) generates user confidence and daily return. The technological foundation must enforce API-first architecture from day one to avoid costly retrofit.

**Key architectural decisions locked for MVP:**
- API-first: all features consumed through REST API, zero business logic in frontend
- Workspace as tenant isolation: 1 user = 1 workspace, data fully isolated between users
- Pluggable prioritization engine: default algorithm (Impact 50% / Deadline 30% / Effort 20%) implemented as a replaceable component. Architecture must allow swapping algorithms and customizing weights in future versions without structural changes.
- PWA-capable SPA with offline read access

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Alex — Productive Day (happy path daily execution)
- Alex — Three Fires (multi-disruption crisis management)
- Sophie — Onboarding (zero-config first value)

**Must-Have Capabilities:**

| # | Capability | Justification |
|---|---|---|
| F1 | Task Dashboard (day view + 5-day window) | Core value delivery — "what to do next" |
| F2 | Manual Task Creation with subject assignment | Input mechanism for all task data |
| F3 | Automatic Re-Prioritization Engine | Core differentiator — living plan that absorbs change |
| F4 | Manual Re-Prioritization (Drag & Drop) | User sovereignty — overrides protected and visible |
| F5 | Task Split with Filiation | Enables fluid reorganization and effective deprioritization |
| F6 | Task State Management | Lifecycle control with traceability (mandatory comments on cancel/archive) |
| F7 | Chronological Activity Log | Decision traceability — comments on all task actions |
| F8 | Workspace & Subject Management | Tenant isolation (1 user = 1 workspace), N subjects per workspace |
| F9 | OAuth Authentication (Google, GitHub) | User access — no email/password for MVP |
| F10 | Lightweight Event Tracking | MVP validation instrumentation (sign-up, session, key actions) |

**Explicitly NOT in MVP:**
- AI-assisted task descriptions
- Effort tracking triangle (estimate/spent/remaining)
- Task health badges and drift detection
- Smart prefill from historical patterns
- External integrations (Jira, Teams)
- Multi-user collaboration
- Custom prioritization weights (architecture supports it, UI does not expose it)
- Offline task mutations (read-only offline)
- Queued background jobs / async processing

### Post-MVP Features

**Phase 2 — Intelligent Assistance (V2):**

| Feature | Dependency |
|---|---|
| AI-assisted task description writing | Async processing architecture |
| Effort tracking triangle (estimate/spent/remaining) | Core task model extension |
| Task health badges (on-track/risk/problem) | Effort tracking |
| Drift signal / deadline risk alerts | Effort tracking |
| Smart prefill from historical patterns | Usage data accumulation |
| Daily output in "days" tracking | Effort tracking |
| Custom prioritization weights UI | Pluggable engine architecture (MVP) |
| Multiple algorithm selection | Pluggable engine architecture (MVP) |
| Offline task mutations with sync | Service worker + conflict resolution |

**Phase 3 — Ecosystem & Scale (V3+):**

| Feature | Dependency |
|---|---|
| External integrations (Jira, Teams) | API-first architecture (MVP) |
| Multi-user collaboration | Workspace tenant model (MVP) |
| Client value evidence pack | Mature task data + reporting |
| Gamification / overperformance badges | Usage data depth |
| Advanced analytics and productivity insights | Historical data |

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Re-prioritization engine performance at scale (50+ tasks) | Core experience degradation | Benchmark early, optimize algorithm, set <2s hard target |
| Prioritization algorithm accuracy | Users lose trust, stop using auto-prioritization | Ship with validated default (50/30/20), architecture allows rapid iteration on weights |
| PWA offline/online sync complexity | Data inconsistency, user confusion | MVP = read-only offline, clear "offline mode" indicator, defer mutations to V2 |
| Drag & drop cross-browser/touch consistency | Broken core interaction on mobile | Use proven DnD library, test on target browser matrix early |

**Market Risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Users don't trust auto-prioritization | Core differentiator fails | User sovereignty principle — system suggests, never dictates. Override protection builds trust |
| Adoption blocked by OAuth-only auth | Some users want email/password | Monitor sign-up abandonment rate, add email/password in fast-follow if needed |
| Free tier incumbents (Asana, Trello) too entrenched | Acquisition cost too high | Compete on decision quality, not feature breadth. First-session "aha" moment is critical |

**Resource Risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep into V2 features during MVP | Delayed launch, diluted focus | Strict feature gate — if not in the Must-Have table, it waits |
| Underestimated complexity of split + filiation | Core feature delayed | Prototype data model early, validate parent-child integrity under re-prioritization |

## Functional Requirements

### Authentication & User Access

- FR1: User can authenticate via OAuth (Google or GitHub) to access the application
- FR2: User can sign out of the application
- FR3: User's session persists across browser sessions until explicit sign-out
- FR4: Unauthenticated visitors can view marketing/landing pages without sign-in

### Workspace & Subject Management

- FR5: Upon first authentication, a workspace is automatically created for the user
- FR6: User can create subjects within their workspace to group related tasks
- FR7: User can rename a subject
- FR8: User can archive a subject (removes from active view, preserves data)
- FR9: User can view all their subjects with associated task counts
- FR10: Each user's workspace is fully isolated — no cross-user data visibility

### Task Creation & Editing

- FR11: User can create a task with title, description, subject, estimated duration, priority level, and deadline
- FR12: User can create a task using quick-capture mode (title only, minimal fields) for low-friction entry
- FR13: User can edit any mutable property of an open or in-progress task
- FR14: User can assign or reassign a task to a different subject

### Task Prioritization — Automatic

- FR15: System automatically calculates a priority score for every active task based on a weighted formula (Impact / Deadline / Effort)
- FR16: System automatically re-evaluates and re-orders all active tasks when any task is added, modified, or changes state
- FR17: System presents tasks in calculated priority order on the dashboard
- FR18: Re-prioritization completes and displays results within the performance target (<2s)

### Task Prioritization — Manual Override

- FR19: User can manually reorder tasks within the daily view via drag & drop
- FR20: System detects and visually marks tasks that have been manually overridden
- FR21: System preserves manual overrides — automatic re-prioritization never silently displaces a manually positioned task
- FR22: If automatic re-prioritization would suggest a different position for a manually overridden task, the system notifies the user but does not force the change
- FR52: User can release a manual override on a task, returning it to automatic prioritization
- FR53: When a manual override is released, the system immediately re-evaluates and repositions the task according to the current priority algorithm

### Task Split & Filiation

- FR23: User can split any open or in-progress task into two or more sub-tasks
- FR24: Each sub-task created by a split is independent: own title, description, priority, estimate, deadline, and subject
- FR25: Parent-child relationship between original task and split sub-tasks is preserved and visible
- FR26: User can add a comment explaining the rationale when splitting a task
- FR27: Split sub-tasks participate independently in automatic re-prioritization

### Task State Management

- FR28: Task states follow the lifecycle: Open → In Progress → Completed / Cancelled / Archived
- FR29: User can transition a task to "In Progress" state
- FR30: User can mark a task as "Completed"
- FR31: User can cancel a task with a mandatory comment explaining the reason
- FR32: User can archive a task with a mandatory comment
- FR33: User can permanently delete a task as a separate, intentional action
- FR34: Terminal states (Completed, Cancelled, Deleted) are irreversible
- FR35: Completed and cancelled tasks remain accessible in a filterable view

### Activity Log & Traceability

- FR36: User can add a comment to any task action (creation, state change, split, manual override, edit)
- FR37: All task actions and their associated comments are stored chronologically as an activity log on the task
- FR38: User can view the complete chronological activity log for any task
- FR39: Comments are mandatory for cancel and archive actions, optional for all others

### Dashboard & Planning Views

- FR40: User can view a daily dashboard showing today's tasks in priority-calculated order
- FR41: User can view a 5-day forward planning window showing tasks distributed across upcoming days, with the option to include or exclude non-business days
- FR42: Dashboard visually distinguishes between task states (open, in progress, completed, cancelled, archived)
- FR43: Dashboard shows the impact of re-prioritization — when tasks shift position or day, the change is visible
- FR44: User can filter tasks by subject, state, or priority level
- FR45: User can switch between day view and 5-day view
- FR54: User can toggle the 5-day planning view between business days only (Monday–Friday) and all days (including weekends)

### Offline & PWA

- FR46: User can install the application as a PWA on mobile and desktop
- FR47: User can view their cached dashboard and task data when offline (read-only)
- FR48: System displays a clear visual indicator when in offline mode
- FR49: System refreshes cached data when connectivity is restored

### Analytics Instrumentation

- FR50: System tracks key user events (sign-up, session start, task creation, split, re-prioritization trigger, state changes) for MVP validation purposes
- FR51: Event tracking is non-intrusive and does not impact application performance

## Non-Functional Requirements

### Performance

| Requirement | Target | Context |
|---|---|---|
| NFR1: Re-prioritization engine response time | < 2s for workspaces with 50+ active tasks | Core experience — must feel instant for plan absorption effect |
| NFR2: Dashboard initial load | < 1.5s FCP, < 2.5s LCP on 4G | First impression and daily return experience |
| NFR3: Task CRUD operations perceived response | < 500ms | Must feel instant for zero-friction capture |
| NFR4: Drag & drop visual feedback | < 100ms | Direct manipulation must feel immediate |
| NFR5: Offline dashboard load from cache | < 1s | PWA value proposition for mobile users |
| NFR6: API response time for standard endpoints | < 300ms p95 for CRUD, < 2s p95 for re-prioritization | Backend contract for frontend responsiveness |
| NFR7: Concurrent user support | 100 simultaneous active users minimum at launch | Based on 200 registered / ~50 WAU target |

### Security

| Requirement | Target | Context |
|---|---|---|
| NFR8: Data isolation | Workspace-level tenant isolation — no API endpoint may return data from another user's workspace | Fundamental trust requirement |
| NFR9: Authentication | OAuth 2.0 (Google, GitHub) with secure token management | No password storage in MVP |
| NFR10: Data in transit | TLS 1.2+ on all connections (API, frontend, OAuth flows) | Industry standard |
| NFR11: Data at rest | Encryption at rest for all persistent user data | Protect task content, comments, and activity logs |
| NFR12: Session management | Secure, httpOnly, sameSite cookies or token-based sessions with expiration and refresh | Prevent session hijacking |
| NFR13: API security | Rate limiting on all endpoints, input validation, protection against OWASP Top 10 | Standard web application security |
| NFR14: GDPR compliance | User can request data export and account deletion. No personal data shared with third parties without consent. | EU user base likely for a global SaaS |

### Scalability

| Requirement | Target | Context |
|---|---|---|
| NFR15: User growth capacity | System supports 10x growth (2,000 → 20,000 users) without architectural changes | Architecture must not bottleneck at early scale |
| NFR16: Data growth per user | Support up to 1,000 tasks per workspace (including archived) without performance degradation | Power users accumulate data over months |
| NFR17: Horizontal scaling capability | Backend must be stateless to allow horizontal scaling behind a load balancer | Future-proofing for growth |

### Reliability

| Requirement | Target | Context |
|---|---|---|
| NFR18: Availability | 99.5% uptime (excluding planned maintenance) | Daily-use tool — downtime blocks the user's day |
| NFR19: Data durability | Zero data loss — all task state transitions and comments are atomically persisted | Activity log and traceability depend on this |
| NFR20: Backup and recovery | Automated daily backups with point-in-time recovery capability | Protect against data corruption or accidental deletion |
| NFR21: Graceful degradation | If re-prioritization engine is temporarily slow, dashboard still renders with last known order | Don't block the core view if a subsystem is degraded |
| NFR22: Error handling | All API errors return structured, actionable error responses. Frontend displays user-friendly error messages. | No silent failures, no cryptic error codes |

### Accessibility

| Requirement | Target | Context |
|---|---|---|
| NFR23: Color contrast | WCAG 2.1 AA minimum (4.5:1 normal text, 3:1 large text) | Readability for all users |
| NFR24: Keyboard operability | All interactive elements reachable and operable via keyboard, including drag & drop alternative | Core interaction must work without mouse |
| NFR25: Semantic structure | Proper heading hierarchy, landmark regions, ARIA labels on dynamic content | Screen reader compatibility foundation |
| NFR26: Motion sensitivity | Respect `prefers-reduced-motion` for all animations and transitions | Prevent motion-triggered discomfort |

