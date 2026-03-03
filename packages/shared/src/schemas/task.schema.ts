import { z } from 'zod';
import { TaskStatus } from '../constants/task-status';
import {
  PRIORITY_LEVELS,
  PRIORITY_LEVEL_NORMAL,
  TASK_VALIDATION_TITLE_REQUIRED,
} from '../constants/task-priority.constants';

/**
 * Placeholder task schemas — will be expanded in Story 2.3 (Task CRUD Backend)
 */
export const createTaskSchema = z.object({
  title: z.string().min(1, TASK_VALIDATION_TITLE_REQUIRED),
  description: z.string().optional(),
  subjectId: z.uuid().optional(),
  priorityLevel: z.enum(PRIORITY_LEVELS).default(PRIORITY_LEVEL_NORMAL),
  estimatedDuration: z.number().positive().optional(),
  deadline: z.iso.datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(TaskStatus),
  priorityLevel: z.enum(PRIORITY_LEVELS),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Task = z.infer<typeof taskSchema>;
