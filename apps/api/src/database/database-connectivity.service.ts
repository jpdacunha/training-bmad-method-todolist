import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseConnectivityService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseConnectivityService.name);

  async onApplicationBootstrap(): Promise<void> {
    const databaseUrl = process.env['DATABASE_URL'];

    if (!databaseUrl) {
      this.logger.warn('DATABASE_URL is not set; skipping PostgreSQL connectivity check.');
      return;
    }

    const client = new Client({ connectionString: databaseUrl });

    try {
      await client.connect();
      await client.query('SELECT 1');
      this.logger.log('PostgreSQL connectivity check passed.');
    } catch (error) {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`PostgreSQL connectivity check failed: ${message}`);
      throw error;
    } finally {
      await client.end().catch(() => undefined);
    }
  }
}
