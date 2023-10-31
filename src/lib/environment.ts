import 'reflect-metadata';
import { IsEmail, IsNotEmpty, IsUrl, Matches, validateSync } from 'class-validator';
import { VALID_ACCESS_TOKEN } from './constants';
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

  @IsNotEmpty()
  public readonly WEBEX_REDIRECT_URI: string;

  @IsUrl()
  public readonly WEBEX_OAUTH_HELP_SERVICE_URL: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_ID: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET: string;

  @IsNotEmpty()
  public readonly WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_TOKEN_ENDPOINT: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_TYPE: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_CLIENT_ID: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_CLIENT_SECRET: string;

  @IsNotEmpty()
  public readonly WEBEX_DEVICE_CODE_CLIENT_SCOPE: string;

  @IsEmail()
  public readonly WEBEX_BOT_EMAIL: string;

  @IsNotEmpty()
  public readonly WEBEX_BOT_ID: string;

  @IsNotEmpty()
  @Matches(VALID_ACCESS_TOKEN)
  public readonly WEBEX_BOT_TOKEN: string;

  @IsNotEmpty()
  public readonly WEBEX_NOTIFICATION_CHANNEL_ID: string;

  @IsNotEmpty()
  @Matches(VALID_ACCESS_TOKEN)
  public readonly WEBEX_NOTIFICATION_CHANNEL_TOKEN: string;

  @IsUrl()
  public readonly MINDY_REST_URL: string;

  @IsUrl()
  public readonly INSTANT_CONNECT_REST_URL: string;

  @IsUrl()
  public readonly INSTANT_CONNECT_LEGACY_REST_URL: string;

  @IsNotEmpty()
  public readonly INSTANT_CONNECT_USER_TOKEN: string;

  @IsNotEmpty()
  public readonly INSTANT_CONNECT_AUD: string;

  @IsNotEmpty()
  public readonly INSTANT_CONNECT_ORG_ID: string;

  @IsNotEmpty()
  public readonly PUBLIC_INSTANT_CONNECT_TALK_URL: string;

  @IsNotEmpty()
  public readonly PUBLIC_INSTANT_CONNECT_GETTING_STARTED_URL: string;

  @IsNotEmpty()
  public readonly PUBLIC_NODE_SERVER_URL_SIP_DEMO: string;

  @IsNotEmpty()
  public readonly PUBLIC_SOAP_BOX_URL: string;

  @IsNotEmpty()
  public readonly PUBLIC_WEBEX_DEV_PORTAL_URL: string;

  @IsUrl()
  public readonly PUBLIC_TUNNEL: string;

  @IsNotEmpty()
  public readonly PUBLIC_APPD_CONFIG_APP_KEY: string;

  @IsNotEmpty()
  public readonly PUBLIC_APPD_CONFIG_EXTERNAL_URL: string;

  @IsNotEmpty()
  public readonly PUBLIC_APPD_CONFIG_BEACON_URL: string;

  constructor() {
    dotenvExpand.expand(dotenv.config({ path: dev ? '.env.development' : '.env.production' }));
    this.APP_URL = process.env.APP_URL || dev ? 'https://localhost:5173' : 'https://localhost:4173';
    this.OPENWEATHERMAP_API_URL = process.env.OPENWEATHERMAP_API_URL as string;
    this.OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY as string;
    this.WEBEX_API_URL = process.env.WEBEX_API_URL as string;
    this.WEBEX_REDIRECT_URI = process.env.WEBEX_REDIRECT_URI as string;
    this.WEBEX_OAUTH_HELP_SERVICE_URL = process.env.WEBEX_OAUTH_HELP_SERVICE_URL as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_ID = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_ID as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET as string;
    this.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE = process.env.WEBEX_AUTHORIZATION_CODE_CLIENT_SCOPE as string;
    this.WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT = process.env.WEBEX_DEVICE_CODE_AUTHORIZE_ENDPOINT as string;
    this.WEBEX_DEVICE_CODE_TOKEN_ENDPOINT = process.env.WEBEX_DEVICE_CODE_TOKEN_ENDPOINT as string;
    this.WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT = process.env.WEBEX_DEVICE_CODE_VALIDATE_ENDPOINT as string;
    this.WEBEX_DEVICE_CODE_TYPE = process.env.WEBEX_DEVICE_CODE_TYPE as string;
    this.WEBEX_DEVICE_CODE_CLIENT_ID = process.env.WEBEX_DEVICE_CODE_CLIENT_ID as string;
    this.WEBEX_DEVICE_CODE_CLIENT_SECRET = process.env.WEBEX_DEVICE_CODE_CLIENT_SECRET as string;
    this.WEBEX_DEVICE_CODE_CLIENT_SCOPE = process.env.WEBEX_DEVICE_CODE_CLIENT_SCOPE as string;
    this.WEBEX_BOT_EMAIL = process.env.WEBEX_BOT_EMAIL as string;
    this.WEBEX_BOT_ID = process.env.WEBEX_BOT_ID as string;
    this.WEBEX_BOT_TOKEN = process.env.WEBEX_BOT_TOKEN as string;
    this.WEBEX_NOTIFICATION_CHANNEL_ID = process.env.WEBEX_NOTIFICATION_CHANNEL_ID as string;
    this.WEBEX_NOTIFICATION_CHANNEL_TOKEN = process.env.WEBEX_NOTIFICATION_CHANNEL_TOKEN as string;
    this.MINDY_REST_URL = process.env.MINDY_REST_URL as string;
    this.INSTANT_CONNECT_LEGACY_REST_URL = process.env.INSTANT_CONNECT_LEGACY_REST_URL as string;
    this.INSTANT_CONNECT_REST_URL = process.env.INSTANT_CONNECT_REST_URL as string;
    this.INSTANT_CONNECT_USER_TOKEN = process.env.INSTANT_CONNECT_USER_TOKEN as string;
    this.INSTANT_CONNECT_AUD = process.env.INSTANT_CONNECT_AUD as string;
    this.INSTANT_CONNECT_ORG_ID = process.env.INSTANT_CONNECT_ORG_ID as string;
    this.PUBLIC_INSTANT_CONNECT_TALK_URL = process.env.PUBLIC_INSTANT_CONNECT_TALK_URL as string;
    this.PUBLIC_INSTANT_CONNECT_GETTING_STARTED_URL = process.env.PUBLIC_INSTANT_CONNECT_GETTING_STARTED_URL as string;
    this.PUBLIC_NODE_SERVER_URL_SIP_DEMO = process.env.PUBLIC_NODE_SERVER_URL_SIP_DEMO as string;
    this.PUBLIC_SOAP_BOX_URL = process.env.PUBLIC_SOAP_BOX_URL as string;
    this.PUBLIC_WEBEX_DEV_PORTAL_URL = process.env.PUBLIC_WEBEX_DEV_PORTAL_URL as string;
    this.PUBLIC_TUNNEL = process.env.PUBLIC_TUNNEL as string;
    this.PUBLIC_APPD_CONFIG_APP_KEY = process.env.PUBLIC_APPD_CONFIG_APP_KEY as string;
    this.PUBLIC_APPD_CONFIG_EXTERNAL_URL = process.env.PUBLIC_APPD_CONFIG_EXTERNAL_URL as string;
    this.PUBLIC_APPD_CONFIG_BEACON_URL = process.env.PUBLIC_APPD_CONFIG_BEACON_URL as string;
  }
}

const environment = new Environment();
const environmentValidationErrors = validateSync(environment);

if (environmentValidationErrors.length > 0) {
  if (dev || import.meta.env.PUBLIC_APP_DEBUG === 'true') console.error(environmentValidationErrors);
  throw Error('Invalid .env configuration.');
}

export default environment;
