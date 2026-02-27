import { z } from 'zod';

/**
 * Placeholder auth schemas — will be expanded in Story 1.3 (OAuth Authentication Backend)
 */
export const loginRequestSchema = z.object({
  provider: z.enum(['google', 'github']),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
