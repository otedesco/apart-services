import { Request, Response } from 'express';

import { createResponse } from '../../../handlers/ResponseHandler';
import { Account } from '../interfaces/Account';
import { AccountService } from '../services/AccountService';

class AccountController {
  public accountService = new AccountService();

  public create = async (req: Request, res: Response): Promise<void> => {
    const accountData: Account = req.body;
    const { status } = await createResponse(this.accountService.create(accountData));

    res.status(status).json();
  };
}

export default AccountController;
