import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Route } from 'server-utils';

import { validateIncomingData } from '../../../middlewares/SchemaValidator';
import { AuthenticationController } from '../controllers/AuthenticationController';
import { signUp } from '../validators/AuthenticationValidator';

export class AuthenticationRoute implements Route {
  public path: string;
  public router: Router;
  public authenticationController: AuthenticationController;

  constructor() {
    this.path = '/auth';
    this.router = Router();
    this.authenticationController = new AuthenticationController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/sign-up`,
      validateIncomingData(signUp),
      asyncHandler(this.authenticationController.signUp),
    );
  }
}
