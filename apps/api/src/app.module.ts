import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseConnectivityService } from './database/database-connectivity.service';

@Module({
  imports: [DatabaseModule, HealthModule],
  providers: [DatabaseConnectivityService],
})
export class AppModule {}
