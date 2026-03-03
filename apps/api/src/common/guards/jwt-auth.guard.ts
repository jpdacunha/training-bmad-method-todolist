import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RFC_7807_TYPE_ABOUT_BLANK } from '@training-bmad-method-todolist/shared';
import { EnvService } from '../../config/env.service';
import {
  AUTH_HEADER_BEARER_PREFIX,
  AUTH_ERROR_TITLE_UNAUTHORIZED,
  AUTH_ERROR_DETAIL_MISSING_AUTH_HEADER,
  AUTH_ERROR_DETAIL_INVALID_TOKEN,
  AUTH_HTTP_STATUS_UNAUTHORIZED,
} from '../../modules/auth/auth.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string }; user?: unknown }>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith(AUTH_HEADER_BEARER_PREFIX)) {
      throw new UnauthorizedException({
        type: RFC_7807_TYPE_ABOUT_BLANK,
        title: AUTH_ERROR_TITLE_UNAUTHORIZED,
        status: AUTH_HTTP_STATUS_UNAUTHORIZED,
        detail: AUTH_ERROR_DETAIL_MISSING_AUTH_HEADER,
      });
    }

    const token = authorizationHeader.slice(AUTH_HEADER_BEARER_PREFIX.length);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.envService.jwtSecret,
      });

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException({
        type: RFC_7807_TYPE_ABOUT_BLANK,
        title: AUTH_ERROR_TITLE_UNAUTHORIZED,
        status: AUTH_HTTP_STATUS_UNAUTHORIZED,
        detail: AUTH_ERROR_DETAIL_INVALID_TOKEN,
      });
    }
  }
}
