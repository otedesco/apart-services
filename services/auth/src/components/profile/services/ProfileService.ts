import { ProfileTypeEnum } from '../../../enums/ProfileTypesEnum';
import { RoleTypeEnum } from '../../../enums/RoleTypeEnum';
import { Profile } from '../interfaces/Profile';
import { ProfileRepository } from '../repositories/ProfileRepository';
export class ProfileService {
  private ProfileRepository: ProfileRepository;

  constructor() {
    this.ProfileRepository = new ProfileRepository();
  }
  public async create(profile: Partial<Profile>, tx = null): Promise<Profile> {
    return await this.ProfileRepository.create(this.mapProfile(profile), tx);
  }

  private mapProfile({ account, name, lastName, avatarUrl, role, type }: Partial<Profile>): Profile {
    return {
      account,
      name: name ?? '',
      lastName,
      role: role ?? RoleTypeEnum.OWNER,
      type: type ?? ProfileTypeEnum.INDIVIDUAL,
      avatarUrl,
    };
  }
}
