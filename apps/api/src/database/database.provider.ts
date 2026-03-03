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
import { DATABASE_LOGGER_CONTEXT, DATABASE_INIT_MESSAGE } from '../constants/app.constants';

const logger = new Logger(DATABASE_LOGGER_CONTEXT);

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
      logger.log(DATABASE_INIT_MESSAGE);

      return drizzle(pool, { schema });
    },
  },
];
