import { Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  refreshTokens,
  users,
  workspaces,
} from '@training-bmad-method-todolist/shared';
import { DATABASE_CLIENT, DATABASE_POOL } from './database.constants';

const logger = new Logger('DatabaseProvider');

const schema = {
  users,
  workspaces,
  refreshTokens,
};

export const databaseProviders = [
  {
    provide: DATABASE_POOL,
    useFactory: () => {
      const databaseUrl = process.env['DATABASE_URL'];

      if (!databaseUrl) {
        logger.warn('DATABASE_URL is not set; skipping Drizzle pool initialization.');
        return null;
      }

      return new Pool({ connectionString: databaseUrl });
    },
  },
  {
    provide: DATABASE_CLIENT,
    inject: [DATABASE_POOL],
    useFactory: (pool: Pool | null) => {
      if (!pool) {
        logger.warn('Drizzle client not initialized because pool is unavailable.');
        return null;
      }

      logger.log('Drizzle database client initialized.');

      return drizzle(pool, { schema });
    },
  },
];
