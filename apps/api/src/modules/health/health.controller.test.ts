import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from './health.controller';
import { AppModule } from '../../app.module';
import { DATABASE_POOL } from '../../database/database.constants';
import { setupTestEnv } from '../../test/setup-test-env';
import { API_GLOBAL_PREFIX } from '../../constants/app.constants';
import { HEALTH_STATUS_OK } from './health.constants';

describe('HealthController', () => {
  let controller: HealthController;
  let app: INestApplication;

  beforeAll(() => {
    setupTestEnv();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE_POOL)
      .useValue({ query: jest.fn().mockResolvedValue({ rows: [] }) })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix(API_GLOBAL_PREFIX);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return status ok with timestamp', () => {
    const result = controller.check();

    expect(result).toHaveProperty('status', HEALTH_STATUS_OK);
    expect(result).toHaveProperty('timestamp');
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });

  it('should return HTTP 200 on GET /api/health', async () => {
    const response = await request(app.getHttpServer()).get('/api/health').expect(200);

    expect(response.body).toHaveProperty('status', HEALTH_STATUS_OK);
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp).getTime()).not.toBeNaN();
  });
});
