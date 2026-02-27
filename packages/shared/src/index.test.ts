import { describe, it, expect } from 'vitest';
import { TaskStatus, validTransitions, terminalStatuses } from './constants/task-status';
import { loginRequestSchema } from './schemas/auth.schema';
import { createTaskSchema } from './schemas/task.schema';

describe('Shared Package Exports', () => {
  describe('TaskStatus', () => {
    it('should have all lifecycle states', () => {
      expect(TaskStatus.Open).toBe('Open');
      expect(TaskStatus.InProgress).toBe('InProgress');
      expect(TaskStatus.Completed).toBe('Completed');
      expect(TaskStatus.Cancelled).toBe('Cancelled');
      expect(TaskStatus.Archived).toBe('Archived');
    });

    it('should define terminal statuses', () => {
      expect(terminalStatuses.has(TaskStatus.Completed)).toBe(true);
      expect(terminalStatuses.has(TaskStatus.Cancelled)).toBe(true);
      expect(terminalStatuses.has(TaskStatus.Open)).toBe(false);
    });

    it('should define valid state transitions', () => {
      const openTransitions = validTransitions.get(TaskStatus.Open);
      expect(openTransitions?.has(TaskStatus.InProgress)).toBe(true);
      expect(openTransitions?.has(TaskStatus.Completed)).toBe(false);
    });
  });

  describe('Auth Schema', () => {
    it('should validate login request with valid provider', () => {
      const result = loginRequestSchema.safeParse({ provider: 'google' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid provider', () => {
      const result = loginRequestSchema.safeParse({ provider: 'facebook' });
      expect(result.success).toBe(false);
    });
  });

  describe('Task Schema', () => {
    it('should validate task creation with title only (quick-capture)', () => {
      const result = createTaskSchema.safeParse({ title: 'Buy milk' });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = createTaskSchema.safeParse({ title: '' });
      expect(result.success).toBe(false);
    });
  });
});
