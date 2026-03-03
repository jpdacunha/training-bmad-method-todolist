import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { API_GLOBAL_PREFIX } from '../../constants/app.constants';
import {
  OAUTH_STATE_COOKIE_PREFIX,
  AUTH_COOKIE_PATH,
} from './auth.constants';

describe('AuthController rate limit', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60_000,
            limit: 10,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateLoginResponse: jest.fn().mockReturnValue({
              redirectUrl: 'https://example.com/oauth',
              stateCookie: {
                name: `${OAUTH_STATE_COOKIE_PREFIX}google`,
                value: 'state',
                options: {
                  httpOnly: true,
                  secure: false,
                  sameSite: 'lax',
                  maxAge: 600_000,
                  path: AUTH_COOKIE_PATH,
                },
              },
            }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix(API_GLOBAL_PREFIX);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 429 when login endpoint exceeds throttle limit', async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      await request(app.getHttpServer()).get('/api/v1/auth/login/google').expect(200);
    }

    await request(app.getHttpServer()).get('/api/v1/auth/login/google').expect(429);
  });
});
