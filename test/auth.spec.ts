import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  DEFAULT_PASSPHRASE,
  initializeMikro,
  registerUser,
  setupTest,
} from './helpers';
import { MikroORM } from '@mikro-orm/postgresql';
import { faker } from '@mikro-orm/seeder';
import { cast } from 'src/utils';
import { LoginOutputDto } from 'src/dto/Auth.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeEach(async () => {
    app = await setupTest();
    orm = await initializeMikro();
  });

  afterAll(async () => {
    orm.close();
  });

  it('test /auth/register api', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', null)
      .send({
        fullname: 'some name',
        email: faker.internet.email().toLowerCase(),
        password: DEFAULT_PASSPHRASE,
      });
    console.log('Response:', response.text);

    expect(parseInt(response.text)).toEqual(HttpStatus.OK);
  });

  it('test /auth/login api', async () => {
    const password = DEFAULT_PASSPHRASE;
    const newUser = await registerUser(orm.em, { password });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', null)
      .send({
        email: newUser.email,
        password,
      });
    console.log('Response:', response.body);

    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
  });

  it('test /auth/refresh api', async () => {
    const password = DEFAULT_PASSPHRASE;
    const newUser = await registerUser(orm.em, { password });

    let response = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', null)
      .send({
        email: newUser.email,
        password,
      });
    const tokens = await cast(LoginOutputDto, response.body);

    response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({
        refreshToken: tokens.refreshToken,
      });
    console.log('Response:', response.body);

    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
  });
});
