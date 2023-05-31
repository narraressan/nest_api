import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthService } from 'src/services/Health.service';
import { setupTest } from 'test/helpers';

const healthService = {
  swaggerUI: async (): Promise<HealthIndicatorResult> => {
    return {
      ['swagger_ui']: { status: 'up', code: 200 },
    };
  },
  swaggerJSON: async (): Promise<HealthIndicatorResult> => {
    return {
      ['swagger_json']: {
        status: 'up',
        code: 200,
      },
    };
  },
  stats: async (): Promise<HealthIndicatorResult> => {
    return {
      ['stats']: {
        status: 'up',
        code: 200,
      },
    };
  },
};

describe('Health', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTest();
  });

  it('Test healthCheck() to summarize status of all running dependencies', async () => {
    const _health = app.get(HealthService);
    jest
      .spyOn(_health, 'swaggerUI')
      .mockImplementation(healthService.swaggerUI);
    jest
      .spyOn(_health, 'swaggerJSON')
      .mockImplementation(healthService.swaggerJSON);
    jest.spyOn(_health, 'stats').mockImplementation(healthService.stats);

    await request(app.getHttpServer())
      .get(`/health`)
      .send()
      .then((res) => {
        console.log('Response:', JSON.stringify(res.body));
        expect(res.status).toEqual(200);
      });
  });
});
