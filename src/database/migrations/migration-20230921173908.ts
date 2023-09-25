import { Migration } from '@mikro-orm/migrations';

export class Migration20230921173908 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `data` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `bits` blob not null, `name` text not null, `type` text not null, `last_modified` datetime not null, primary key (`uuid`));');

    this.addSql('create table `user` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `email` text not null, primary key (`uuid`));');

    this.addSql('create table `session` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `user_uuid` text null, `ip_address` text not null, `payload` json null, `user_agent` text null, `is_expired` integer null, `last_activity_at` datetime not null, constraint `session_user_uuid_foreign` foreign key(`user_uuid`) references `user`(`uuid`) on delete no action on update cascade, primary key (`uuid`));');
    this.addSql('create index `session_user_uuid_index` on `session` (`user_uuid`);');

    this.addSql('create table `demo` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `user_uuid` text not null, `name` text not null, `description` text null, `background_poster_uuid` text not null, `background_brightness` integer not null, `brand_logo_uuid` text not null, `brand_title` text null, `brand_subtitle` text null, `weather_units` integer null, `weather_city_id` integer null, `is_sdk` integer not null, `is_ic` integer not null, `is_sip` integer not null, `sip_title` text null, `extension_number` integer null, `video_link` text null, `sip_title1` text null, `extension_number1` integer null, `video_link1` text null, `sip_title2` text null, `extension_number2` integer null, `video_link2` text null, `sip_title3` text null, `extension_number3` integer null, `video_link3` text null, `display_footnote` integer null default true, constraint `demo_user_uuid_foreign` foreign key(`user_uuid`) references `user`(`uuid`) on delete cascade on update cascade, constraint `demo_background_poster_uuid_foreign` foreign key(`background_poster_uuid`) references `data`(`uuid`) on delete cascade on update cascade, constraint `demo_brand_logo_uuid_foreign` foreign key(`brand_logo_uuid`) references `data`(`uuid`) on delete cascade on update cascade, primary key (`uuid`));');
    this.addSql('create index `demo_user_uuid_index` on `demo` (`user_uuid`);');
    this.addSql('create index `demo_background_poster_uuid_index` on `demo` (`background_poster_uuid`);');
    this.addSql('create index `demo_brand_logo_uuid_index` on `demo` (`brand_logo_uuid`);');
  }

}
