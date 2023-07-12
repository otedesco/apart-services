import { Account } from '../../account/interfaces/Account';
import { Organization } from '../../organization/interfaces/Organization';

import { ProfileType } from './ProfileType';
import { RoleType } from './RoleType';

export interface Profile {
  id?: string;
  name: string;
  lastName: string;
  avatarUrl?: string;

  role: RoleType['role'] | RoleType;
  type: ProfileType['type'] | ProfileType;

  account: Account['id'] | Account;
  organization?: Organization['id'] | Organization | null;

  createdAt?: Date;
  updatedAt?: Date;
}
