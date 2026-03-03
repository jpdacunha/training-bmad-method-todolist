import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    '../../packages/shared/src/schemas/users.schema.ts',
    '../../packages/shared/src/schemas/workspaces.schema.ts',
    '../../packages/shared/src/schemas/refresh-tokens.schema.ts',
  ],
  out: './src/database/migrations',
  dbCredentials: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/todolist',
  },
  strict: true,
  verbose: true,
});
