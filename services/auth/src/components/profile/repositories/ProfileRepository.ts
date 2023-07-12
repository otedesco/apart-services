import { Transaction } from 'objection';

import { Profile } from '../interfaces/Profile';
import { Profiles } from '../models/ProfileModel';

export class ProfileRepository {
  public async findByEmail(email: string, tx: Transaction = null): Promise<Profile> {
    return await Profiles.query(tx).select().where('email', '=', email).first();
  }

  public async create(profile: Partial<Profile>, tx: Transaction = null): Promise<Profile> {
    return await Profiles.query(tx).insert(profile);
  }
}
