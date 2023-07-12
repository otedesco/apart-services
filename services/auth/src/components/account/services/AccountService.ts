import { generateHash } from 'commons';
import _ from 'lodash';

import { SALT_ROUNDS } from '../../../configs/AppConfig';
import { ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX } from '../../../configs/KafkaConfig';
import { AccountStatusEnum } from '../../../enums/AccountStatusEnum';
import ValidationException from '../../../exceptions/ValidationException';
import { notify } from '../../../utils/Notifier';
import { Account } from '../interfaces/Account';
import { AccountRepository } from '../repositories/AccountRepository';

export class AccountService {
  private AccountRepository: AccountRepository;

  constructor() {
    this.AccountRepository = new AccountRepository();
  }
  public async create(account: Account, tx = null): Promise<Omit<Account, 'password' | 'salt'>> {
    await this.validateAccount(account);

    const accountData = await this.mapAccountData(account);
    const newAccount = await this.AccountRepository.create(accountData, tx);

    if (newAccount) notify(ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX, newAccount);

    return _.omit(newAccount, ['password', 'salt']);
  }

  private async mapAccountData(account: Account): Promise<Account> {
    const accountData = {
      ...account,
      status: AccountStatusEnum.EMAIL_VERIFICATION_PENDING,
    };

    if (!account.externalAuthType && account.password) {
      const { generatedHash, generatedSalt } = await generateHash(account.password, SALT_ROUNDS);

      return { ...accountData, password: generatedHash, salt: generatedSalt };
    }

    return accountData;
  }

  private async validateAccount({ email, externalAuthType, externalId, password }: Account): Promise<void> {
    if (!externalAuthType && !password) throw new ValidationException({ status: 400 });
    if (externalAuthType && !externalId) throw new ValidationException({ status: 400 });

    const account = await this.AccountRepository.findByEmail(email);
    if (account) throw new ValidationException({ status: 400 });
  }
}
