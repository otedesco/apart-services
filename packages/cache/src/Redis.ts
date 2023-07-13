import * as redis from 'redis';
import type { LoggerFactory } from 'server-utils';

export interface Options extends redis.RedisClientOptions {
  logger: LoggerFactory['logger'];
  CONN_DELAY_MS?: number;
  CONN_TIMEOUT_MS?: number;
}

// let logger: Options['logger'];
let conn: redis.RedisClientType;

const connect = async (config: redis.RedisClientOptions) => {
  const connectingClient = redis.createClient(config);
  connectingClient.on('connect', () => {
    conn = connectingClient as redis.RedisClientType;
  });

  await connectingClient.connect();
};

const getConnection = () => conn;

export const init = async ({ logger, CONN_DELAY_MS = 200, CONN_TIMEOUT_MS = 30 * 100, ...redisConfig }: Options) => {
  logger.debug(`Starting Redis connection: ${JSON.stringify(redisConfig)}`);
  connect(redisConfig);

  let i = 0;
  const initialTime = Date.now();
  while (!getConnection()) {
    i += 1;
    const elapsedTime = Date.now() - initialTime;

    if (elapsedTime > CONN_DELAY_MS) {
      logger.debug(`Redis connection is taking to long. So far: ${elapsedTime}`);
    }

    if (elapsedTime > CONN_TIMEOUT_MS) {
      throw new Error('Redis Connection Timeout');
    }
    const expDelay = i * CONN_DELAY_MS;

    await new Promise(resolve => setTimeout(resolve, expDelay));
  }
};
