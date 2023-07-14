import _isEmpty from 'lodash/isEmpty';
import { LoggerFactory } from 'server-utils';

import Redis, { Options as RedisOptions } from './Redis';

export type Options = RedisOptions;
let logger: LoggerFactory['logger'];

export interface Resolver<Args, Result> {
  (arg: Args): Promise<Result>;
}

const _addSetValue = async (key: string, value: string, expire = 180) => Redis.addToSet(key, value, expire);
const _shouldSave = (value: any) => value && !_isEmpty(value);

const _rememberValue = async <Args, Result>(
  setKey: string,
  key: string,
  expire: number,
  resolver: Resolver<Args, Result>,
  argsObject: Args,
) => {
  try {
    const cachedValue = await Redis.get(key);
    if (cachedValue) return JSON.parse(cachedValue);
  } catch (err) {
    logger.warn(`Unable to get value for key ${key} err: ${err}`);
  }

  const resolvedValue = await resolver(argsObject);

  if (_shouldSave(resolvedValue)) {
    try {
      await Redis.set(key, resolvedValue, expire);
      await _addSetValue(setKey, key, expire);
    } catch (err) {
      logger.warn(`Unable to set remembered value for key ${key} err: ${err}`);
    }
  }

  return resolvedValue;
};

const _forgetKeys = async (keys: string | string[]) => {
  try {
    await Redis.del(keys);
  } catch (err) {
    logger.warn(`Unable to forgetKeys for keys ${keys} err: ${err}`);
  }
};

const _forgetSetValues = async (key: string) => {
  try {
    const keys = await Redis.getSetMembers(key);

    if (keys) await _forgetKeys(keys);

    await _forgetKeys(key);
  } catch (err) {
    logger.warn(`Unable to forgetSetValues for key ${key} err: ${err}`);
  }
};

function init(conf: Options) {
  logger = conf.logger;
  return Redis.init(conf);
}

function getRedis() {
  return Redis;
}

function deleteMatching(pattern: string) {
  return Redis.deleteMatching(pattern);
}

async function remember<Args, Result>(
  idKey: string,
  key: string,
  expire = 180,
  enabled = false,
  resolver: Resolver<Args, Result>,
  argsObject: Args,
) {
  return enabled ? _rememberValue(idKey, key, expire, resolver, argsObject) : resolver(argsObject);
}

async function rememberSearch<Args, Result>(
  searchKey: string,
  key: string,
  expire = 180,
  enabled = false,
  resolver: Resolver<Args, Result>,
  argsObject: Args,
) {
  return enabled ? _rememberValue(searchKey, key, expire, resolver, argsObject) : resolver(argsObject);
}

async function forgetSearch<Args, Result>(
  searchKey: string,
  rootKey: string | string[],
  enabled = false,
  resolver: Resolver<Args, Result>,
  argsObject: Args,
) {
  if (enabled) {
    await _forgetSetValues(searchKey);
    await _forgetKeys(rootKey);
  }

  return resolver(argsObject);
}

async function forgetAll<Args, Result>(
  idKey: string,
  // searchKey: string,
  rootKey: string | string,
  enabled = false,
  resolver: Resolver<Args, Result>,
  argsObject: Args,
) {
  if (enabled) {
    await _forgetSetValues(idKey);
    // await _forgetSetValues(searchKey);
    await _forgetKeys(rootKey);
  }

  return resolver(argsObject);
}

const flush = Redis.flush;

export default { init, getRedis, flush, deleteMatching, remember, rememberSearch, forgetAll, forgetSearch };
