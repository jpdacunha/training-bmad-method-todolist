# Story 6.1: PWA Installation & Offline Read-Only Mode

Status: ready-for-dev

## Story

As a **user**,
I want **to install the application on my device and consult my plan even without internet**,
so that **I can check my tasks on the go without depending on connectivity**.

## Acceptance Criteria

### AC1: PWA installability
- Valid manifest and service worker enable install prompt; standalone launch works with expected theme/icon metadata.

### AC2: Caching strategy and offline read-only
- Cache app shell + dashboard data + static assets.
- Offline load <1s from cache and show last known task list.
- Mutations disabled in offline mode.

### AC3: Offline UX feedback
- Persistent warning alert “Offline mode — read only” (i18n).
- Mutation attempts offline show blocking Snackbar.

### AC4: Reconnect behavior
- On reconnect, offline alert clears, query data refetches, mutation controls re-enable, UI refreshes.

### AC5: Offline detection state
- `useOfflineDetection` updates Zustand online/offline state and dependent components react accordingly.

## Tasks / Subtasks

- [ ] Finalize `manifest.json` and icons.
- [ ] Implement/register service worker with stale-while-revalidate task-data strategy.
- [ ] Implement offline read-only mode guard for mutation controls.
- [ ] Add persistent offline alert and mutation-block Snackbar.
- [ ] Implement reconnect refresh flow with TanStack Query refetch.
- [ ] Wire Zustand online/offline state via hook.
- [ ] Add tests for offline UI state transitions and blocked actions.

## Story Completion Status

- Status set to **ready-for-dev**.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex
