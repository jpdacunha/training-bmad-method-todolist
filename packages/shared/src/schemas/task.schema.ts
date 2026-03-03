import { z } from 'zod';
import { TaskStatus } from '../constants/task-status';

/**
 * Placeholder task schemas — will be expanded in Story 2.3 (Task CRUD Backend)
 */
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subjectId: z.uuid().optional(),
  priorityLevel: z.enum(['Low', 'Normal', 'High', 'Urgent']).default('Normal'),
  estimatedDuration: z.number().positive().optional(),
  deadline: z.iso.datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(TaskStatus),
  priorityLevel: z.enum(['Low', 'Normal', 'High', 'Urgent']),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Task = z.infer<typeof taskSchema>;
