import { Profile } from '../interfaces/Profile';
import { ProfileRepository } from '../repositories/ProfileRepository';
export class ProfileService {
  private ProfileRepository: ProfileRepository;

  constructor() {
    this.ProfileRepository = new ProfileRepository();
  }
  public async create(profile: Partial<Profile>): Promise<Profile> {
    const newProfile = await this.ProfileRepository.create(profile);

    return newProfile;
  }
}
