import 'reflect-metadata';
import { IsNotEmpty, IsString, IsUrl, validateSync } from 'class-validator';
// import { VALID_ACCESS_TOKEN } from './constants';
import { dev } from '$app/env';
import humps from 'humps';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export class Environment {
  private static readonly appUrlConfig = humps.decamelizeKeys({
    protocols: dev ? ['http', 'https'] : ['https'],
    requireProtocol: true,
    requireTld: false,
    allowQueryComponents: false,
    allowFragments: false
  });

  @IsUrl(Environment.appUrlConfig)
  public readonly APP_URL: string;

  @IsUrl()
  public readonly OPENWEATHERMAP_API_URL: string;

  @IsNotEmpty()
  public readonly OPENWEATHERMAP_API_KEY: string;

  @IsNotEmpty()
  public readonly WEBEX_API_URL: string;

  // @IsNotEmpty()
  // public readonly WEBEX_REDIRECT_URI: string;

  // @IsUrl()
  // public readonly WEBEX_OAUTH_HELP_SERVICE_URL: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_ID: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE: string;

  // @IsEmail()
  // public readonly WEBEX_BOT_EMAIL: string;

  // @IsNotEmpty()
  // public readonly WEBEX_BOT_ID: string;

  // @IsNotEmpty()
  // @Matches(VALID_ACCESS_TOKEN)
  // public readonly WEBEX_BOT_TOKEN: string;

  @IsString()
  public readonly ORIGIN: string;

  // @IsNotEmpty()
  // public readonly PUBLIC_APPD_CONFIG_APP_KEY: string;

  // @IsNotEmpty()
  // public readonly PUBLIC_APPD_CONFIG_EXTERNAL_URL: string;

  // @IsNotEmpty()
  // public readonly PUBLIC_APPD_CONFIG_BEACON_URL: string;

  constructor() {
    dotenvExpand.expand(dotenv.config({ path: dev ? '.env.development' : '.env.production' }));
    this.APP_URL = process.env.APP_URL || dev ? 'https://localhost:5173' : 'https://localhost:4173';
    this.OPENWEATHERMAP_API_URL = process.env.OPENWEATHERMAP_API_URL as string;
    this.OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY as string;
    this.WEBEX_API_URL = process.env.WEBEX_API_URL as string;
    // this.WEBEX_REDIRECT_URI = process.env.WEBEX_REDIRECT_URI as string;
    // this.WEBEX_OAUTH_HELP_SERVICE_URL = process.env.WEBEX_OAUTH_HELP_SERVICE_URL as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_ID = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_ID as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE as string;
    // this.WEBEX_BOT_EMAIL = process.env.WEBEX_BOT_EMAIL as string;
    // this.WEBEX_BOT_ID = process.env.WEBEX_BOT_ID as string;
    // this.WEBEX_BOT_TOKEN = process.env.WEBEX_BOT_TOKEN as string;
    this.ORIGIN = process.env.ORIGIN as string;
    // this.PUBLIC_APPD_CONFIG_APP_KEY = process.env.PUBLIC_APPD_CONFIG_APP_KEY as string;
    // this.PUBLIC_APPD_CONFIG_EXTERNAL_URL = process.env.PUBLIC_APPD_CONFIG_EXTERNAL_URL as string;
    // this.PUBLIC_APPD_CONFIG_BEACON_URL = process.env.PUBLIC_APPD_CONFIG_BEACON_URL as string;
  }
}

const environment = new Environment();
const environmentValidationErrors = validateSync(environment);

if (environmentValidationErrors.length > 0) {
  if (dev || import.meta.env.PUBLIC_APP_DEBUG === 'true') console.error(environmentValidationErrors);
  throw Error('Invalid .env configuration.');
}

export default environment;
