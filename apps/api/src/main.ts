import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(cookieParser());

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // TODO: Story 1.2+ — Add global Zod validation pipe
  // app.useGlobalPipes(new ZodValidationPipe());

  // TODO: Story 1.2+ — Add RFC 7807 exception filter
  // app.useGlobalFilters(new Rfc7807ExceptionFilter());

  // Swagger/OpenAPI setup
  setupSwagger(app);

  const envService = app.get(EnvService);
  const port = envService.port;
  const publicBaseUrl = envService.publicBaseUrl;

  await app.listen(port);
  logger.log(`Application is running on: ${publicBaseUrl}/api`);
  logger.log(`Swagger docs available at: ${publicBaseUrl}/api/docs`);
}

bootstrap();
