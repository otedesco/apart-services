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
import { SecuredAccount } from '../../account/interfaces/Account';
import { AccountService } from '../../account/services/AccountService';
import { ProfileService } from '../../profile/services/ProfileService';
import { SignIn } from '../interfaces/SignIn';
import { SignUp } from '../interfaces/SignUp';

export class AuthenticationService {
  private accountService: AccountService;
  private profileService: ProfileService;

  constructor() {
    this.accountService = new AccountService();
    this.profileService = new ProfileService();
  }

  public async signUp(payload: SignUp) {
    const result = await Transaction.run(async tx => {
      const account = await this.accountService.create(
        _.omit(payload, ['passwordConfirmation', 'name', 'lastName']),
        tx,
      );
      const profile = await this.profileService.create(
        { ..._.pick(payload, ['name', 'lastName']), account: account.id },
        tx,
      );

      return { ...account, profile };
    });

    return result;
  }

  public async signIn(payload: SignIn): Promise<{ accessToken: string; refreshToken: string }> {
    const account = await this.accountService.verifyAccount(payload);
    const result = await this.signSession(account);

    // TODO:
    // STORE SESSION ON CACHE (REDIS)
    // STORE SESSION INFORMATION ON POSTGRESS

    return result;
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!refreshToken) throw new UnauthorizedException();

    const decoded = verify<{ sub: string }>(refreshToken, REFRESH_PUBLIC_KEY);
    if (!decoded) throw new UnauthorizedException();

    // TODO: THIS SHOULD BE FETCHED FROM REDIS
    const account = await this.accountService.findAccountById(decoded.sub);
    if (!account) throw new UnauthorizedException();
    const result = await this.signSession(account);

    return result;
  }

  private async signSession(account: SecuredAccount): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = sign({ sub: account.id }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}s` });
    const refreshToken = sign({ sub: account.id }, REFRESH_SECRET_KEY, { expiresIn: SESSION_EXPIRE });

    return { accessToken, refreshToken };
  }
}
