import { defineConfig } from 'drizzle-kit';
import { getRequiredEnv } from './src/config/env.utils';

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    '../../packages/shared/src/schemas/users.schema.ts',
    '../../packages/shared/src/schemas/workspaces.schema.ts',
    '../../packages/shared/src/schemas/refresh-tokens.schema.ts',
  ],
  out: './src/database/migrations',
  dbCredentials: {
    url: getRequiredEnv('DATABASE_URL'),
  },
  strict: true,
  verbose: true,
});
