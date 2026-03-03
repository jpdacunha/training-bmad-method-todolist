/**
 * Task priority levels
 * [Source: architecture.md#Data Boundaries — Task priority]
 */
export const PRIORITY_LEVEL_LOW = 'Low' as const;
export const PRIORITY_LEVEL_NORMAL = 'Normal' as const;
export const PRIORITY_LEVEL_HIGH = 'High' as const;
export const PRIORITY_LEVEL_URGENT = 'Urgent' as const;

export const PRIORITY_LEVELS = [
  PRIORITY_LEVEL_LOW,
  PRIORITY_LEVEL_NORMAL,
  PRIORITY_LEVEL_HIGH,
  PRIORITY_LEVEL_URGENT,
] as const;

/**
 * Validation messages for task schemas
 */
export const TASK_VALIDATION_TITLE_REQUIRED = 'Title is required';
