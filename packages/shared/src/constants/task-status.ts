/**
 * Task lifecycle states
 * [Source: architecture.md#Data Boundaries — Task state machine]
 * Transitions: Open → InProgress → Completed/Cancelled/Archived
 */
export enum TaskStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Archived = 'Archived',
}

/**
 * Terminal states — irreversible
 */
export const terminalStatuses: ReadonlySet<TaskStatus> = new Set([
  TaskStatus.Completed,
  TaskStatus.Cancelled,
]);

/**
 * Valid state transitions map
 */
export const validTransitions: ReadonlyMap<TaskStatus, ReadonlySet<TaskStatus>> = new Map([
  [TaskStatus.Open, new Set([TaskStatus.InProgress, TaskStatus.Cancelled, TaskStatus.Archived])],
  [
    TaskStatus.InProgress,
    new Set([TaskStatus.Completed, TaskStatus.Cancelled, TaskStatus.Archived]),
  ],
  [TaskStatus.Completed, new Set([TaskStatus.Archived])],
  [TaskStatus.Cancelled, new Set()],
  [TaskStatus.Archived, new Set()],
]);
