import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '../../config/env.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: unknown }>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        type: 'about:blank',
        title: 'Unauthorized',
        status: 401,
        detail: 'Missing or invalid Authorization header.',
      });
    }

    const token = authorizationHeader.slice('Bearer '.length);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.envService.jwtSecret,
      });

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException({
        type: 'about:blank',
        title: 'Unauthorized',
        status: 401,
        detail: 'Invalid or expired access token.',
      });
    }
  }
}
