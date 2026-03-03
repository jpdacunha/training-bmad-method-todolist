import { z } from 'zod';

export const oauthProviderSchema = z.enum(['google', 'github']);

export const loginRequestSchema = z.object({
  provider: oauthProviderSchema,
});

export const accessTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export const signOutResponseSchema = z.object({
  success: z.literal(true),
});

export const problemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type AccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;
export type SignOutResponse = z.infer<typeof signOutResponseSchema>;
export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
