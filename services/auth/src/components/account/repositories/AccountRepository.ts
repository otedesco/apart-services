import { Transaction } from 'objection';

import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';

async function findByEmail(email: Account['email'], tx: Transaction = null) {
  return await Accounts.query(tx).select().where('email', '=', email).first();
}

async function findById(id: Account['id'], tx: Transaction = null) {
  return await Accounts.query(tx).findById(id);
}

async function create(account: Account, tx: Transaction = null) {
  return await Accounts.query(tx).insert(account);
}

export default { findById, findByEmail, create };
