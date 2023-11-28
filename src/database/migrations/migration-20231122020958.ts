import { Migration } from '@mikro-orm/migrations';

export class Migration20231122020958 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `demo` add column `display_weather` integer null;');
  }

}
