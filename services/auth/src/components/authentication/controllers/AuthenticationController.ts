import { CookieOptions, Request, Response } from 'express';
import _ from 'lodash';

import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../configs/AppConfig';
import { createResponse } from '../../../handlers/ResponseHandler';
import { SignIn } from '../interfaces/SignIn';
import { SignUp } from '../interfaces/SignUp';
import { AuthenticationService } from '../services/AuthenticationService';

export class AuthenticationController {
  private authenticationService: AuthenticationService;
  constructor() {
    this.authenticationService = new AuthenticationService();
  }

  public signUp = async (req: Request, res: Response): Promise<void> => {
    const accountData: SignUp = req.body;
    const { status, data } = await createResponse(this.authenticationService.signUp(accountData));

    res.status(status).json(data);
  };

  public signIn = async (req: Request, res: Response): Promise<void> => {
    const payload: SignIn = req.body;

    const { status, data } = await createResponse(this.authenticationService.signIn(payload));

    res.cookie('access_token', data.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions);
    res.cookie('refresh_token', data.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS as CookieOptions);
    res.cookie('logged_in', true, { ...ACCESS_TOKEN_COOKIE_OPTIONS, httpOnly: false } as CookieOptions);

    res.status(status).json(data);
  };

  public signOut = async (req: Request, res: Response) => {
    console.log();
  };

  public refreshAuthorization = async ({ cookies }: Request, res: Response) => {
    const refreshToken = _.get(cookies, 'refresh_token', null);
    const { status, data } = await createResponse(this.authenticationService.refreshToken(refreshToken));

    res.cookie('access_token', data.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions);
    res.cookie('logged_in', true, { ...ACCESS_TOKEN_COOKIE_OPTIONS, httpOnly: false } as CookieOptions);

    res.status(status).json(data);
  };
}
