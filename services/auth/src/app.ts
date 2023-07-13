import { Model } from 'objection';
import { App, ConfigOptions, LoggerFactory } from 'server-utils';

import { AccountRoute } from './components/account/routes';
import { AuthenticationRoute } from './components/authentication/routes';
import knex, { testDBConnection } from './database';
import { handleError, logError } from './middlewares';
import validateEnv from './utils/validateEnv';

const { logger } = new LoggerFactory('auth-app');

const V1Routes = [new AuthenticationRoute(), new AccountRoute()];

const serverConfig: ConfigOptions = {
  routes: [{ version: '/v1', routes: V1Routes }],
  logger,
};

class AuthServer extends App {
  async initializeConnections() {
    Model.knex(knex);
    await testDBConnection();
  }

  initializeErrorHandling(): void {
    this.app.use(logError);
    this.app.use(handleError);
  }
}

validateEnv();
export default new AuthServer(serverConfig);
