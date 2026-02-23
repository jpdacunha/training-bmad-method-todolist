---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - '_bmad-output/brainstorming/brainstorming-session-2026-02-19.md'
  - '_bmad-output/planning-artifacts/research/market-application-de-gestion-de-taches-pour-freelancers-occupes-research-2026-02-19.md'
date: 2026-02-23
author: Jean-Paul
---

# Product Brief: training-bmad-method-todolist

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

Training-bmad-method-todolist is a focused, AI-assisted task management product designed for busy freelancers juggling multiple clients and projects. It solves the core problem that no existing tool reliably helps freelancers decide *what to work on right now* while gracefully absorbing the unplanned tasks that inevitably disrupt the day.

The product delivers a **living 5-day plan** — an intelligently ordered daily dashboard where tasks are ranked by a combined priority and profitability score. When new tasks arrive, priorities automatically re-calculate to find the optimal position in the workflow, turning chaotic multi-client days into a clear, confidence-backed execution sequence.

AI assists users in writing clear task descriptions that feed the prioritization engine, while always respecting manual priority overrides — the system never silently overrules the user's judgment. The result: freelancers start each day knowing exactly what to do first, absorb surprises without losing control, and protect their revenue by consistently executing high-value work.

---

## Core Vision

### Problem Statement

Busy freelancers managing multiple clients and concurrent tasks lack a tool that helps them decide what to work on now in a reliable, economically informed way. Current solutions (Asana, Trello, ClickUp, Toggl, spreadsheets) provide generic project management capabilities but force freelancers to mentally translate task lists into daily execution decisions — factoring in deadlines, profitability, dependencies, and shifting priorities entirely on their own. This cognitive overhead leads to misallocated effort, deadline risk, and chronic uncertainty about whether the day's work is truly optimized.

### Problem Impact

When this problem goes unsolved, freelancers experience:
- **Revenue leakage** — time spent on low-value tasks instead of high-impact deliverables
- **Deadline failures** — drift goes undetected until it's too late to recover
- **Decision fatigue** — constant mental recalculation of "what should I do next?" drains cognitive energy
- **Client trust erosion** — missed or tight deadlines damage relationships and repeat business
- **Chronic stress** — the nagging feeling of never being sure if you're working on the right thing

### Why Existing Solutions Fall Short

Current tools are built for broad team collaboration, not focused freelancer execution. They offer:
- **Too much flexibility, too little guidance** — powerful task boards but no intelligent ordering
- **Timer-dependent time tracking** — start/stop timers that break with real-world interruptions
- **Static plans** — no automatic re-prioritization when unplanned work arrives mid-day
- **Generic prioritization** — manual labels (high/medium/low) without economic relevance
- **Over-configuration** — complex setup required before any value is delivered

No existing product bridges the gap between *planned work* and *operational reality* in a simple, adaptive way.

### Proposed Solution

A focused daily execution tool for freelancers built around three pillars:

1. **Intelligent Daily Dashboard** — Tasks presented in calculated execution order based on a combined priority and profitability score. A precise 5-day planning window keeps the plan actionable without over-planning.

2. **Dynamic Re-Prioritization Engine** — When a new task is added mid-day, the system automatically re-evaluates and repositions all tasks to find the optimal workflow order. The plan adapts to reality in real time.

3. **AI-Assisted Task Clarity** — AI helps users write clear, well-structured task descriptions that enable the prioritization engine to accurately assess and rank work. Better input = better decisions.

The system explicitly respects manual priority overrides — if the user repositions a task, the system detects this and will not silently overrule that decision without warning.

### Key Differentiators

- **Living plan, not static list** — Automatic re-prioritization on every task change, not a one-time morning sort
- **5-day precision window** — Pragmatic planning horizon that matches freelancer reality
- **Plan vs. reality management** — The only tool designed to absorb unplanned work gracefully
- **AI-powered task clarity** — Intelligent assistance for writing task descriptions that feed smart prioritization
- **User sovereignty** — Manual overrides are detected and protected; the system advises, never dictates
- **Effort triangle tracking** — Estimate/spent/remaining as a first-class alternative to fragile start/stop timers
- **Zero-friction, zero-config** — Immediate value from first use with intelligent defaults

---

## Target Users

### Primary Users

#### Persona 1: Alex — The Freelance Multi-Client Operator

**Background:** Alex is a freelance developer/consultant managing 4–6 active clients simultaneously. Each client represents a "subject" — a coherent set of tasks tied to a broader deliverable. Alex works alone, sells time, and must protect both deadlines and profitability.

**Daily Reality:**
- Starts the day with 15–20 active tasks across multiple subjects
- Receives 2–3 unplanned requests daily via email, Slack, or calls
- Must constantly decide: continue current work, switch to something urgent, or split a task to unblock progress
- Communicates delivery dates to clients while mentally juggling shifting priorities
- Uses spreadsheets, Trello, or memory to track what's due when — none of it reliable under pressure

