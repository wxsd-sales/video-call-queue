import 'reflect-metadata';
import type { MEETING_TYPE_OPTIONS } from '$lib/enums';
import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { BaseEntity } from './base-entity';
import { User } from './user';
import { Data } from './data';

@Entity()
export class Demo extends BaseEntity {
  @ManyToOne({ entity: () => User, onDelete: 'cascade' })
  user!: User;

  @Property({ type: types.string, nullable: true })
  name!: string;

  @Property({ type: types.string, nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade' })
  backgroundPoster!: Data;

  @Property({ type: types.integer })
  backgroundBrightness!: number;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade' })
  brandLogo!: Data;

  @Property({ type: types.string, nullable: true })
  brandTitle!: string;

  @Property({ type: types.string, nullable: true })
  brandSubtitle!: string;

  @Property({ type: types.enum, nullable: true })
  weatherUnits!: 'imperial' | 'metric' | 'standard' | null;

  @Property({ type: types.integer, nullable: true })
  weatherCityId!: number;

  @Property({ type: types.boolean })
  isSDK: boolean;

  @Property({ type: types.boolean })
  isIC: boolean;

  @Property({ type: types.boolean })
  isSIP: boolean;

  @Property({ type: types.string, nullable: true })
  sipTitle: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade', nullable: true })
  sipImage!: Data | null;

  @Property({ type: types.integer, nullable: true })
  extensionNumber: number;

  @Property({ type: types.string, nullable: true })
  videoLink: string;

  @Property({ type: types.string, nullable: true })
  sipTitle1: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade', nullable: true })
  sipImage1!: Data | null;

  @Property({ type: types.integer, nullable: true })
  extensionNumber1: number;

  @Property({ type: types.string, nullable: true })
  videoLink1: string;

  @Property({ type: types.string, nullable: true })
  sipTitle2: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade', nullable: true })
  sipImage2!: Data | null;

  @Property({ type: types.integer, nullable: true })
  extensionNumber2: number;

  @Property({ type: types.string, nullable: true })
  videoLink2: string;

  @Property({ type: types.string, nullable: true })
  sipTitle3: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade', nullable: true })
  sipImage3!: Data | null;

  @Property({ type: types.integer, nullable: true })
  extensionNumber3: number;

  @Property({ type: types.string, nullable: true })
  videoLink3: string;

  @Property({ type: types.boolean, default: true, nullable: true })
  displayFootnote: boolean;

  constructor(obj: {
    user: User;
    name: string;
    description?: string;
    backgroundPoster: Data;
    backgroundBrightness: number;
    brandLogo: Data;
    brandTitle: string;
    brandSubtitle: string;
    weatherUnits: 'imperial' | 'metric' | 'standard' | null;
    weatherCityId: number;
    isSDK: boolean;
    isIC: boolean;
    isSIP: boolean;
    sipTitle: string;
    sipImage: Data;
    extensionNumber: number;
    videoLink: string;
    sipTitle1: string;
    sipImage1: Data;
    extensionNumber1: number;
    videoLink1: string;
    sipTitle2: string;
    sipImage2: Data;
    extensionNumber2: number;
    videoLink2: string;
    sipTitle3: string;
    sipImage3: Data;
    extensionNumber3: number;
    videoLink3: string;
    displayFootnote: boolean;
  }) {
    super();
    this.user = obj.user;
    this.name = obj.name;
    this.description = obj.description;
    this.backgroundPoster = obj.backgroundPoster;
    this.backgroundBrightness = obj.backgroundBrightness;
    this.brandLogo = obj.brandLogo;
    this.brandTitle = obj.brandTitle;
    this.brandSubtitle = obj.brandSubtitle;
    this.weatherUnits = obj.weatherUnits;
    this.weatherCityId = obj.weatherCityId;
    this.isSDK = obj.isSDK;
    this.isIC = obj.isIC;
    this.isSIP = obj.isSIP;
    this.sipTitle = obj.sipTitle;
    this.sipImage = obj.sipImage;
    this.extensionNumber = obj.extensionNumber;
    this.videoLink = obj.videoLink;
    this.sipTitle1 = obj.sipTitle1;
    this.sipImage1 = obj.sipImage1;
    this.extensionNumber1 = obj.extensionNumber1;
    this.videoLink1 = obj.videoLink1;
    this.sipTitle2 = obj.sipTitle2;
    this.sipImage2 = obj.sipImage2;
    this.extensionNumber2 = obj.extensionNumber2;
    this.videoLink2 = obj.videoLink2;
    this.sipTitle3 = obj.sipTitle3;
    this.sipImage3 = obj.sipImage3;
    this.extensionNumber3 = obj.extensionNumber3;
    this.videoLink3 = obj.videoLink3;
    this.displayFootnote = obj.displayFootnote;
  }
}
