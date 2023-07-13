import * as Cache from './Cache';

export type Options = Cache.Options;

export const init = (conf: Options) => Cache.init(conf);
