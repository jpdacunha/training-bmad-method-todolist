import { Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import {
  refreshTokens,
  users,
  workspaces,
} from '@training-bmad-method-todolist/shared';
import { DATABASE_CLIENT, DATABASE_POOL } from './database.constants';
import { EnvService } from '../config/env.service';

const logger = new Logger('DatabaseProvider');

const schema = {
  users,
  workspaces,
  refreshTokens,
};

export type DatabaseSchema = typeof schema;

export const databaseProviders = [
  {
    provide: DATABASE_POOL,
    inject: [EnvService],
    useFactory: (envService: EnvService) => new Pool({ connectionString: envService.databaseUrl }),
  },
  {
    provide: DATABASE_CLIENT,
    inject: [DATABASE_POOL],
    useFactory: (pool: Pool) => {
      logger.log('Drizzle database client initialized.');

      return drizzle(pool, { schema });
    },
  },
];
