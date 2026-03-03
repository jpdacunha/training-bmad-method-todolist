import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DATABASE_POOL } from '../../database/database.constants';
import { setupTestEnv } from '../../test/setup-test-env';

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
    app.setGlobalPrefix('api');
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
      ? setCookieHeader.find((c: string) => c.startsWith('oauth_state_google='))
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
      ? setCookieHeader.find((c: string) => c.startsWith('oauth_state_github='))
      : setCookieHeader;
    expect(stateCookie).toBeDefined();
  });

  it('GET /api/v1/auth/login/invalid returns 400 for unsupported provider', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/login/invalid')
      .expect(400);

    expect(response.body).toHaveProperty('title', 'Invalid OAuth provider');
    expect(response.body).toHaveProperty('status', 400);
  });

  it('GET /api/v1/auth/callback/google returns 400 when code/state missing', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/callback/google')
      .expect(400);

    expect(response.body).toHaveProperty('title', 'Invalid OAuth callback input');
  });

  it('POST /api/v1/auth/refresh returns 401 when no refresh cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .expect(401);

    expect(response.body).toHaveProperty('title', 'Unauthorized');
    expect(response.body).toHaveProperty('detail', 'Refresh token is missing.');
  });

  it('POST /api/v1/auth/sign-out returns 200 and clears cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/sign-out')
      .expect(200);

    expect(response.body).toEqual({ success: true });

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    const clearCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.find((c: string) => c.startsWith('refreshToken='))
      : setCookieHeader;
    expect(clearCookie).toBeDefined();
  });
});
