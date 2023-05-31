import { Factory, Faker } from '@mikro-orm/seeder';
import { UserAuth } from 'src/db/entities/Auth.entity';
import { UserRoleEnum } from 'src/db/entities/Base';
import { DEFAULT_PASSPHRASE_HASH } from 'test/helpers';

export class UserFactory extends Factory<UserAuth> {
  model = UserAuth;

  definition(faker: Faker): Partial<UserAuth> {
    return {
      email: faker.internet.email().toLowerCase(),
      role: UserRoleEnum.USER,
      fullname: faker.name.fullName(),
      password: DEFAULT_PASSPHRASE_HASH,
    };
  }
}
