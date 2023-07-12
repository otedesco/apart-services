import _ from 'lodash';

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
    const account = await this.accountService.create(_.omit(data, ['passwordConfirmation', 'name', 'lastName']));
    const profile = await this.profileService.create({ ..._.pick(data, ['name', 'lastName']), account });

    // create a JWT and store this data on Cache
    return { ...account, profile };
  }
}
