import { BaseModel } from 'commons';

import { ORGANIZATION_TABLE } from '../../../configs/DBConfig';
import { Profile } from '../../profile/interfaces/Profile';
import { Profiles } from '../../profile/models/ProfileModel';
import { Organization } from '../interfaces/Organization';

export class Organizations extends BaseModel implements Organization {
  id: string;

  name: string;

  collaborators?: Profile[];

  createdAt: Date;

  updatedAt: Date;

  static tableName = ORGANIZATION_TABLE;

  static get relationMappings() {
    return {
      collaborators: {
        relation: BaseModel.HasManyRelation,
        modelClass: Profiles,
        join: {
          from: `${Profiles.tableName}.id`,
          to: `${this.tableName}.collaborators`,
        },
      },
    };
  }
}
