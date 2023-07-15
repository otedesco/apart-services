import { Cache } from 'cache';
import { Model } from 'objection';
import { App, ConfigOptions, LoggerFactory } from 'server-utils';

import { AccountRoute } from './components/account/routes';
import { AuthenticationRoute, PrivateAuthenticationRoute } from './components/authentication/routes';
import { CACHE_HOST, CACHE_PORT } from './configs/CacheConfig';
import knex, { testDBConnection } from './database';
import { handleError, logError } from './middlewares';
import validateEnv from './utils/validateEnv';

const { logger } = LoggerFactory.getInstance(__filename);

const V1Routes = [new AuthenticationRoute(), new PrivateAuthenticationRoute(), new AccountRoute()];

const serverConfig: ConfigOptions = {
  routes: [{ version: '/v1', routes: V1Routes }],
  logger,
};

class AuthServer extends App {
  async initializeConnections() {
    logger.info('Initializing postgres DB connection');
    Model.knex(knex);
    await testDBConnection().catch(logger.error);
    logger.info('Initializing cache connection');
    await Cache.init(
      { socket: { host: CACHE_HOST, port: CACHE_PORT }, logger },
    ).catch(logger.error);
  }

  initializeErrorHandling(): void {
    logger.info('Initializing error hanlders middlewares');
    this.app.use(logError);
    this.app.use(handleError);
    logger.info('Error hanlders middlewares initialized');
  }
}

validateEnv();
export default new AuthServer(serverConfig);
