import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { and, eq, gt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { createHash, randomBytes } from 'node:crypto';
import {
  refreshTokens,
  users,
  type User,
  type RefreshToken,
} from '@training-bmad-method-todolist/shared';
import { DATABASE_CLIENT } from '../../database/database.constants';
import { type DatabaseSchema } from '../../database/database.provider';
import { EnvService } from '../../config/env.service';
import {
  OAUTH_PROVIDER_GOOGLE,
  OAUTH_PROVIDER_GITHUB,
  RFC_7807_TYPE_ABOUT_BLANK,
  REFRESH_TOKEN_COOKIE_NAME,
  OAUTH_STATE_COOKIE_PREFIX,
  AUTH_COOKIE_PATH,
  COOKIE_SAME_SITE_LAX,
  OAUTH_STATE_COOKIE_MAX_AGE_MS,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_MAX_AGE_MS,
  GOOGLE_AUTHORIZATION_URL,
  GITHUB_AUTHORIZATION_URL,
  GOOGLE_USERINFO_URL,
  GITHUB_USER_URL,
  GITHUB_USER_EMAILS_URL,
  GOOGLE_OAUTH_SCOPES,
  GITHUB_OAUTH_SCOPES,
  PKCE_CHALLENGE_METHOD_S256,
  OAUTH_PARAM_CLIENT_ID,
  OAUTH_PARAM_REDIRECT_URI,
  OAUTH_PARAM_RESPONSE_TYPE,
  OAUTH_PARAM_SCOPE,
  OAUTH_PARAM_STATE,
  OAUTH_PARAM_CODE_CHALLENGE_METHOD,
  OAUTH_PARAM_CODE_CHALLENGE,
  OAUTH_RESPONSE_TYPE_CODE,
  AUTH_HEADER_BEARER_PREFIX,
  CONTENT_TYPE_APPLICATION_JSON,
  USER_AGENT_APP_NAME,
  AUTH_ERROR_TITLE_UNAUTHORIZED,
  AUTH_ERROR_DETAIL_STATE_MISSING,
  AUTH_ERROR_DETAIL_STATE_INVALID,
  AUTH_ERROR_DETAIL_CODE_EXCHANGE_FAILED,
  AUTH_ERROR_DETAIL_NO_ACCESS_TOKEN,
  AUTH_ERROR_DETAIL_PROFILE_FETCH_FAILED,
  AUTH_ERROR_DETAIL_USER_UPDATE_FAILED,
  AUTH_ERROR_DETAIL_USER_CREATE_FAILED,
  AUTH_ERROR_DETAIL_REFRESH_MISSING,
  AUTH_ERROR_DETAIL_REFRESH_INVALID,
  AUTH_ERROR_DETAIL_USER_NOT_FOUND,
  AUTH_HTTP_STATUS_UNAUTHORIZED,
  GITHUB_EMAIL_FALLBACK_LOG,
  OAUTH_CODE_VALIDATION_FAILED_LOG,
} from './auth.constants';

export type OAuthProvider = 'google' | 'github';

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge?: number;
  path: string;
};

type LoginResponse = {
  redirectUrl: string;
  stateCookie: {
    name: string;
    value: string;
    options: CookieOptions;
  };
};

type CallbackResponse = {
  accessToken: string;
  refreshCookie: {
    name: string;
    value: string;
    options: CookieOptions;
  };
  stateCookieToClear: {
    name: string;
    options: CookieOptions;
  };
};

type RefreshResponse = {
  accessToken: string;
  refreshCookie: {
    name: string;
    value: string;
    options: CookieOptions;
  };
};

type ProviderProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

type AccessTokenPayload = {
  sub: string;
  email: string;
  provider: OAuthProvider;
};

type GoogleProviderClient = {
  validateAuthorizationCode: (code: string, codeVerifier: string) => Promise<unknown>;
};

