import { verify } from 'commons';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { LoggerFactory } from 'server-utils';

import AccountService from '../components/account/services/AccountService';
import { PUBLIC_KEY, REFRESH_PUBLIC_KEY } from '../configs/AppConfig';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

const { logger } = LoggerFactory.getInstance(__filename);
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
  return await AccountService.findAccountById(id);
}

export async function deserializeAccount(req: Request, res: Response, next: NextFunction) {
  logger.info(`Account deserialization attempt ${new Date()} `);
  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshTken(req);
  if (!accessToken && !refreshToken) {
    logger.error('No token found on request');
    return next(new UnauthorizedException());
  }

  const publicKey = accessToken ? PUBLIC_KEY : refreshToken ? REFRESH_PUBLIC_KEY : null;
  if (!publicKey) {
    logger.error('No public key found');
    return next(new UnauthorizedException());
  }

  const data: { sub: string } = verify(accessToken || refreshToken, publicKey);
  logger.info(`JWT decoded sucessfully ${data}`);
  if (!data) {
    logger.error('Not found data on JWT');
    return next(new UnauthorizedException());
  }

  // sessionAccount = getSessionFromRedis(data.sub)
  // if !sessionAccount next(UnauthorizedException)

  //   res.locals.user = sessionAccount;

  // FIXME: REPLACE THIS IMPLEMENTATION WITH PREVIOUS LOGIG
  const account = await getAccountFromDB(data.sub);
  if (!account) {
    return next(new UnauthorizedException());
  }

  logger.info(`Account deserialization successs AccountID: ${data.sub} `);

  res.locals.account = account;
  return next();
}
