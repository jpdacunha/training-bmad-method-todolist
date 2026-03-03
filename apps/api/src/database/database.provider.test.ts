import { databaseProviders } from './database.provider';
import { DATABASE_CLIENT, DATABASE_POOL } from './database.constants';
import { EnvService } from '../config/env.service';
import { Pool } from 'pg';

describe('databaseProviders', () => {
  it('creates pool when DATABASE_URL is provided by EnvService', () => {
    const poolProvider = databaseProviders.find((provider) => provider.provide === DATABASE_POOL);
    expect(poolProvider).toBeDefined();

    const pool = (poolProvider?.useFactory as (envService: EnvService) => unknown)({
      databaseUrl: 'postgresql://postgres:postgres@localhost:5432/todolist',
    } as EnvService);

    expect(pool).toBeDefined();

    return (pool as Pool).end();
  });

  it('creates database client when pool is available', () => {
    const clientProvider = databaseProviders.find((provider) => provider.provide === DATABASE_CLIENT);
    expect(clientProvider).toBeDefined();

    const pool = { query: jest.fn() };

    const client = (clientProvider?.useFactory as (pool: unknown) => unknown)(pool);

    expect(client).toBeDefined();
  });
});
