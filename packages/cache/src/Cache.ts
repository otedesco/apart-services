import * as Redis from './Redis';

export type Options = Redis.Options;

export const init = (conf: Redis.Options) => Redis.init(conf);
