import { generateHash, compareWithHash } from 'commons';
import _ from 'lodash';

import { SALT_ROUNDS } from '../../../configs/AppConfig';
import { ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX } from '../../../configs/KafkaConfig';
import { AccountStatusEnum } from '../../../enums/AccountStatusEnum';
import { UnauthorizedException } from '../../../exceptions/UnauthorizedException';
import { ValidationException } from '../../../exceptions/ValidationException';
import { notify } from '../../../utils/Notifier';
import { Account, SecuredAccount } from '../interfaces/Account';
import AccountRepository from '../repositories/AccountRepository';

function clean(account: Account): SecuredAccount {
  return _.omit(account, ['password', 'salt']);
}

async function validateAccount({ email, externalAuthType, externalId, password }: Account): Promise<void> {
  if (!externalAuthType && !password) throw new ValidationException({ status: 400 });
  if (externalAuthType && !externalId) throw new ValidationException({ status: 400 });

  const account = await AccountRepository.findByEmail(email);
  if (account) throw new ValidationException({ status: 400 });
}

async function mapAccountData(account: Account): Promise<Account> {
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

async function create(payload: Account, tx = null): Promise<SecuredAccount> {
  await validateAccount(payload);
  const accountData = await mapAccountData(payload);
  const account = await AccountRepository.create(accountData, tx);
  const cleanedAccount = clean(account);

  if (payload) notify(ACCOUNT_TOPIC, CREATED_EVENTS_SUFIX, cleanedAccount);

  return cleanedAccount;
}

async function verifyAccount({ email, password }: Pick<Account, 'email' | 'password'>): Promise<SecuredAccount> {
  const account = await AccountRepository.findByEmail(email);
  if (!account) throw new UnauthorizedException();

  const isValid = await compareWithHash(password, account.password);
  if (isValid) return clean(account);

  throw new UnauthorizedException();
}

async function findAccountById(id: string): Promise<SecuredAccount> {
  const account = await AccountRepository.findById(id);

  return clean(account);
}

export default { create, verifyAccount, findAccountById };
