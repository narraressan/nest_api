import { Migration } from '@mikro-orm/migrations';

export class Migration20230604142857 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_auth" drop constraint if exists "user_auth_role_check";',
    );

    this.addSql(
      'alter table "user_auth" alter column "role" type text using ("role"::text);',
    );
    this.addSql(
      "alter table \"user_auth\" add constraint \"user_auth_role_check\" check (\"role\" in ('ADMIN', 'MANAGEMENT', 'USER', 'EXTERNAL'));",
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_auth" drop constraint if exists "user_auth_role_check";',
    );

    this.addSql(
      'alter table "user_auth" alter column "role" type text using ("role"::text);',
    );
    this.addSql(
      'alter table "user_auth" add constraint "user_auth_role_check" check ("role" in (\'ADMIN\', \'MANAGEMENT\', \'USER\'));',
    );
  }
}
