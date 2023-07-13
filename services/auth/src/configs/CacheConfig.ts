import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const environment = process.env;

export const CACHE_PORT = +environment.CACHE_PORT || 6379;
export const CACHE_HOST = environment.CACHE_HOST || 'localhost';
