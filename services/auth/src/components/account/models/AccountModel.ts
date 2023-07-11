import { BaseModel, ModelObject } from 'commons';

import { ACCOUNT_TABLE } from '../../../configs/DBConfig';
import { Account } from '../interfaces/AccountInterface';

export class Accounts extends BaseModel implements Account {
  id!: number;
  email: string;
  password: string;
  external_type?: string;
  external_id?: string;
  status: string;
  roles: string[];
  sessions: string[];

  static tableName = ACCOUNT_TABLE;
}

export type AccountShape = ModelObject<Accounts>;
