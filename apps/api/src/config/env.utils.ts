import { ENV_LOG_PREFIX } from '../constants/app.constants';

export const REQUIRED_ENV_KEYS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GITHUB_REDIRECT_URI',
  'PORT',
  'PUBLIC_BASE_URL',
] as const;

export type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

export function getRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${ENV_LOG_PREFIX} Missing required environment variable: ${key}`);
  }

  return value;
}
