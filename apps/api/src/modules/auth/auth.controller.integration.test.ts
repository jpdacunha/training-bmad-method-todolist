import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DATABASE_POOL } from '../../database/database.constants';
import { setupTestEnv } from '../../test/setup-test-env';
import { API_GLOBAL_PREFIX } from '../../constants/app.constants';
import {
  AUTH_ERROR_TITLE_INVALID_PROVIDER,
  AUTH_ERROR_TITLE_INVALID_CALLBACK,
  AUTH_ERROR_TITLE_UNAUTHORIZED,
  AUTH_ERROR_DETAIL_REFRESH_MISSING,
  AUTH_HTTP_STATUS_BAD_REQUEST,
  OAUTH_STATE_COOKIE_PREFIX,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../auth/auth.constants';

describe('AuthController HTTP integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    setupTestEnv();

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

  it('GET /api/v1/auth/login/google returns redirect URL with PKCE params', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/login/google')
      .expect(200);

    expect(response.body).toHaveProperty('redirectUrl');
    expect(response.body.redirectUrl).toContain('accounts.google.com');
    expect(response.body.redirectUrl).toContain('code_challenge_method=S256');
    expect(response.body.redirectUrl).toContain('code_challenge=');

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    const stateCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.find((c: string) => c.startsWith(`${OAUTH_STATE_COOKIE_PREFIX}google=`))
      : setCookieHeader;
    expect(stateCookie).toBeDefined();
  });

  it('GET /api/v1/auth/login/github returns redirect URL with PKCE params', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/login/github')
      .expect(200);

    expect(response.body).toHaveProperty('redirectUrl');
    expect(response.body.redirectUrl).toContain('github.com/login/oauth/authorize');
    expect(response.body.redirectUrl).toContain('code_challenge_method=S256');
    expect(response.body.redirectUrl).toContain('code_challenge=');

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    const stateCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.find((c: string) => c.startsWith(`${OAUTH_STATE_COOKIE_PREFIX}github=`))
      : setCookieHeader;
    expect(stateCookie).toBeDefined();
  });

  it('GET /api/v1/auth/login/invalid returns 400 for unsupported provider', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/login/invalid')
      .expect(400);

    expect(response.body).toHaveProperty('title', AUTH_ERROR_TITLE_INVALID_PROVIDER);
    expect(response.body).toHaveProperty('status', AUTH_HTTP_STATUS_BAD_REQUEST);
  });

  it('GET /api/v1/auth/callback/google returns 400 when code/state missing', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/callback/google')
      .expect(400);

    expect(response.body).toHaveProperty('title', AUTH_ERROR_TITLE_INVALID_CALLBACK);
  });

  it('POST /api/v1/auth/refresh returns 401 when no refresh cookie', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/auth/refresh').expect(401);

    expect(response.body).toHaveProperty('title', AUTH_ERROR_TITLE_UNAUTHORIZED);
    expect(response.body).toHaveProperty('detail', AUTH_ERROR_DETAIL_REFRESH_MISSING);
  });

  it('POST /api/v1/auth/sign-out returns 200 and clears cookie', async () => {
    const response = await request(app.getHttpServer()).post('/api/v1/auth/sign-out').expect(200);

    expect(response.body).toEqual({ success: true });

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    const clearCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.find((c: string) => c.startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`))
      : setCookieHeader;
    expect(clearCookie).toBeDefined();
  });
});
