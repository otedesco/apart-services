import { promisifyAll } from 'bluebird';
import _isEmpty from 'lodash/isEmpty';
import * as redis from 'redis';
import { LoggerFactory } from 'server-utils';

let client: redis.AsyncRedisClient;
let logger: LoggerFactory['logger'];
let CONFIG: redis.RedisClientOptions;

const _init = async (config: redis.RedisClientOptions) => {
  const connectingClient = redis.createClient(config);
  connectingClient.on('connect', () => {
    client = promisifyAll(connectingClient) as unknown as redis.AsyncRedisClient;
  });

  await connectingClient.connect();
};

const _getClient = () => client;

const checkClient = () => {
  if (!client) {
    const ERR_MSG = 'client not initialized';
    logger.error(ERR_MSG);

    throw new Error(ERR_MSG);
  }
};

const _set = async (key: string, value: any, expire = 300) => {
  checkClient();
  client.set(key, JSON.stringify(value));
  client.expire(key, expire);
};

// const _get = (key: string): Promise<string> => {
//   checkClient();
//   logger.debug(`Searching key: ${key}`);

//   return client.getAsync(key);
// };

// const _remember = async <T>(key: string, resolver: () => Promise<T>, expire = 300): Promise<T | null> => {
//   const cachedValue = await _get(key);

//   if (cachedValue) return JSON.parse(cachedValue);
//   const resolveValue = await resolver();

//   if (resolveValue) {
//     _set(key, resolveValue, expire).catch(err =>
//       logger.warn(`Unable to set remembered value for key ${key} err: ${err}`),
//     );

//     return resolveValue;
//   }

//   return null;
// };

// const _del = (key: string) => {
//   checkClient();
//   logger.debug(`Delete cache: ${key}`);

//   return client.del(key);
// };

const timeoutChecker = (strategy: Promise<any>, timeoutMillis = 100) => {
  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Redis Timeout'));
    }, timeoutMillis);
  });

  return Promise.race([strategy, timeoutPromise]);
};

export interface Options extends redis.RedisClientOptions {
  CONN_DELAY_MS?: number;
  CONN_TIMEOUT_MS?: number;
  logger: LoggerFactory['logger'];
}

export async function init({ logger, CONN_DELAY_MS = 200, CONN_TIMEOUT_MS = 30 * 100, ...redisConfig }: Options) {
  logger = logger;
  logger.debug(`Starting Redis connection: ${JSON.stringify(redisConfig)}`);
  _init(redisConfig);
  CONFIG = redisConfig;

  let i = 0;
  const initialTime = Date.now();
  while (!_getClient()) {
    i += 1;
    const elapsedTime = Date.now() - initialTime;

    if (elapsedTime > CONN_DELAY_MS) {
      logger.warn(`Redis connection is taking to long. So far: ${elapsedTime}`);
    }

    if (elapsedTime > CONN_TIMEOUT_MS) {
      throw new Error('Redis Connection Timeout');
    }
    const expDelay = i * CONN_DELAY_MS;
    await new Promise(resolve => setTimeout(resolve, expDelay));
  }
}

function getClient(): redis.AsyncRedisClient {
  let client = _getClient();

  if (!client) {
    _init(CONFIG);
    client = _getClient();
  }

  return client;
}

async function get(key: string): Promise<string> {
  const client = _getClient();

  return timeoutChecker(client.getAsync(key));
}

async function set<T>(key: string, value: T, expire = 180): Promise<void> {
  return timeoutChecker(_set(key, value, expire));
}

async function del(keys: string | string[], gotClient: redis.AsyncRedisClient | null = null) {
  if (_isEmpty(keys)) return;

  const client = gotClient ? gotClient : _getClient();

  return client.delAsync(keys);
}

async function flush() {
  const client = _getClient();

  return client.flushAllAsync();
}

async function addToSet(key: string, val: string, ttl = 180) {
  const setTTL = ttl * 1.5;

  const client = _getClient();

  return timeoutChecker(client.sAddAsync(key, val, setTTL));
}

async function createSet(key: string, values: string | string[]) {
  if (!values.length) return 0;

  const client = _getClient();

  return timeoutChecker(client.sAddAsync(key, values));
}
async function popFromSet(key: string) {
  const client = _getClient();

  return timeoutChecker(client.sPopAsync(key));
}

async function getSetMembers(key: string) {
  const client = _getClient();

  return timeoutChecker(client.sMembersAsync(key));
}

async function deleteMatching(pattern: string, cursor = 0, scanCount = 1000, deleteBatch = 100): Promise<void> {
  if (!pattern) return;

  const client = _getClient();
  let keysToDelete: string[] = [];

  const { cursor: nCursor, keys: matchingKeys } = await client.scanAsync(cursor, { MATCH: pattern, COUNT: scanCount });
  if (matchingKeys && matchingKeys.length) keysToDelete = [...keysToDelete, ...matchingKeys];

  if (keysToDelete.length > deleteBatch) {
    await del(keysToDelete, client);
    keysToDelete = [];
  }

  return +nCursor ? deleteMatching(pattern, nCursor) : del(keysToDelete, client);
}

export default {
  init,
  getClient,
  get,
  set,
  del,
  flush,
  addToSet,
  createSet,
  popFromSet,
  getSetMembers,
  deleteMatching,
};
