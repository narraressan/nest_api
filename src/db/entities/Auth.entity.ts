import {
  Check,
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { nullable } from 'src/utils';
import { Email } from 'src/utils/types';
import { UserRoleEnum, UUIDAndTimestamp } from './Base';

@Entity()
@Unique({ properties: ['email', 'removed'] })
export class UserAuth extends UUIDAndTimestamp {
  @PrimaryKey()
  @Check({ expression: 'email = LOWER(email) AND LENGTH(TRIM(email)) > 0' })
  email: Email;

  @Property({ type: 'text', nullable })
  fullname?: string;

  @Property({ type: 'text' })
  password: string;

  @Property({ type: 'text', nullable, unique: true })
  accessToken?: string;

  @Property({ type: 'text', nullable, unique: true })
  refreshToken?: string;

  @Enum({ items: () => UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Property({ type: 'text', nullable })
  resetPasswordCode?: string;
}
