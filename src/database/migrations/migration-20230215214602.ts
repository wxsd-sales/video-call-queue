import { Migration } from '@mikro-orm/migrations';

export class Migration20230215214602 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `demo` add column `extension_number` integer null;');
    this.addSql('alter table `demo` add column `video_link` text null;');
  }
}
