import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from './database.constants';
import {
  DATABASE_CONNECTIVITY_QUERY,
  DATABASE_CONNECTIVITY_SUCCESS_MESSAGE,
  DATABASE_CONNECTIVITY_FAILURE_PREFIX,
} from '../constants/app.constants';

@Injectable()
export class DatabaseConnectivityService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseConnectivityService.name);

  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.pool.query(DATABASE_CONNECTIVITY_QUERY);
      this.logger.log(DATABASE_CONNECTIVITY_SUCCESS_MESSAGE);
    } catch (error) {
      const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
      this.logger.error(`${DATABASE_CONNECTIVITY_FAILURE_PREFIX}${message}`);
      throw error;
    }
  }
}
