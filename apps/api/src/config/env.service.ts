import { Injectable } from '@nestjs/common';
import { getRequiredEnv, REQUIRED_ENV_KEYS, type RequiredEnvKey } from './env.utils';
import { NODE_ENV_PRODUCTION, NODE_ENV_KEY, ENV_LOG_PREFIX } from '../constants/app.constants';

@Injectable()
export class EnvService {
  private readonly requiredValues: Record<RequiredEnvKey, string>;

  constructor() {
    this.requiredValues = this.loadRequiredValues();
  }

  get databaseUrl(): string {
    return this.getValue('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.getValue('JWT_SECRET');
  }

  get googleClientId(): string {
    return this.getValue('GOOGLE_CLIENT_ID');
  }

  get googleClientSecret(): string {
    return this.getValue('GOOGLE_CLIENT_SECRET');
  }

  get googleRedirectUri(): string {
    return this.getValue('GOOGLE_REDIRECT_URI');
  }

  get githubClientId(): string {
    return this.getValue('GITHUB_CLIENT_ID');
  }

  get githubClientSecret(): string {
    return this.getValue('GITHUB_CLIENT_SECRET');
  }

  get githubRedirectUri(): string {
    return this.getValue('GITHUB_REDIRECT_URI');
  }

  get port(): number {
    const value = Number(this.getValue('PORT'));

    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`${ENV_LOG_PREFIX} PORT must be a positive integer.`);
    }

    return value;
  }

  get publicBaseUrl(): string {
    return this.getValue('PUBLIC_BASE_URL');
  }

  isProduction(): boolean {
    return process.env[NODE_ENV_KEY] === NODE_ENV_PRODUCTION;
  }

  private loadRequiredValues(): Record<RequiredEnvKey, string> {
    const values = {} as Record<RequiredEnvKey, string>;

    for (const key of REQUIRED_ENV_KEYS) {
      values[key] = getRequiredEnv(key);
    }

    return values;
  }

  private getValue(key: RequiredEnvKey): string {
    return this.requiredValues[key];
  }
}
