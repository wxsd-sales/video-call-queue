import { Migration } from '@mikro-orm/migrations';

export class Migration20231010162639 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `demo` rename column `sip_title` to `sip_title4`;');
  }
}
