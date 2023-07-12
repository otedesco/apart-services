import { Request, Response } from 'express';

import { createResponse } from '../../../handlers/ResponseHandler';
import { Account } from '../interfaces/Account';
import { AccountService } from '../services/AccountService';

class AccountController {
  private AccountService: AccountService;

  constructor() {
    this.AccountService = new AccountService();
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    const accountData: Account = req.body;
    const { status, data } = await createResponse(this.AccountService.create(accountData));

    res.status(status).json(data);
  };
}

export default AccountController;
