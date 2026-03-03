import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EnvService } from '../../config/env.service';

describe('JwtAuthGuard', () => {
  const createExecutionContext = (authorization?: string): ExecutionContext => {
    const request = {
      headers: {
        authorization,
      },
      user: undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  };

  it('attaches payload to request for valid token', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ sub: 'user-id', email: 'jane@example.com' }),
    } as unknown as JwtService;
    const envService = { jwtSecret: 'test-secret' } as EnvService;
    const guard = new JwtAuthGuard(jwtService, envService);
    const context = createExecutionContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('throws unauthorized when Authorization header is missing', async () => {
    const jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;
    const envService = { jwtSecret: 'test-secret' } as EnvService;
    const guard = new JwtAuthGuard(jwtService, envService);
    const context = createExecutionContext();

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws unauthorized when token is invalid', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockRejectedValue(new Error('invalid token')),
    } as unknown as JwtService;
    const envService = { jwtSecret: 'test-secret' } as EnvService;
    const guard = new JwtAuthGuard(jwtService, envService);
    const context = createExecutionContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
