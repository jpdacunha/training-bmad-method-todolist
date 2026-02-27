import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { DatabaseConnectivityService } from './database/database-connectivity.service';

@Module({
  imports: [HealthModule],
  providers: [DatabaseConnectivityService],
})
export class AppModule {}
