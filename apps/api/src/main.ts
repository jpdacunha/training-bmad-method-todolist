import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // TODO: Story 1.2+ — Add global Zod validation pipe
  // app.useGlobalPipes(new ZodValidationPipe());

  // TODO: Story 1.2+ — Add RFC 7807 exception filter
  // app.useGlobalFilters(new Rfc7807ExceptionFilter());

  // Swagger/OpenAPI setup
  setupSwagger(app);

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
