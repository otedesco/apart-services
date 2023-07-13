import { verify } from 'commons';
import { NextFunction, Request, Response } from 'express';
import _, { head } from 'lodash';

import { AccountService } from '../components/account/services/AccountService';
import { PUBLIC_KEY, REFRESH_PUBLIC_KEY } from '../configs/AppConfig';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

function getAccessToken({ headers, cookies }: Request): string | null {
  const keys = ['Authorization', 'authorization', 'X-Authorization'];

  const authorizationHeader = _.get(headers, _.findKey(headers, keys), null);
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) return authorizationHeader.split(' ')[1];

  const authorizationCookie = _.get(cookies, 'access_token', null);
  if (authorizationCookie) return authorizationCookie;

  return null;
}

function getRefreshTken({ cookies }: Request): string | null {
  const refreshToken = _.get(cookies, 'refresh_token');
  return refreshToken;
}

async function getAccountFromDB(id: string) {
  const accountService = new AccountService();
  return await accountService.findAccountById(id);
}

export async function deserializeAccount(req: Request, res: Response, next: NextFunction) {
  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshTken(req);
  if (!accessToken && !refreshToken) throw new UnauthorizedException();

  const publicKey = accessToken ? PUBLIC_KEY : refreshToken ? REFRESH_PUBLIC_KEY : null;
  if (!publicKey) throw new UnauthorizedException();

  const data: { sub: string } = verify(accessToken || refreshToken, publicKey);
  if (!data) throw new UnauthorizedException();

  // sessionAccount = getSessionFromRedis(data.sub)
  // if !sessionAccount next(UnauthorizedException)

  //   res.locals.user = sessionAccount;

  // FIXME: REPLACE THIS IMPLEMENTATION WITH PREVIOUS LOGIG
  const account = await getAccountFromDB(data.sub);
  if (!account) throw new UnauthorizedException();

  res.locals.account = account;
  next();
}
