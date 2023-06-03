import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  DEFAULT_PASSPHRASE,
  initializeMikro,
  login,
  registerUser,
  setupTest,
} from 'test/helpers';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { AuthService } from 'src/services/Auth.service';
import { faker } from '@mikro-orm/seeder';
import { UserRoleEnum } from 'src/db/entities/Base';

describe('Files', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let em: EntityManager;
  let auth: AuthService;

  beforeEach(async () => {
    app = await setupTest();
    orm = await initializeMikro();
    em = orm.em as EntityManager;
    auth = await app.get(AuthService);
  });

  afterAll(async () => {
    await orm.close();
  });

  it('Test that upload will fail because of invalid user role', async () => {
    const user = await registerUser(em, {
      email: faker.internet.email(),
      password: DEFAULT_PASSPHRASE,
    });
    const token = await login(
      {
        email: user.email,
        password: DEFAULT_PASSPHRASE,
      },
      auth,
    );
    await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${token.accessToken}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', './test/test.txt')
      .then((res) => {
        console.log('Response:', JSON.stringify(res.body));

        // Forbidden resource
        expect(res.status).toEqual(403);
      });
  });

  it('Test upload api stores file to ./upload folder successfully', async () => {
    const user = await registerUser(em, {
      email: faker.internet.email(),
      password: DEFAULT_PASSPHRASE,

      // Note: set role allowed in upload api
      role: UserRoleEnum.MANAGEMENT,
    });
    const token = await login(
      {
        email: user.email,
        password: DEFAULT_PASSPHRASE,
      },
      auth,
    );
    await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${token.accessToken}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('files', './test/test.txt')
      .then((res) => {
        console.log('Response:', JSON.stringify(res.body));
        expect(res.status).toEqual(201);
      });
  });
});
