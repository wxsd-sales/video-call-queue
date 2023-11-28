import { Migration } from '@mikro-orm/migrations';

export class Migration20231122021646 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter357` (`uuid` text NOT NULL, `created_at` datetime NOT NULL DEFAULT current_timestamp, `updated_at` datetime NOT NULL DEFAULT current_timestamp, `user_uuid` text NOT NULL, `name` text, `description` text NULL, `background_poster_uuid` text NOT NULL, `background_brightness` integer NOT NULL, `brand_logo_uuid` text NOT NULL, `brand_title` text NULL, `brand_subtitle` text NULL, `weather_city_id` integer NULL, `is_sdk` integer, `is_ic` integer, `is_sip` integer, `sip_title4` text NULL, `extension_number4` integer NULL, `video_link4` text NULL, `sip_title1` text NULL, `extension_number1` integer NULL, `video_link1` text NULL, `sip_title2` text NULL, `extension_number2` integer NULL, `video_link2` text NULL, `sip_title3` text NULL, `extension_number3` integer NULL, `video_link3` text NULL, `display_footnote` integer NULL DEFAULT true, `weather_units` TEXT DEFAULT \'imperial\', `sip_image_uuid` text NULL CONSTRAINT `demo_sip_image_uuid_foreign` REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, `sip_image1_uuid` text NULL CONSTRAINT `demo_sip_image1_uuid_foreign` REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, `sip_image2_uuid` text NULL CONSTRAINT `demo_sip_image2_uuid_foreign` REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, `sip_image3_uuid` text NULL CONSTRAINT `demo_sip_image3_uuid_foreign` REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, `sip_image4_uuid` text NULL CONSTRAINT `demo_sip_image4_uuid_foreign` REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, `display_weather` integer NULL, CONSTRAINT `demo_user_uuid_foreign` FOREIGN KEY (`user_uuid`) REFERENCES `user` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `demo_background_poster_uuid_foreign` FOREIGN KEY (`background_poster_uuid`) REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT `demo_brand_logo_uuid_foreign` FOREIGN KEY (`brand_logo_uuid`) REFERENCES `data` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`uuid`));');
    this.addSql('INSERT INTO "_knex_temp_alter357" SELECT * FROM "demo";;');
    this.addSql('DROP TABLE "demo";');
    this.addSql('ALTER TABLE "_knex_temp_alter357" RENAME TO "demo";');
    this.addSql('CREATE INDEX `demo_user_uuid_index` on `demo` (`user_uuid`);');
    this.addSql('CREATE INDEX `demo_background_poster_uuid_index` on `demo` (`background_poster_uuid`);');
    this.addSql('CREATE INDEX `demo_brand_logo_uuid_index` on `demo` (`brand_logo_uuid`);');
    this.addSql('CREATE INDEX `demo_sip_image1_uuid_index` on `demo` (`sip_image1_uuid`);');
    this.addSql('CREATE INDEX `demo_sip_image2_uuid_index` on `demo` (`sip_image2_uuid`);');
    this.addSql('CREATE INDEX `demo_sip_image3_uuid_index` on `demo` (`sip_image3_uuid`);');
    this.addSql('CREATE INDEX `demo_sip_image4_uuid_index` on `demo` (`sip_image4_uuid`);');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
