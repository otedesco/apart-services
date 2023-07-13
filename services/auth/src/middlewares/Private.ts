import { NextFunction, Request, Response } from 'express';

import { UnauthorizedException } from '../exceptions/UnauthorizedException';

export const isPrivate = (_req: Request, res: Response, next: NextFunction) => {
  try {
    const account = res.locals.account;
    if (!account) {
      return next(new UnauthorizedException());
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
