import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseConnectivityService } from './database/database-connectivity.service';
import { AuthModule } from './modules/auth/auth.module';
import { EnvModule } from './config/env.module';

@Module({
  imports: [EnvModule, DatabaseModule, HealthModule, AuthModule],
  providers: [DatabaseConnectivityService],
})
export class AppModule {}
