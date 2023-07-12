import { Profile } from '../interfaces/Profile';
import { Profiles } from '../models/ProfileModel';

export class ProfileRepository {
  public async findByEmail(email: string, trx = null): Promise<Profile> {
    return await Profiles.query(trx).select().where('email', '=', email).first();
  }

  public async create(profile: Partial<Profile>, trx = null): Promise<Profile> {
    return await Profiles.query(trx).insert(profile);
  }
}
