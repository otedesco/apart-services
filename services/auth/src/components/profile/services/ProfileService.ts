import { Transaction } from 'objection';

import { ProfileTypeEnum } from '../../../enums/ProfileTypesEnum';
import { RoleTypeEnum } from '../../../enums/RoleTypeEnum';
import { Profile } from '../interfaces/Profile';
import ProfileRepository from '../repositories/ProfileRepository';

function mapProfile({ account, name, lastName, avatarUrl, role, type }: Partial<Profile>): Profile {
  return {
    account,
    name: name ?? '',
    lastName,
    role: role ?? RoleTypeEnum.OWNER,
    type: type ?? ProfileTypeEnum.INDIVIDUAL,
    avatarUrl,
  };
}

async function create(profile: Partial<Profile>, tx?: Transaction): Promise<Profile> {
  return ProfileRepository.create(mapProfile(profile), tx);
}

export default { create };
