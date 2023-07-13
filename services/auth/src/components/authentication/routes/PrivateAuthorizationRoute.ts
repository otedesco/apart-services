import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Route } from 'server-utils';

import { deserializeAccount, isPrivate } from '../../../middlewares';
import { AuthenticationController } from '../controllers/AuthenticationController';

export class AuthenticationRoute implements Route {
  public path: string;
  public router: Router;
  public authenticationController: AuthenticationController;

  constructor() {
    this.path = '/auth';
    this.router = Router();
    this.authenticationController = new AuthenticationController();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, isPrivate);
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-out`, asyncHandler(this.authenticationController.signOut));
  }
}
