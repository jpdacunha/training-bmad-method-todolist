import { JwtService } from '@nestjs/jwt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AuthService } from './auth.service';
import { EnvService } from '../../config/env.service';
import { type DatabaseSchema } from '../../database/database.provider';
import {
  OAUTH_STATE_COOKIE_PREFIX,
  REFRESH_TOKEN_COOKIE_NAME,
  AUTH_ERROR_TITLE_UNAUTHORIZED,
  RFC_7807_TYPE_ABOUT_BLANK,
  AUTH_HTTP_STATUS_UNAUTHORIZED,
  OAUTH_PROVIDER_GOOGLE,
} from './auth.constants';

type MockDb = NodePgDatabase<DatabaseSchema>;

jest.mock('arctic', () => ({
  Google: jest.fn().mockImplementation(() => ({
    validateAuthorizationCode: jest.fn().mockResolvedValue({
      accessToken: () => 'provider-access-token',
    }),
  })),
  GitHub: jest.fn().mockImplementation(() => ({
    validateAuthorizationCode: jest.fn().mockResolvedValue({
      accessToken: () => 'provider-access-token',
    }),
  })),
}));

describe('AuthService', () => {
  const envService = {
    jwtSecret: 'test-jwt-secret',
    googleClientId: 'google-client-id',
    googleClientSecret: 'google-client-secret',
    googleRedirectUri: 'http://localhost:3000/api/v1/auth/callback/google',
    githubClientId: 'github-client-id',
    githubClientSecret: 'github-client-secret',
    githubRedirectUri: 'http://localhost:3000/api/v1/auth/callback/github',
    isProduction: () => false,
  } as EnvService;

  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-access-token'),
  } as unknown as JwtService;

  it('returns OAuth login redirect and state cookie payload', () => {
    const service = new AuthService({} as unknown as MockDb, jwtService, envService);

    const result = service.generateLoginResponse('google');

    expect(result.redirectUrl).toContain('accounts.google.com');
    expect(result.stateCookie.name).toBe(`${OAUTH_STATE_COOKIE_PREFIX}google`);
    expect(result.stateCookie.options.httpOnly).toBe(true);
  });

  it('refresh rotates token, invalidates old token, and returns access token', async () => {
    const refreshRecord = {
      id: 'refresh-id-1',
      userId: 'user-id-1',
      token: 'hash',
      expiresAt: new Date(Date.now() + 60_000),
    };
    const userRecord = {
      id: 'user-id-1',
      email: 'jane@example.com',
      name: 'Jane',
      avatarUrl: null,
      oauthProvider: 'google',
      oauthProviderId: 'google-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const selectBuilder = {
      from: jest
        .fn()
        .mockReturnValueOnce({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([refreshRecord]),
          }),
        })
        .mockReturnValueOnce({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([userRecord]),
          }),
        }),
    };

    const databaseClient = {
      select: jest.fn().mockReturnValue(selectBuilder),
      delete: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue(undefined) }),
      insert: jest.fn().mockReturnValue({ values: jest.fn().mockResolvedValue(undefined) }),
    };

    const service = new AuthService(databaseClient as unknown as MockDb, jwtService, envService);
    const result = await service.refreshSession('refreshToken=old-token-value');

    expect(databaseClient.delete).toHaveBeenCalled();
    expect(databaseClient.insert).toHaveBeenCalled();
    expect(result.accessToken).toBe('signed-access-token');
    expect(result.refreshCookie.name).toBe(REFRESH_TOKEN_COOKIE_NAME);
  });

  it('refresh throws RFC 7807 unauthorized payload for invalid token', async () => {
    const databaseClient = {
      select: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    };

    const service = new AuthService(databaseClient as unknown as MockDb, jwtService, envService);

    await expect(
      service.refreshSession(`${REFRESH_TOKEN_COOKIE_NAME}=invalid`),
    ).rejects.toMatchObject({
      response: {
        type: RFC_7807_TYPE_ABOUT_BLANK,
        title: AUTH_ERROR_TITLE_UNAUTHORIZED,
        status: AUTH_HTTP_STATUS_UNAUTHORIZED,
      },
    });
  });

  it('callback exchanges code, upserts user, and issues tokens', async () => {
    const userRecord = {
      id: 'user-id-1',
      email: 'jane@example.com',
      name: 'Jane Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      oauthProvider: 'google',
      oauthProviderId: 'google-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const databaseClient = {
      select: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
      insert: jest
        .fn()
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([userRecord]),
          }),
        })
        .mockReturnValueOnce({
          values: jest.fn().mockResolvedValue(undefined),
        }),
    };

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        sub: 'google-123',
        email: 'jane@example.com',
        name: 'Jane Doe',
        picture: 'https://example.com/avatar.jpg',
      }),
    }) as unknown as typeof fetch;

    try {
      const service = new AuthService(databaseClient as unknown as MockDb, jwtService, envService);
      const stateData = { state: 'test-state', codeVerifier: 'test-code-verifier' };
      const stateCookieValue = Buffer.from(JSON.stringify(stateData), 'utf8').toString('base64url');

      const result = await service.handleCallback({
        provider: OAUTH_PROVIDER_GOOGLE,
        code: 'auth-code',
        state: 'test-state',
        cookieHeader: `${OAUTH_STATE_COOKIE_PREFIX}google=${stateCookieValue}`,
      });

      expect(result.accessToken).toBe('signed-access-token');
      expect(result.refreshCookie.name).toBe(REFRESH_TOKEN_COOKIE_NAME);
      expect(result.refreshCookie.options.httpOnly).toBe(true);
      expect(databaseClient.insert).toHaveBeenCalledTimes(2);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('callback throws unauthorized when state cookie is missing', async () => {
    const databaseClient = {
      select: jest.fn(),
      insert: jest.fn(),
    };

    const service = new AuthService(databaseClient as unknown as MockDb, jwtService, envService);

    await expect(
      service.handleCallback({
        provider: OAUTH_PROVIDER_GOOGLE,
        code: 'auth-code',
        state: 'test-state',
        cookieHeader: undefined,
      }),
    ).rejects.toMatchObject({
      response: {
        type: RFC_7807_TYPE_ABOUT_BLANK,
        title: AUTH_ERROR_TITLE_UNAUTHORIZED,
        status: AUTH_HTTP_STATUS_UNAUTHORIZED,
      },
    });
  });

  it('signOut deletes refresh token from DB and returns clear cookie', async () => {
    const databaseClient = {
      delete: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      }),
    };

    const service = new AuthService(databaseClient as unknown as MockDb, jwtService, envService);
    const result = await service.signOut(`${REFRESH_TOKEN_COOKIE_NAME}=some-token-value`);

    expect(databaseClient.delete).toHaveBeenCalled();
    expect(result.clearCookie.name).toBe(REFRESH_TOKEN_COOKIE_NAME);
    expect(result.clearCookie.options.httpOnly).toBe(true);
  });

  it('signOut returns clear cookie even without refresh token cookie', async () => {
    const databaseClient = {
      delete: jest.fn(),
    };

    const service = new AuthService(databaseClient as unknown as MockDb, jwtService, envService);
    const result = await service.signOut(undefined);

    expect(databaseClient.delete).not.toHaveBeenCalled();
    expect(result.clearCookie.name).toBe(REFRESH_TOKEN_COOKIE_NAME);
  });
});
