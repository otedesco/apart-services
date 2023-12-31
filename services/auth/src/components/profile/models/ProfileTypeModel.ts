import { BaseModel, ModelObject } from 'commons';

import { PROFILE_TYPE_TABLE } from '../../../configs/DBConfig';
import { ProfileType } from '../interfaces/ProfileType';

export class ProfileTypes extends BaseModel implements ProfileType {
  id!: number;

  type: ProfileType['type'];

  static get tableName() {
    return PROFILE_TYPE_TABLE;
  }
}

export type ProfileTypesShape = ModelObject<ProfileTypes>;
