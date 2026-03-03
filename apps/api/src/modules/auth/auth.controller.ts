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

@Controller('v1/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/:provider')
  login(
    @Param('provider') providerInput: string,
    @Res({ passthrough: true }) response: Response,
  ): { redirectUrl: string } {
    const provider = this.parseProvider(providerInput);
    const loginResponse = this.authService.generateLoginResponse(provider);

    response.cookie(loginResponse.stateCookie.name, loginResponse.stateCookie.value, loginResponse.stateCookie.options);

    return {
      redirectUrl: loginResponse.redirectUrl,
    };
  }

  @Get('callback/:provider')
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
        type: 'about:blank',
        title: 'Invalid OAuth callback input',
        status: 400,
        detail: 'Missing OAuth callback query parameters.',
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
    response.clearCookie(callbackResponse.stateCookieToClear.name, callbackResponse.stateCookieToClear.options);

    return {
      accessToken: callbackResponse.accessToken,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const refreshResponse = await this.authService.refreshSession(request.headers.cookie);

    response.cookie(refreshResponse.refreshCookie.name, refreshResponse.refreshCookie.value, refreshResponse.refreshCookie.options);

    return {
      accessToken: refreshResponse.accessToken,
    };
  }

  @Post('sign-out')
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
        type: 'about:blank',
        title: 'Invalid OAuth provider',
        status: 400,
        detail: 'Provider must be google or github.',
      });
    }

    return result.data;
  }
}
