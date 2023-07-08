import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Route } from 'server-utils';

import { validateIncomingData } from '../../../middlewares/SchemaValidator';
import AccountController from '../controllers/AccountController';
import { create } from '../validators/AccountValidator';

export class AccountRoute implements Route {
  public path = '/account';
  public router: Router;
  private accountController: AccountController = new AccountController();

  constructor() {
    this.router = Router();
    this.accountController = new AccountController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validateIncomingData(create), asyncHandler(this.accountController.create));
  }
}
