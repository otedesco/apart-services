import { generateHash, compareWithHash } from 'commons';
import _ from 'lodash';

import { SALT_ROUNDS } from '../../../configs/AppConfig';
import { ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX } from '../../../configs/KafkaConfig';
import { AccountStatusEnum } from '../../../enums/AccountStatusEnum';
import { UnauthorizedException } from '../../../exceptions/UnauthorizedException';
import { ValidationException } from '../../../exceptions/ValidationException';
import { notify } from '../../../utils/Notifier';
import { Account, SecuredAccount } from '../interfaces/Account';
import { AccountRepository } from '../repositories/AccountRepository';

export class AccountService {
  private AccountRepository: AccountRepository;

  constructor() {
    this.AccountRepository = new AccountRepository();
  }
  public async create(payload: Account, tx = null): Promise<SecuredAccount> {
    await this.validateAccount(payload);

    const accountData = await this.mapAccountData(payload);
    const account = await this.AccountRepository.create(accountData, tx);
    const cleanedAccount = this.clean(account);

    if (payload) notify(ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX, cleanedAccount);

    return cleanedAccount;
  }

  public async verifyAccount({ email, password }: Pick<Account, 'email' | 'password'>): Promise<SecuredAccount> {
    const account = await this.AccountRepository.findByEmail(email);
    if (!account) throw new UnauthorizedException();

    const isValid = await compareWithHash(password, account.password);
    if (isValid) return this.clean(account);

    throw new UnauthorizedException();
  }

  public async findAccountById(id: string): Promise<SecuredAccount> {
    const account = await this.AccountRepository.findById(id);

    return this.clean(account);
  }

  private async mapAccountData(account: Account): Promise<Account> {
    const accountData = {
      ...account,
      status: AccountStatusEnum.EMAIL_VERIFICATION_PENDING,
    };

    if (!account.externalAuthType && account.password) {
      const [hash, salt] = await generateHash(account.password, SALT_ROUNDS);
      return { ...accountData, password: hash, salt };
    }

    return accountData;
  }

  private async validateAccount({ email, externalAuthType, externalId, password }: Account): Promise<void> {
    if (!externalAuthType && !password) throw new ValidationException({ status: 400 });
    if (externalAuthType && !externalId) throw new ValidationException({ status: 400 });

    const account = await this.AccountRepository.findByEmail(email);
    if (account) throw new ValidationException({ status: 400 });
  }

  private clean(account: Account): SecuredAccount {
    return _.omit(account, ['password', 'salt']);
  }
}
