import { Migration } from '@mikro-orm/migrations';

export class Migration20230925205333 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `demo` add column `sip_image_uuid` text null constraint demo_sip_image_uuid_foreign references `data` (`uuid`) on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table `demo` add column `sip_image1_uuid` text null constraint demo_sip_image1_uuid_foreign references `data` (`uuid`) on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table `demo` add column `sip_image2_uuid` text null constraint demo_sip_image2_uuid_foreign references `data` (`uuid`) on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table `demo` add column `sip_image3_uuid` text null constraint demo_sip_image3_uuid_foreign references `data` (`uuid`) on update cascade on delete cascade;'
    );
    this.addSql('create index `demo_sip_image_uuid_index` on `demo` (`sip_image_uuid`);');
    this.addSql('create index `demo_sip_image1_uuid_index` on `demo` (`sip_image1_uuid`);');
    this.addSql('create index `demo_sip_image2_uuid_index` on `demo` (`sip_image2_uuid`);');
    this.addSql('create index `demo_sip_image3_uuid_index` on `demo` (`sip_image3_uuid`);');
  }
}
