/**
 * OAuth provider constants
 * [Source: architecture.md#Auth — OAuth providers for MVP]
 */
export const OAUTH_PROVIDER_GOOGLE = 'google' as const;
export const OAUTH_PROVIDER_GITHUB = 'github' as const;
export const OAUTH_PROVIDERS = [OAUTH_PROVIDER_GOOGLE, OAUTH_PROVIDER_GITHUB] as const;
