import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { oauthProviderSchema } from '@training-bmad-method-todolist/shared';
import { AuthService, OAuthProvider } from './auth.service';
import {
  AUTH_ROUTE_PREFIX,
  AUTH_LOGIN_PATH,
  AUTH_CALLBACK_PATH,
  AUTH_REFRESH_PATH,
  AUTH_SIGN_OUT_PATH,
  AUTH_ERROR_TITLE_INVALID_CALLBACK,
  AUTH_ERROR_DETAIL_MISSING_CALLBACK_PARAMS,
  AUTH_ERROR_TITLE_INVALID_PROVIDER,
  AUTH_ERROR_DETAIL_INVALID_PROVIDER,
  AUTH_HTTP_STATUS_BAD_REQUEST,
  RFC_7807_TYPE_ABOUT_BLANK,
} from './auth.constants';

@Controller(AUTH_ROUTE_PREFIX)
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(AUTH_LOGIN_PATH)
  login(
    @Param('provider') providerInput: string,
    @Res({ passthrough: true }) response: Response,
  ): { redirectUrl: string } {
    const provider = this.parseProvider(providerInput);
    const loginResponse = this.authService.generateLoginResponse(provider);

    response.cookie(
      loginResponse.stateCookie.name,
      loginResponse.stateCookie.value,
      loginResponse.stateCookie.options,
    );

    return {
      redirectUrl: loginResponse.redirectUrl,
    };
  }

  @Get(AUTH_CALLBACK_PATH)
  async callback(
    @Param('provider') providerInput: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const provider = this.parseProvider(providerInput);

    if (!code || !state) {
      throw new BadRequestException({
        type: RFC_7807_TYPE_ABOUT_BLANK,
        title: AUTH_ERROR_TITLE_INVALID_CALLBACK,
        status: AUTH_HTTP_STATUS_BAD_REQUEST,
        detail: AUTH_ERROR_DETAIL_MISSING_CALLBACK_PARAMS,
      });
    }

    const callbackResponse = await this.authService.handleCallback({
      provider,
      code,
      state,
      cookieHeader: request.headers.cookie,
    });

    response.cookie(
      callbackResponse.refreshCookie.name,
      callbackResponse.refreshCookie.value,
      callbackResponse.refreshCookie.options,
    );
    response.clearCookie(
      callbackResponse.stateCookieToClear.name,
      callbackResponse.stateCookieToClear.options,
    );

    return {
      accessToken: callbackResponse.accessToken,
    };
  }

  @Post(AUTH_REFRESH_PATH)
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const refreshResponse = await this.authService.refreshSession(request.headers.cookie);

    response.cookie(
      refreshResponse.refreshCookie.name,
      refreshResponse.refreshCookie.value,
      refreshResponse.refreshCookie.options,
    );

    return {
      accessToken: refreshResponse.accessToken,
    };
  }

  @Post(AUTH_SIGN_OUT_PATH)
  @HttpCode(200)
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: true }> {
    const signOutResponse = await this.authService.signOut(request.headers.cookie);
    response.clearCookie(signOutResponse.clearCookie.name, signOutResponse.clearCookie.options);

    return {
      success: true,
    };
  }

  private parseProvider(providerInput: string): OAuthProvider {
    const result = oauthProviderSchema.safeParse(providerInput);
    if (!result.success) {
      throw new BadRequestException({
        type: RFC_7807_TYPE_ABOUT_BLANK,
        title: AUTH_ERROR_TITLE_INVALID_PROVIDER,
        status: AUTH_HTTP_STATUS_BAD_REQUEST,
        detail: AUTH_ERROR_DETAIL_INVALID_PROVIDER,
      });
    }

    return result.data;
  }
}
