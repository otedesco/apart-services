import { Cache } from 'cache';

import { SESSION_EXPIRE } from '../../../configs/AppConfig';
import { Account } from '../interfaces/Account';
import { Accounts } from '../models/AccountModel';

import AccountRepository from './AccountRepository';

const ENABLED_CACHE = true;

async function findOne(argsObject: Partial<Account>) {
  const result = await Cache.cacheSimpleResponse(
    ['email'], Accounts.tableName, SESSION_EXPIRE, ENABLED_CACHE, AccountRepository.findOne, argsObject,
  );
  
  return result;
}

export default { findOne };
