import { LoggerFactory } from 'server-utils';

import app from './app';

const { logger } = new LoggerFactory('auth-main');

app.listen();

process.on('unhandledRejection', reason => {
  logger.error('unhandledRejection', reason);
  throw reason;
});

process.on('uncaughtException', error => {
  logger.error(`Uncaught Error ${error.toString()}`);
  logger.debug(error.stack);
});
