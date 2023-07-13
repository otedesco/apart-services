import { verify } from 'commons';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import { AccountService } from '../components/account/services/AccountService';
import { PUBLIC_KEY } from '../configs/AppConfig';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

function getAccessToken({ headers, cookies }: Request): string | null {
  const keys = ['Authorization', 'authorization', 'X-Authorization'];

  const authorizationHeader = _.get(headers, _.findKey(headers, keys), null);
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) return authorizationHeader.split(' ')[1];

  const authorizationCookie = _.get(cookies, 'access_token', null);
  if (authorizationCookie) return authorizationCookie;

  return null;
}

async function getAccountFromDB(id: string) {
  const accountService = new AccountService();
  return await accountService.findAccountById(id);
}

export async function deserializeAccount(req: Request, res: Response, next: NextFunction) {
  const accessToken = getAccessToken(req);
  if (!accessToken) next(UnauthorizedException);

  const data: { sub: string } = verify(accessToken, PUBLIC_KEY);
  if (!data) next(UnauthorizedException);

  // sessionAccount = getSessionFromRedis(data.sub)
  // if !sessionAccount next(UnauthorizedException)

  //   res.locals.user = sessionAccount;

  // FIXME: REPLACE THIS IMPLEMENTATION WITH PREVIOUS LOGIG
  const account = getAccountFromDB(data.sub);
  if (!account) next(UnauthorizedException);

  res.locals.account = account;
  next();
}
