import { sign, verify } from 'commons';
import _ from 'lodash';

import {
  REFRESH_PUBLIC_KEY,
  REFRESH_SECRET_KEY,
  SECRET_KEY,
  SESSION_EXPIRE,
  TOKEN_EXPIRE,
} from '../../../configs/AppConfig';
import { UnauthorizedException } from '../../../exceptions/UnauthorizedException';
import { Transaction } from '../../../utils/Transaction';
import { Account, SecuredAccount } from '../../account/interfaces/Account';
import AccountService from '../../account/services/AccountService';
import ProfileService from '../../profile/services/ProfileService';
import { SignIn } from '../interfaces/SignIn';
import { SignUp } from '../interfaces/SignUp';

function transactionalCreate(payload: SignUp, returning = false) {
  const accountToCreate = _.omit(payload, ['passwordConfirmation', 'name', 'lastName']);
  const profileToCreate = _.pick(payload, ['name', 'lastName']);

  return async (tx: Transaction) => {
    const account = await AccountService.create(accountToCreate, tx);
    const profile = await ProfileService.create({ ...profileToCreate, account: account.id }, tx);
    if (returning) return { account, profiles: [profile] };
  };
}

function signSession(account: SecuredAccount): { accessToken: string; refreshToken: string } {
  const payload = { sub: account.id };
  const accessToken = sign(payload, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}s` });
  const refreshToken = sign(payload, REFRESH_SECRET_KEY, { expiresIn: `${SESSION_EXPIRE}s` });

  return { accessToken, refreshToken };
}

async function signUp(payload: SignUp): Promise<Account> {
  return await Transaction.run(transactionalCreate(payload));
}

async function signIn(payload: SignIn): Promise<{ accessToken: string; refreshToken: string }> {
  const account = await AccountService.verifyAccount(payload);
  const result = signSession(account);

  // TODO:
  // STORE SESSION ON CACHE (REDIS)
  // STORE SESSION INFORMATION ON POSTGRESS

  return result;
}

async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  if (!refreshToken) throw new UnauthorizedException();

  const decoded = verify<{ sub: string }>(refreshToken, REFRESH_PUBLIC_KEY);
  if (!decoded) throw new UnauthorizedException();

  // TODO: THIS SHOULD BE FETCHED FROM REDIS
  const account = await AccountService.findAccountById(decoded.sub);
  if (!account) throw new UnauthorizedException();

  const result = signSession(account);

  return result;
}

export default { signUp, signIn, refreshToken };
