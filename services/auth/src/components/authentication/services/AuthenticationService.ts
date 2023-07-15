import { sign, verify } from 'commons';
import _ from 'lodash';
import { Transaction } from 'objection';

import {
  REFRESH_PUBLIC_KEY,
  REFRESH_SECRET_KEY,
  SECRET_KEY,
  SESSION_EXPIRE,
  TOKEN_EXPIRE,
} from '../../../configs/AppConfig';
import { UnauthorizedException } from '../../../exceptions/UnauthorizedException';
import { Transaction as Transactional } from '../../../utils/Transaction';
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

function signSession(account: SecuredAccount): { accessToken: string | null; refreshToken: string | null } {
  const payload = { sub: account.id };
  
  return { 
    accessToken: sign(payload, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}s` }), 
    refreshToken: sign(payload, REFRESH_SECRET_KEY, { expiresIn: `${SESSION_EXPIRE}s` }), 
  };
}

async function signUp(payload: SignUp): Promise<Account> {
  return Transactional.run(transactionalCreate(payload));
}

async function signIn(payload: SignIn): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const account = await AccountService.verifyAccount(payload);
  const result = signSession(account);

  // TODO:
  // STORE SESSION ON CACHE (REDIS)
  // STORE SESSION INFORMATION ON POSTGRESS

  return result;
}

async function refreshToken(token: string): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  if (!refreshToken) throw new UnauthorizedException();

  const decoded = verify<{ sub: string }>(token, REFRESH_PUBLIC_KEY);
  if (!decoded) throw new UnauthorizedException();

  // TODO: THIS SHOULD BE FETCHED FROM REDIS
  const account = await AccountService.findAccountById(decoded.sub);
  if (!account) throw new UnauthorizedException();

  const result = signSession(account);

  return result;
}

export default { signUp, signIn, refreshToken };
