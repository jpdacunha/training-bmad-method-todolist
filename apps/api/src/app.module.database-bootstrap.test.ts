import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { DATABASE_POOL } from './database/database.constants';
import { setupTestEnv } from './test/setup-test-env';

describe('AppModule database bootstrap', () => {
  let app: INestApplication;

  beforeAll(() => {
    setupTestEnv();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('boots application and runs database connectivity query when pool is provided', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [] });

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE_POOL)
      .useValue({ query })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    expect(query).toHaveBeenCalledWith('SELECT 1');
  });
});
