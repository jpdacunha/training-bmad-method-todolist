import { databaseProviders } from './database.provider';
import { DATABASE_CLIENT, DATABASE_POOL } from './database.constants';

describe('databaseProviders', () => {
  const originalDatabaseUrl = process.env['DATABASE_URL'];

  afterEach(() => {
    process.env['DATABASE_URL'] = originalDatabaseUrl;
  });

  it('returns null pool when DATABASE_URL is missing', () => {
    delete process.env['DATABASE_URL'];

    const poolProvider = databaseProviders.find((provider) => provider.provide === DATABASE_POOL);
    expect(poolProvider).toBeDefined();

    const pool = (poolProvider?.useFactory as () => unknown)();
    expect(pool).toBeNull();
  });

  it('returns null database client when pool is null', async () => {
    const clientProvider = databaseProviders.find((provider) => provider.provide === DATABASE_CLIENT);
    expect(clientProvider).toBeDefined();

    const client = await (clientProvider?.useFactory as (pool: null) => Promise<unknown>)(null);
    expect(client).toBeNull();
  });

  it('creates database client when pool is available', () => {
    const clientProvider = databaseProviders.find((provider) => provider.provide === DATABASE_CLIENT);
    expect(clientProvider).toBeDefined();

    const pool = { query: jest.fn() };

    const client = (clientProvider?.useFactory as (pool: unknown) => unknown)(pool);

    expect(client).toBeDefined();
  });
});
