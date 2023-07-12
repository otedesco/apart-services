import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

export const APP_NAME = environment.APP_NAME || 'auth';
export const NODE_ENV = environment.NODE_ENV || 'development';
export const PORT = environment.PORT || 3000;

export const LOG_DIR = environment.LOG_DIR || '../logs';
export const LOG_FORMAT = environment.LOG_FORMAT || 'dev';

export const ORIGIN = environment.ORIGIN || '*';
export const CREDENTIALS = environment.CREDENTIALS === 'true' || false;

export const SECRET_KEY = environment.PRIVATE_KEY || 'super-secret-key';
export const PUBLIC_KEY = environment.PUBLIC_KEY || 'not-so-secret-key';
export const TOKEN_EXPIRE = 3600;

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  expires: new Date(Date.now() + TOKEN_EXPIRE * 1000),
  maxAge: TOKEN_EXPIRE * 1000,
  httpOnly: true,
  sameSite: 'lax',
  secure: NODE_ENV === 'production' || false,
};

export const SALT_ROUNDS = +environment.SALT_ROUNDS || 10;

export const PROMISE_CONCURRENCY = +environment.PROMISE_CONCURRENCY ?? 10;

export const REQUESTER = {
  userId: APP_NAME,
  applicationId: APP_NAME,
  userName: APP_NAME,
};
