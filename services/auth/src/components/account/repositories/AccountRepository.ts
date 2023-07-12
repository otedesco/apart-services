import { Transaction } from 'objection';

import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';

export class AccountRepository {
  public async findByEmail(email: string, tx: Transaction = null) {
    return await Accounts.query(tx).select().where('email', '=', email).first();
  }

  public async create(account: Account, tx: Transaction = null) {
    return await Accounts.query(tx).insert(account);
  }
}
