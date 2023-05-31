import {
  EntityManager,
  MikroORM,
  PostgreSqlDriver,
} from '@mikro-orm/postgresql';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/App.module';
import { AuthService } from 'src/services/Auth.service';
import { DefaultSeeder } from './seeders/Default.seeder';
import { UserAuth } from 'src/db/entities/Auth.entity';
import { getHashFromText, getServerTime } from 'src/utils';
import { UserRoleEnum } from 'src/db/entities/Base';
import { faker } from '@mikro-orm/seeder';

export const initializeMikro = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>();
  return orm;
};

export const setupDB = async () => {
  const orm = await initializeMikro();
  const migrator = orm.getMigrator();
  await migrator.up();

  const seeder = orm.getSeeder();
  await orm.getSchemaGenerator().clearDatabase();
  await seeder.seed(DefaultSeeder);

  await orm.close(true);
};

export const setupTest = async () => {
  await setupDB();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  return await app.init();
};

export const DEFAULT_PASSPHRASE = 'supersecret';
export const DEFAULT_PASSPHRASE_HASH =
  '$2y$10$0NA1coVtvhUFFlKtD4x/3eG7IICtozAlAqFb75BgcukAny5WZkKbW';

interface LoginOptions {
  email?: string;
  password?: string;
}

export const login = async (user: LoginOptions, auth: AuthService) => {
  const token = await auth.login({
    email: user.email,
    password: user?.password ?? DEFAULT_PASSPHRASE,
  });
  return token;
};

export const registerUser = async (
  em: EntityManager,
  {
    email = null,
    password = DEFAULT_PASSPHRASE,
    removed = false,
    role = UserRoleEnum.USER,
  } = {},
) => {
  const user = new UserAuth();
  user.email = email?.toLowerCase() || faker.internet.email().toLowerCase();
  user.password = await getHashFromText(password);
  user.role = role;
  user.removedAt = removed ? getServerTime().toString() : null;
  user.removed = removed ? new Date().getTime() : 0;
  em.persist(user);

  await em.flush();
  return user;
};
