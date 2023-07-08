import { ACCOUNT_TABLE } from '../../../configs/DBConfig';
import { Account } from '../interfaces/AccountInterface';
import { Accounts } from '../models/AccountModel';

export class AccountRepository {
  private TABLE: string;
  constructor() {
    this.TABLE = ACCOUNT_TABLE;
  }

  public async findByEmail(email: string) {
    return await Accounts.query().select().from(this.TABLE).where('email', '=', email).first();
  }

  public async create(account: Account) {
    return await Accounts.query().insert(account).into(this.TABLE);
  }
}
