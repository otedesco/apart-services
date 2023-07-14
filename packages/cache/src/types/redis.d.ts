import redis from 'redis';

declare module 'redis' {
  export interface AsyncRedisClient extends NodeJS.EventEmitter, redis.RedisClientType {
    setAsync(key: string, value: string): Promise<void>;
    getAsync(key: string): Promise<string>;
    delAsync(keys: string | string[]): Promise<void>;
    flushAllAsync(): Promise<void>;
    sAddAsync(key: string, members: string | string[], ttl?: number): Promise<void>;
    sPopAsync(key: string): Promise<string>;
    sMembersAsync(key: string): Promise<string[]>;
    scanAsync(cursor: number, options: { MATCH: string; COUNT: number }): Promise<{ cursor: number; keys: string[] }>;
  }
}
