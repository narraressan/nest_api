import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private http: HttpHealthIndicator,
    private mikroOrm: MikroOrmHealthIndicator,
  ) {
    super();
  }

  async swaggerUI(): Promise<HealthIndicatorResult> {
    return await this.http.pingCheck(
      'swagger_ui',
      `${process.env.APP_HOST_INTERNAL}:${process.env.APP_PORT}/api`,
    );
  }

  async swaggerJSON(): Promise<HealthIndicatorResult> {
    return await this.http.pingCheck(
      'swagger_json',
      `${process.env.APP_HOST_INTERNAL}:${process.env.APP_PORT}/api-json`,
    );
  }

  async stats(): Promise<HealthIndicatorResult> {
    return await this.http.pingCheck(
      'stats',
      `${process.env.APP_HOST_INTERNAL}:${process.env.APP_PORT}/swagger-stats`,
    );
  }

  async db(): Promise<HealthIndicatorResult> {
    return await this.mikroOrm.pingCheck('database');
  }
}