type GithubProviderClient = {
  validateAuthorizationCode: (code: string, codeVerifier: string) => Promise<unknown>;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DATABASE_CLIENT) private readonly db: NodePgDatabase<DatabaseSchema>,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  generateLoginResponse(provider: OAuthProvider): LoginResponse {
    const state = this.generateUrlSafeToken(24);
    const codeVerifier = this.generateUrlSafeToken(32);
    const redirectUrl = this.buildAuthorizationUrl(provider, state, codeVerifier);

    return {
      redirectUrl,
      stateCookie: {
        name: this.getOAuthStateCookieName(provider),
        value: Buffer.from(JSON.stringify({ state, codeVerifier }), 'utf8').toString('base64url'),
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: COOKIE_SAME_SITE_LAX,
          maxAge: OAUTH_STATE_COOKIE_MAX_AGE_MS,
          path: AUTH_COOKIE_PATH,
        },
      },
    };
  }

  async handleCallback(input: {
    provider: OAuthProvider;
    code: string;
    state: string;
    cookieHeader?: string;
  }): Promise<CallbackResponse> {
    const stateCookieRaw = this.readCookie(input.cookieHeader, this.getOAuthStateCookieName(input.provider));
    if (!stateCookieRaw) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_STATE_MISSING));
    }

    const decodedState = JSON.parse(Buffer.from(stateCookieRaw, 'base64url').toString('utf8')) as {
      state: string;
      codeVerifier: string;
    };

    if (decodedState.state !== input.state) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_STATE_INVALID));
    }

    const providerClient = await this.getProviderClient(input.provider);
    const tokenResult = await this.validateAuthorizationCode(input.provider, providerClient, input.code, decodedState.codeVerifier);
    const accessTokenFromProvider = this.extractAccessToken(tokenResult);
    const providerProfile = await this.fetchProviderProfile(input.provider, accessTokenFromProvider);
    const user = await this.upsertUser(input.provider, providerProfile);
    const accessToken = this.issueAccessToken(user);
    const refreshTokenValue = this.generateUrlSafeToken(48);

    await this.persistRefreshToken(user.id, refreshTokenValue);

    return {
      accessToken,
      refreshCookie: {
        name: REFRESH_TOKEN_COOKIE_NAME,
        value: refreshTokenValue,
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: COOKIE_SAME_SITE_LAX,
          maxAge: REFRESH_TOKEN_MAX_AGE_MS,
          path: AUTH_COOKIE_PATH,
        },
      },
      stateCookieToClear: {
        name: this.getOAuthStateCookieName(input.provider),
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: COOKIE_SAME_SITE_LAX,
          path: AUTH_COOKIE_PATH,
        },
      },
    };
  }

  async refreshSession(cookieHeader?: string): Promise<RefreshResponse> {
    const currentRefreshToken = this.readCookie(cookieHeader, REFRESH_TOKEN_COOKIE_NAME);
    if (!currentRefreshToken) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_REFRESH_MISSING));
    }

    const hashedToken = this.hashToken(currentRefreshToken);
    const currentDate = new Date();
    const foundRefreshTokens = await this.db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, hashedToken), gt(refreshTokens.expiresAt, currentDate)))
      .limit(1);
    const refreshTokenRecord: RefreshToken | undefined = foundRefreshTokens[0];

    if (!refreshTokenRecord) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_REFRESH_INVALID));
    }

    const foundUsers = await this.db
      .select()
      .from(users)
      .where(eq(users.id, refreshTokenRecord.userId))
      .limit(1);
    const user: User | undefined = foundUsers[0];
    if (!user) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_USER_NOT_FOUND));
    }

    await this.db.delete(refreshTokens).where(eq(refreshTokens.id, refreshTokenRecord.id));

    const nextRefreshToken = this.generateUrlSafeToken(48);
    await this.persistRefreshToken(user.id, nextRefreshToken);

    return {
      accessToken: this.issueAccessToken(user),
      refreshCookie: {
        name: REFRESH_TOKEN_COOKIE_NAME,
        value: nextRefreshToken,
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: COOKIE_SAME_SITE_LAX,
          maxAge: REFRESH_TOKEN_MAX_AGE_MS,
          path: AUTH_COOKIE_PATH,
        },
      },
    };
  }

  async signOut(cookieHeader?: string): Promise<{ clearCookie: { name: string; options: CookieOptions } }> {
    const currentRefreshToken = this.readCookie(cookieHeader, REFRESH_TOKEN_COOKIE_NAME);
    if (currentRefreshToken) {
      await this.db.delete(refreshTokens).where(eq(refreshTokens.token, this.hashToken(currentRefreshToken)));
    }

    return {
      clearCookie: {
        name: REFRESH_TOKEN_COOKIE_NAME,
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: COOKIE_SAME_SITE_LAX,
          path: AUTH_COOKIE_PATH,
        },
      },
    };
  }

  private async getProviderClient(provider: OAuthProvider): Promise<unknown> {
    const arcticModule = await import('arctic');

    if (provider === OAUTH_PROVIDER_GOOGLE) {
      return new arcticModule.Google(
        this.envService.googleClientId,
        this.envService.googleClientSecret,
        this.envService.googleRedirectUri,
      );
    }

    return new arcticModule.GitHub(
      this.envService.githubClientId,
      this.envService.githubClientSecret,
      this.envService.githubRedirectUri,
    );
  }

  private buildAuthorizationUrl(provider: OAuthProvider, state: string, codeVerifier: string): string {
    const redirectUri =
      provider === OAUTH_PROVIDER_GOOGLE
        ? this.envService.googleRedirectUri
        : this.envService.githubRedirectUri;
    const clientId = provider === OAUTH_PROVIDER_GOOGLE ? this.envService.googleClientId : this.envService.githubClientId;

    if (provider === OAUTH_PROVIDER_GOOGLE) {
      const url = new URL(GOOGLE_AUTHORIZATION_URL);
      url.searchParams.set(OAUTH_PARAM_CLIENT_ID, clientId);
      url.searchParams.set(OAUTH_PARAM_REDIRECT_URI, redirectUri);
      url.searchParams.set(OAUTH_PARAM_RESPONSE_TYPE, OAUTH_RESPONSE_TYPE_CODE);
      url.searchParams.set(OAUTH_PARAM_SCOPE, GOOGLE_OAUTH_SCOPES);
      url.searchParams.set(OAUTH_PARAM_STATE, state);
      url.searchParams.set(OAUTH_PARAM_CODE_CHALLENGE_METHOD, PKCE_CHALLENGE_METHOD_S256);
      url.searchParams.set(OAUTH_PARAM_CODE_CHALLENGE, this.generateS256Challenge(codeVerifier));
      return url.toString();
    }

    const url = new URL(GITHUB_AUTHORIZATION_URL);
    url.searchParams.set(OAUTH_PARAM_CLIENT_ID, clientId);
    url.searchParams.set(OAUTH_PARAM_REDIRECT_URI, redirectUri);
    url.searchParams.set(OAUTH_PARAM_SCOPE, GITHUB_OAUTH_SCOPES);
    url.searchParams.set(OAUTH_PARAM_STATE, state);
    url.searchParams.set(OAUTH_PARAM_CODE_CHALLENGE_METHOD, PKCE_CHALLENGE_METHOD_S256);
    url.searchParams.set(OAUTH_PARAM_CODE_CHALLENGE, this.generateS256Challenge(codeVerifier));
    return url.toString();
  }

  private async validateAuthorizationCode(provider: OAuthProvider, providerClient: unknown, code: string, codeVerifier: string): Promise<unknown> {
    try {
      if (provider === OAUTH_PROVIDER_GOOGLE) {
        return await (providerClient as GoogleProviderClient).validateAuthorizationCode(code, codeVerifier);
      }

      return await (providerClient as GithubProviderClient).validateAuthorizationCode(code, codeVerifier);
    } catch (error) {
      this.logger.warn(OAUTH_CODE_VALIDATION_FAILED_LOG, error as Error);
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_CODE_EXCHANGE_FAILED));
    }
  }

  private extractAccessToken(tokenResult: unknown): string {
    const tokenCandidate = tokenResult as {
      accessToken?: () => string;
      access_token?: string;
      accessTokenValue?: string;
    };

    const accessTokenValue = tokenCandidate.accessToken?.() ?? tokenCandidate.access_token ?? tokenCandidate.accessTokenValue;

    if (!accessTokenValue) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_NO_ACCESS_TOKEN));
    }

    return accessTokenValue;
  }

  private async fetchProviderProfile(provider: OAuthProvider, accessToken: string): Promise<ProviderProfile> {
    const endpoint =
      provider === OAUTH_PROVIDER_GOOGLE
        ? GOOGLE_USERINFO_URL
        : GITHUB_USER_URL;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `${AUTH_HEADER_BEARER_PREFIX}${accessToken}`,
        Accept: CONTENT_TYPE_APPLICATION_JSON,
        ...(provider === OAUTH_PROVIDER_GITHUB ? { 'User-Agent': USER_AGENT_APP_NAME } : {}),
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_PROFILE_FETCH_FAILED));
    }

    const payload = (await response.json()) as Record<string, unknown>;

    if (provider === OAUTH_PROVIDER_GOOGLE) {
      const providerId = String(payload['sub'] ?? '');
      const email = String(payload['email'] ?? '');
      const name = String(payload['name'] ?? email);
      const avatarUrl = payload['picture'] ? String(payload['picture']) : null;

      return {
        id: providerId,
        email,
        name,
        avatarUrl,
      };
    }

    const providerId = String(payload['id'] ?? '');
    const name = String(payload['name'] ?? payload['login'] ?? providerId);
    const avatarUrl = payload['avatar_url'] ? String(payload['avatar_url']) : null;

    // GitHub may not return email in the main profile response when email is private.
    // In that case, we need to call /user/emails to get the verified primary email.
    let email = payload['email'] ? String(payload['email']) : '';
    if (!email) {
      email = await this.fetchGithubPrimaryEmail(accessToken);
    }

    return {
      id: providerId,
      email,
      name: name || email,
      avatarUrl,
    };
  }

  private async fetchGithubPrimaryEmail(accessToken: string): Promise<string> {
    const response = await fetch(GITHUB_USER_EMAILS_URL, {
      headers: {
        Authorization: `${AUTH_HEADER_BEARER_PREFIX}${accessToken}`,
        Accept: CONTENT_TYPE_APPLICATION_JSON,
        'User-Agent': USER_AGENT_APP_NAME,
      },
    });

    if (!response.ok) {
      this.logger.warn(GITHUB_EMAIL_FALLBACK_LOG);
      return '';
    }

    const emails = (await response.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
    const primaryVerified = emails.find((e) => e.primary && e.verified);
    const anyVerified = emails.find((e) => e.verified);

    return primaryVerified?.email ?? anyVerified?.email ?? '';
  }

  private async upsertUser(provider: OAuthProvider, profile: ProviderProfile): Promise<User> {
    const currentDate = new Date();

    const existingUsers = await this.db
      .select()
      .from(users)
      .where(and(eq(users.oauthProvider, provider), eq(users.oauthProviderId, profile.id)))
      .limit(1);
    const existingUser = existingUsers[0];

    if (existingUser) {
      const [updatedUser] = await this.db
        .update(users)
        .set({
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          updatedAt: currentDate,
        })
        .where(eq(users.id, existingUser.id))
        .returning();

      if (!updatedUser) {
        throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_USER_UPDATE_FAILED));
      }

      return updatedUser;
    }

    const [insertedUser] = await this.db
      .insert(users)
      .values({
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        oauthProvider: provider,
        oauthProviderId: profile.id,
      })
      .returning();

    if (!insertedUser) {
      throw new UnauthorizedException(this.problemDetails(AUTH_ERROR_TITLE_UNAUTHORIZED, AUTH_ERROR_DETAIL_USER_CREATE_FAILED));
    }

    return insertedUser;
  }

  private issueAccessToken(user: User): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      provider: user.oauthProvider as OAuthProvider,
    };

    return this.jwtService.sign(payload, {
      secret: this.envService.jwtSecret,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  private async persistRefreshToken(userId: string, refreshTokenValue: string): Promise<void> {
    await this.db.insert(refreshTokens).values({
      userId,
      token: this.hashToken(refreshTokenValue),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS),
    });
  }

  private generateUrlSafeToken(bytes: number): string {
    return randomBytes(bytes).toString('base64url');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateS256Challenge(codeVerifier: string): string {
    return createHash('sha256').update(codeVerifier).digest('base64url');
  }

  private getOAuthStateCookieName(provider: OAuthProvider): string {
    return `${OAUTH_STATE_COOKIE_PREFIX}${provider}`;
  }

  private readCookie(cookieHeader: string | undefined, cookieName: string): string | null {
    if (!cookieHeader) {
      return null;
    }

    const cookiePairs = cookieHeader.split(';');
    for (const cookiePair of cookiePairs) {
      const [name, ...valueParts] = cookiePair.trim().split('=');
      if (name === cookieName) {
        return decodeURIComponent(valueParts.join('='));
      }
    }

    return null;
  }

  private isProduction(): boolean {
    return this.envService.isProduction();
  }

  private problemDetails(title: string, detail: string): { type: string; title: string; status: number; detail: string } {
    return {
      type: RFC_7807_TYPE_ABOUT_BLANK,
      title,
      status: AUTH_HTTP_STATUS_UNAUTHORIZED,
      detail,
    };
  }
}
