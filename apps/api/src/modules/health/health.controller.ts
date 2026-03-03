import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HEALTH_ROUTE_PREFIX,
  HEALTH_STATUS_OK,
  HEALTH_SWAGGER_SUMMARY,
  HEALTH_SWAGGER_DESCRIPTION,
} from './health.constants';

@Controller(HEALTH_ROUTE_PREFIX)
export class HealthController {
  @Get()
  @ApiOperation({ summary: HEALTH_SWAGGER_SUMMARY })
  @ApiResponse({ status: 200, description: HEALTH_SWAGGER_DESCRIPTION })
  check() {
    return {
      status: HEALTH_STATUS_OK,
      timestamp: new Date().toISOString(),
    };
  }
}
