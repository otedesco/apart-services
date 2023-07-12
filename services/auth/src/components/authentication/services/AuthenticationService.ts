import { sign } from 'commons';
import _ from 'lodash';

import { SECRET_KEY, TOKEN_EXPIRE } from '../../../configs/AppConfig';
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

    // create a JWT and store this data on Cache
    return result;
  }

  public async signIn(payload: SignIn): Promise<{ accessToken: string; refreshToken: string }> {
    const account = await this.accountService.verifyAccount(payload);
    const result = await this.signSession(account);

    return result;
  }

  private async signSession(account: SecuredAccount): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = sign({ sub: account.id }, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}m` });
    // TODO:
    // REDIS IMPLEMENTATION
    // STORE SESSION INFORMATION ON POSTGRESS

    return { accessToken, refreshToken: 'string' };
  }
}
