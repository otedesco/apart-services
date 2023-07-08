import { Request } from 'express';

import { Account } from './AccountInterface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  account: Account;
}
