import { Migration } from '@mikro-orm/migrations';

export class Migration20231010165918 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `demo` add column `sip_image4_uuid` text null constraint demo_sip_image4_uuid_foreign references `data` (`uuid`) on update cascade on delete cascade;'
    );
    this.addSql('alter table `demo` rename column `video_link` to `video_link4`;');
    this.addSql('drop index `demo_sip_image_uuid_index`;');
    this.addSql('alter table `demo` rename column `extension_number` to `extension_number4`;');
    this.addSql('create index `demo_sip_image4_uuid_index` on `demo` (`sip_image4_uuid`);');
  }
}
