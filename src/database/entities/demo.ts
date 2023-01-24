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

  @Property({ type: types.string })
  name!: string;

  @Property({ type: types.string, nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade' })
  backgroundPoster!: Data;

  @Property({ type: types.integer })
  backgroundBrightness!: number;

  @ManyToOne({ entity: () => Data, onDelete: 'cascade' })
  brandLogo!: Data;

  @Property({ type: types.string })
  brandTitle!: string;

  @Property({ type: types.string })
  brandSubtitle!: string;

  @Property({ type: types.enum })
  weatherUnits!: 'imperial' | 'metric' | 'standard';

  @Property({ type: types.integer })
  weatherCityId!: number;

  @Property({ type: types.boolean })
  responderAuthIsRequired!: boolean;

  @Property({ type: types.boolean })
  isSDK: boolean;

  @Property({ type: types.boolean })
  isIC: boolean;

  @Property({ type: types.boolean })
  isSIP: boolean;

  constructor(obj: {
    user: User;
    name: string;
    description?: string;
    backgroundPoster: Data;
    backgroundBrightness: number;
    brandLogo: Data;
    brandTitle: string;
    brandSubtitle: string;
    weatherUnits: 'imperial' | 'metric' | 'standard';
    weatherCityId: number;
    responderAuthIsRequired: boolean;
    isSDK: boolean;
    isIC: boolean;
    isSIP: boolean;
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
    this.responderAuthIsRequired = obj.responderAuthIsRequired;
    this.isSDK = obj.isSDK;
    this.isIC = obj.isIC;
    this.isSIP = obj.isSIP;
  }
}
