import { Transaction } from 'objection';

import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';


//TODO: Type this function
const filterQuery = (query: any, filter: any) => {
  const { id, email } = filter;

  if (email) query.where(`${Accounts.tableName}.email`, '=', email);
  if (id) query.whereIn(`${Accounts.tableName}.id`, id);

  return query;
};

async function findOne(filter: Partial<Account>, tx?: Transaction) {
  return filterQuery(Accounts.query(tx), filter).first();
}

// DELETE THIS AND USE FIND ONE 
async function findByEmail(email: Account['email'], tx?: Transaction) {
  return Accounts.query(tx).select().where('email', '=', email).first();
}

// DELETE THIS AND USE FIND ONE 
async function findById(id: Account['id'], tx?: Transaction) {
  return Accounts.query(tx).findById(id);
}

async function create(account: Account, tx?: Transaction) {
  return Accounts.query(tx).insert(account);
}

export default { findOne, findById, findByEmail, create };
