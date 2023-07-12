import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';

export class AccountRepository {
  public async findByEmail(email: string, trx = null) {
    return await Accounts.query(trx).select().where('email', '=', email).first();
  }

  public async create(account: Account, trx = null) {
    return await Accounts.query(trx).insert(account);
  }
}
