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

const tokenSub: keyof Account = 'email';

function transactionalCreate(payload: SignUp, returning = false) {
  const accountToCreate = _.omit(payload, ['passwordConfirmation', 'name', 'lastName']);
  const profileToCreate = _.pick(payload, ['name', 'lastName']);

  return async (tx: Transaction) => {
    const account = await AccountService.create(accountToCreate, tx);
    const profile = await ProfileService.create({ ...profileToCreate, account: account.id }, tx);
    if (returning) return { account, profiles: [profile] };
  };
}

async function signSession(handler: Promise<SecuredAccount | null> ) {
  const account = await handler;
  if (!account) throw new UnauthorizedException();

  const payload = _.pick(account, tokenSub);
  
  return { 
    accessToken: sign(payload, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}s` }), 
    refreshToken: sign(payload, REFRESH_SECRET_KEY, { expiresIn: `${SESSION_EXPIRE}s` }), 
  };
}

async function signUp(payload: SignUp): Promise<Account> {
  return Transactional.run(transactionalCreate(payload));
}

function signIn(payload: SignIn) {
  return signSession(AccountService.verifyAccount(payload));
}

async function refreshToken(token: string) {
  if (!token) throw new UnauthorizedException();

  return  signSession(AccountService.findOne(verify(token, REFRESH_PUBLIC_KEY)));
}

export default { signUp, signIn, refreshToken };
