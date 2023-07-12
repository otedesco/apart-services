import _ from 'lodash';

import { Transaction } from '../../../utils/Transaction';
import { AccountService } from '../../account/services/AccountService';
import { ProfileService } from '../../profile/services/ProfileService';
import { SignUp } from '../interfaces/SignUp';

export class AuthenticationService {
  private accountService: AccountService;
  private profileService: ProfileService;

  constructor() {
    this.accountService = new AccountService();
    this.profileService = new ProfileService();
  }

  public async signUp(data: SignUp) {
    const result = await Transaction.run(async tx => {
      const account = await this.accountService.create(_.omit(data, ['passwordConfirmation', 'name', 'lastName']), tx);
      const profile = await this.profileService.create(
        { ..._.pick(data, ['name', 'lastName']), account: account.id },
        tx,
      );

      return { ...account, profile };
    });

    // create a JWT and store this data on Cache
    return result;
  }
}
