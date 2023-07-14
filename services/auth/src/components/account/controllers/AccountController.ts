import { Request, Response } from 'express';

import { createResponse } from '../../../handlers/ResponseHandler';
import { Account } from '../interfaces/Account';
import AccountService from '../services/AccountService';

async function create(req: Request, res: Response) {
  const accountData: Account = req.body;
  const { status, data } = await createResponse(AccountService.create(accountData));

  res.status(status).json(data);
}

export default { create };