**Core Frustrations:**
- No single view showing the optimal work order across all clients
- Re-estimating delivery dates is a manual, error-prone exercise
- Splitting a large task into smaller actionable pieces is cumbersome in existing tools
- Cancelled or paused tasks clutter the workspace without clean archival

**Success Vision:** Alex opens the dashboard each morning and sees exactly what to work on first, with confidence that the order accounts for all deadlines and client value. When a surprise request arrives at 14h, Alex adds it, the plan reshuffles, and the impact on other deliverables is immediately visible.

---

#### Persona 2: Marc — The Team Leader Under Pressure

**Background:** Marc is a technical team leader in a services company or agency, working across 2–3 client projects and managing internal coordination tasks. He is both an executor (develops features, fixes issues) and a coordinator (unblocks developers, requests access, schedules meetings, reviews code).

**Daily Reality:**
- Handles 20–30 active tasks of wildly different natures: a 3-day feature, a 10-minute access request, a 30-minute meeting prep
- Receives a constant flow of new tasks from project managers, developers needing help, and client escalations
- Must provide delivery date commitments on new tasks while re-estimating dates for deprioritized work
- Needs to carry a task to a logical stopping point before switching — splitting tasks is essential to avoid losing context
- Cancels, reassigns, or archives tasks regularly as priorities shift

**Core Frustrations:**
- Context-switching overhead is enormous — interruptions break deep work
- No tool helps him see "if I take this new task now, what shifts downstream?"
- Splitting tasks to do the minimum needed and defer the rest is not natively supported anywhere
- Cancelled or reassigned tasks need to stay visible with context (comments) for traceability

**Success Vision:** Marc sees his day ordered by calculated priority. When his PM drops in an urgent client request, he adds it with an estimated duration, the system suggests where it fits, and he immediately sees which tasks slide. He splits a feature task into "the part needed to unblock the team today" and "the refinement for later," each with its own priority and estimate. At end of day, he knows exactly what was done, what moved, and what he'll tell stakeholders.

---

### Secondary Users

Any professional managing a high volume of concurrent tasks who must constantly re-evaluate priorities relative to each other — deciding when to deprioritize, delegate, abandon, or split work. This includes project coordinators, operations managers, and senior individual contributors in fast-paced environments. The product is not role-specific; it serves anyone whose day is defined by the tension between planned execution and incoming demands.

---

### User Journey

**Discovery:** User finds the product while searching for "task prioritization tool for freelancers" or "daily planning for team leads" — triggered by a missed deadline or a particularly chaotic week.

**Onboarding:** User creates their first subject and adds 5–10 existing tasks with rough estimates. AI suggests clearer descriptions and estimated durations. Within 10 minutes, the dashboard shows a prioritized daily plan. Zero configuration required.

**First Value Moment ("Aha!"):** An unplanned task arrives. User adds it. The system re-orders the day and visually shows what shifted. For the first time, the user *sees* the impact of the interruption AND has a credible new plan — instantly.

**Core Daily Usage:**
- Morning: Open dashboard → see today's ordered tasks across all subjects
- During day: Add unplanned tasks → watch re-prioritization happen → split tasks when needed to advance the minimum viable piece
- Communicate: Use updated estimates to give stakeholders reliable delivery dates
- End of day: Review completed/moved/cancelled tasks — clear picture of what happened

**Long-term Retention:** The product becomes the single source of truth for "what am I doing and in what order." The 5-day planning window and effort tracking triangle (estimate/spent/remaining) build a reliable execution rhythm. Users trust the system because it respects their manual overrides and never silently reshuffles without warning.

---

## Success Metrics

### User Success Metrics

**Core Success Statement:** "I always know what to do next, and I can handle the unexpected efficiently."

| Metric | Description | Target |
|---|---|---|
| **Next-action clarity** | % of sessions where the user starts work within 2 minutes of opening the dashboard | > 80% |
| **Unplanned task absorption** | Average time to add a new unplanned task and see the updated plan | < 30 seconds |
| **Zero-forgotten tasks** | % of tasks that reach a terminal state (completed, cancelled, or archived) vs. abandoned/stale | > 95% |
| **Daily re-prioritization usage** | % of active users who trigger at least one re-prioritization per day | > 60% |
| **Task split adoption** | % of active users using the split feature at least once per week | > 30% within first month |
| **Time management confidence** | User-reported confidence in their daily plan (periodic in-app micro-survey) | > 4/5 average |

### Business Objectives

**3-month objectives:**
- Validated product-market fit with a core group of active users
- Consistent weekly active user growth
- Actionable user feedback pipeline (feature requests, bug reports, evolution suggestions)

**12-month objectives:**
- Established user base with strong retention
- Clear signal on willingness to pay for premium features
- Product roadmap driven by real user evolution requests

### Key Performance Indicators

