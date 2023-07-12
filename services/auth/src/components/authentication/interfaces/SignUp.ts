import { Account } from '../../account/interfaces/Account';
import { Profile } from '../../profile/interfaces/Profile';

export interface SignUp extends Account, Pick<Profile, 'name' | 'lastName'> {
  passwordConfirmation: string;
}
