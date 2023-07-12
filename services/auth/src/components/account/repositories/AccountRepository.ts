import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';

export class AccountRepository {
  private TABLE: string;
  constructor() {
    this.TABLE = Accounts.tableName;
  }

  public async findByEmail(email: string) {
    return await Accounts.query().select().from(this.TABLE).where('email', '=', email).first();
  }

  public async create(account: Account) {
    return await Accounts.query().insert(account).into(this.TABLE);
  }
}