| KPI | Measurement | 3-Month Target | 12-Month Target |
|---|---|---|---|
| **Registered users** | Total sign-ups | 200+ | 2,000+ |
| **Weekly Active Users (WAU)** | Unique users with ≥1 session/week | 50+ | 500+ |
| **Retention (Week 4)** | % of users active 4 weeks after sign-up | > 25% | > 40% |
| **Tasks created per active user/week** | Average tasks added weekly | > 10 | > 15 |
| **Feature evolution requests** | User-submitted improvement suggestions per month | 10+ | 50+ |
| **Split feature usage rate** | % of active users using task split weekly | > 15% | > 30% |
| **Freemium → paid conversion** | % of free users converting to paid (when available) | N/A (freemium only) | > 5% |

**Leading Indicators (predictive of success):**
- Daily return rate (users who come back the next day)
- Number of subjects created per user (indicates multi-project adoption)
- Re-prioritization frequency (indicates trust in the dynamic planning engine)

**Anti-Metrics (what NOT to optimize for):**
- Raw task count without completion quality
- Session duration (longer ≠ better — the tool should be fast)
- Feature usage breadth over core workflow depth

---

## MVP Scope

### Core Features

**F1 — Task Dashboard (Day View + 5-Day Window)**
- Ordered daily task list showing tasks in calculated priority sequence
- 5-day forward planning view with precise ordering
- Visual distinction between task states (open, in progress, completed, cancelled, archived)
- Completed and cancelled tasks remain accessible in a filterable view

**F2 — Manual Task Creation**
- Create tasks with: title, description, subject, estimated duration, priority, deadline
- Assign tasks to subjects (coherent groupings replacing "projects")
- Quick-capture mode for minimal-friction task entry

**F3 — Automatic Re-Prioritization Engine**
- When a task is added, modified, or state-changed, all active tasks re-evaluate their position
- Priority score based on combined priority/deadline/effort weighting
- Re-ordered task list reflects the optimal execution sequence in real time

**F4 — Manual Re-Prioritization (Drag & Drop)**
- User can manually reorder tasks within the daily view via drag & drop
- Manual overrides are detected and protected — the system will not silently overrule them
- If the engine would suggest a different position, the user is notified but not forced

**F5 — Task Split with Filiation**
- Split any open or in-progress task into sub-tasks
- Each sub-task is independent: own priority, estimate, deadline
- Parent-child relationship preserved for traceability
- AI suggests priority and duration for newly split tasks

**F6 — Task State Management**
- States: Open → In Progress → Completed / Cancelled / Archived
- Cancel or archive with mandatory comment for traceability
- Cancelled/archived tasks remain visible unless explicitly deleted
- Permanent deletion available as a separate, intentional action
- Terminal states (completed, cancelled, deleted) are irreversible

### Out of Scope for MVP

| Feature | Rationale | Target Phase |
|---|---|---|
| AI-assisted task description writing | Not essential for core prioritization loop | V2 |
| Smart prefill from historical patterns | Requires usage data that doesn't exist yet | V2 |
| Effort tracking triangle (estimate/spent/remaining) | Adds complexity to task model before core is validated | V2 |
| Daily output in "days" tracking | Depends on effort tracking being in place | V2 |
| Gamification / overperformance badges | Engagement feature, not core value | V2+ |
| Client value evidence pack | Requires mature task data and reporting | V2+ |
| Task health badges (on-track/risk/problem) | Depends on effort tracking and drift detection | V2 |
| Drift signal / deadline risk alerts | Requires effort tracking foundation | V2 |
| External integrations (Jira, Teams) | Ecosystem play, not solo-user MVP | V3+ |
| Multi-user collaboration | Core product is single-user first | V3+ |

### MVP Success Criteria

**Go to V2 gate — validated when:**

1. **Core loop works:** Users can create tasks, see them ordered, add unplanned tasks mid-day, and trust the re-prioritized plan
2. **Split is used:** At least 15% of active users split tasks within the first month
3. **Daily return:** Users come back daily to check/update their dashboard
4. **No critical friction:** Task creation, re-ordering, and state changes feel fast and natural (< 30s per action)
5. **User feedback signal:** Active users submit feature evolution requests (indicating engagement and investment in the product)

**V2 follows immediately after V1 production deployment** — no waiting period. V2 features are pre-designed during MVP phase.

### Future Vision

**V2 — Intelligent Assistance (post-MVP, immediate follow-up):**
- AI-assisted task description writing for better prioritization inputs
- Effort tracking triangle (estimate/spent/remaining) per task
- Task health badges and drift detection without timer
- Smart prefill from historical patterns
- Deadline risk alerts and proactive re-planning suggestions

**V3 — Ecosystem & Scale:**
- External integrations: Jira (sync tasks bidirectionally), Microsoft Teams (notifications, task creation from chat)
- Multi-user mode for micro-teams with shared subjects
- Client value evidence pack (planned vs. actual, exportable reports)
- Advanced analytics and productivity insights

**Long-term Vision (2–3 years):**
A decision-quality execution platform that becomes the daily cockpit for any professional managing concurrent workstreams. Starting from solo freelancers and team leads, expanding to small teams and agencies. The core differentiator remains: the system that helps you decide what to do next, absorbs the unexpected, and never loses track of what matters.
