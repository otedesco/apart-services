import { Model, ModelObject } from 'objection';

import { ACCOUNT_TABLE } from '../../../configs/DBConfig';
import { Account } from '../interfaces/AccountInterface';

export class Accounts extends Model implements Account {
  id!: number;
  email: string;
  password: string;
  external_type?: string;
  external_id?: string;
  status: string;
  roles: string[];
  sessions: string[];

  created_at!: string;
  updated_at?: string;
  delete_at?: string;

  static tableName = ACCOUNT_TABLE; // database table name
  static idColumn = 'id'; // id column name

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

export type AccountShape = ModelObject<Accounts>;
