import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from './database.constants';

@Injectable()
export class DatabaseConnectivityService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseConnectivityService.name);

  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.pool.query('SELECT 1');
      this.logger.log('PostgreSQL connectivity check passed via initialized pool.');
    } catch (error) {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`PostgreSQL connectivity check failed: ${message}`);
      throw error;
    }
  }
}
