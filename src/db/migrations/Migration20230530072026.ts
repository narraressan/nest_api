import { Migration } from '@mikro-orm/migrations';

export class Migration20230530072026 extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.addSql(
      'create table "user_auth" ("uuid" uuid not null default uuid_generate_v4(), "email" varchar(255) not null, "removed" bigint not null default 0, "removed_at" timestamptz(0) null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "id" serial not null, "fullname" text null, "password" text not null, "access_token" text null, "refresh_token" text null, "role" text check ("role" in (\'ADMIN\', \'MANAGEMENT\', \'USER\')) not null default \'USER\', "reset_password_code" text null, constraint "user_auth_pkey" primary key ("uuid", "email"), constraint user_auth_email_check check (email = LOWER(email) AND LENGTH(TRIM(email)) > 0));',
    );
    this.addSql(
      'alter table "user_auth" add constraint "user_auth_access_token_unique" unique ("access_token");',
    );
    this.addSql(
      'alter table "user_auth" add constraint "user_auth_refresh_token_unique" unique ("refresh_token");',
    );
    this.addSql(
      'alter table "user_auth" add constraint "user_auth_email_removed_unique" unique ("email", "removed");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_auth" cascade;');
  }
}
