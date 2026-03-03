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
          sameSite: 'lax',
          maxAge: 10 * 60 * 1000,
          path: '/api/v1/auth',
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
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'OAuth state cookie is missing.'));
    }

    const decodedState = JSON.parse(Buffer.from(stateCookieRaw, 'base64url').toString('utf8')) as {
      state: string;
      codeVerifier: string;
    };

    if (decodedState.state !== input.state) {
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'Invalid OAuth state value.'));
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
        name: 'refreshToken',
        value: refreshTokenValue,
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/api/v1/auth',
        },
      },
      stateCookieToClear: {
        name: this.getOAuthStateCookieName(input.provider),
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: 'lax',
          path: '/api/v1/auth',
        },
      },
    };
  }

  async refreshSession(cookieHeader?: string): Promise<RefreshResponse> {
    const currentRefreshToken = this.readCookie(cookieHeader, 'refreshToken');
    if (!currentRefreshToken) {
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'Refresh token is missing.'));
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
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'Invalid or expired refresh token.'));
    }

    const foundUsers = await this.db
      .select()
      .from(users)
      .where(eq(users.id, refreshTokenRecord.userId))
      .limit(1);
    const user: User | undefined = foundUsers[0];
    if (!user) {
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'User not found for refresh token.'));
    }

    await this.db.delete(refreshTokens).where(eq(refreshTokens.id, refreshTokenRecord.id));

    const nextRefreshToken = this.generateUrlSafeToken(48);
    await this.persistRefreshToken(user.id, nextRefreshToken);

    return {
      accessToken: this.issueAccessToken(user),
      refreshCookie: {
        name: 'refreshToken',
        value: nextRefreshToken,
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/api/v1/auth',
        },
      },
    };
  }

  async signOut(cookieHeader?: string): Promise<{ clearCookie: { name: string; options: CookieOptions } }> {
    const currentRefreshToken = this.readCookie(cookieHeader, 'refreshToken');
    if (currentRefreshToken) {
      await this.db.delete(refreshTokens).where(eq(refreshTokens.token, this.hashToken(currentRefreshToken)));
    }

    return {
      clearCookie: {
        name: 'refreshToken',
        options: {
          httpOnly: true,
          secure: this.isProduction(),
          sameSite: 'lax',
          path: '/api/v1/auth',
        },
      },
    };
  }

  private async getProviderClient(provider: OAuthProvider): Promise<unknown> {
    const arcticModule = await import('arctic');

    if (provider === 'google') {
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
      provider === 'google'
        ? this.envService.googleRedirectUri
        : this.envService.githubRedirectUri;
    const clientId = provider === 'google' ? this.envService.googleClientId : this.envService.githubClientId;

    if (provider === 'google') {
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', 'openid profile email');
      url.searchParams.set('state', state);
      url.searchParams.set('code_challenge_method', 'S256');
      url.searchParams.set('code_challenge', this.generateS256Challenge(codeVerifier));
      return url.toString();
    }

    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', 'read:user user:email');
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', this.generateS256Challenge(codeVerifier));
    return url.toString();
  }

  private async validateAuthorizationCode(provider: OAuthProvider, providerClient: unknown, code: string, codeVerifier: string): Promise<unknown> {
    try {
      if (provider === 'google') {
        return await (providerClient as GoogleProviderClient).validateAuthorizationCode(code, codeVerifier);
      }

      return await (providerClient as GithubProviderClient).validateAuthorizationCode(code, codeVerifier);
    } catch (error) {
      this.logger.warn('OAuth code validation failed', error as Error);
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'OAuth authorization code exchange failed.'));
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
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'OAuth provider did not return an access token.'));
    }

    return accessTokenValue;
  }

  private async fetchProviderProfile(provider: OAuthProvider, accessToken: string): Promise<ProviderProfile> {
    const endpoint =
      provider === 'google'
        ? 'https://openidconnect.googleapis.com/v1/userinfo'
        : 'https://api.github.com/user';

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...(provider === 'github' ? { 'User-Agent': 'training-bmad-method-todolist' } : {}),
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'Unable to retrieve OAuth user profile.'));
    }

    const payload = (await response.json()) as Record<string, unknown>;

    if (provider === 'google') {
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
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'User-Agent': 'training-bmad-method-todolist',
      },
    });

    if (!response.ok) {
      this.logger.warn('Failed to fetch GitHub user emails — falling back to empty email.');
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
        throw new UnauthorizedException(this.problemDetails('Unauthorized', 'Failed to update user record.'));
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
      throw new UnauthorizedException(this.problemDetails('Unauthorized', 'Failed to create user record.'));
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
      expiresIn: '15m',
    });
  }

  private async persistRefreshToken(userId: string, refreshTokenValue: string): Promise<void> {
    await this.db.insert(refreshTokens).values({
      userId,
      token: this.hashToken(refreshTokenValue),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    return `oauth_state_${provider}`;
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
      type: 'about:blank',
      title,
      status: 401,
      detail,
    };
  }
}
