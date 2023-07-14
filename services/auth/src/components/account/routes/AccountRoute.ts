import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Route } from 'server-utils';

import { RoleTypeEnum } from '../../../enums/RoleTypeEnum';
import { deserializeAccount, isPrivate, validateIncomingData, roles } from '../../../middlewares';
import AccountController from '../controllers/AccountController';
import { create } from '../validators/AccountValidator';

export class AccountRoute implements Route {
  public path = '/account';
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, isPrivate);
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validateIncomingData(create),
      roles(RoleTypeEnum.ADMIN, RoleTypeEnum.WRITE),
      asyncHandler(AccountController.create),
    );
  }
}
