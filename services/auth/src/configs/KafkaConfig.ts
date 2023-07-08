import { config } from 'dotenv';

import { APP_NAME } from './AppConfig';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const environment = process.env;

export const KAFKA_HOST_MICROSERVICES = environment.KAFKA_HOST_MICROSERVICES || 'localhost:9092';
export const PRODUCE_EVENTS = environment.PRODUCE_EVENTS === 'true';
export const CONSUME_EVENTS = environment.CONSUME_EVENTS === 'true';
export const KAFKA_WORKERS_MAX_BYTES_PER_PARTITION = environment.KAFKA_WORKERS_MAX_BYTES_PER_PARTITION
  ? +environment.KAFKA_WORKERS_MAX_BYTES_PER_PARTITION
  : undefined;
export const CONSUMER_TOPIC_PREFIX = 'nlss';
export const PRODUCE_TOPIC_PREFIX = `${CONSUMER_TOPIC_PREFIX}_${APP_NAME}`;
export const commitIntervalSeconds = 3;

export enum Actions {
  CREATED = 'added',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

export enum Entities {
  ACCOUNT = 'account',
}
export const CREATED_EVENTS_SUFIX = '_added';

export const Events = {
  ACCOUNT_ADDED: `${Entities.ACCOUNT}_${Actions.CREATED}`,
  ACCOUNT_UPDATED: `${Entities.ACCOUNT}_${Actions.UPDATED}`,
  ACCOUNT_DELETED: `${Entities.ACCOUNT}_${Actions.UPDATED}`,
};

export const account = {
  topicAdded: Events.ACCOUNT_ADDED,
  topicUpdated: Events.ACCOUNT_UPDATED,
  topicDeleted: Events.ACCOUNT_DELETED,
};

export const topicsByEntity = {
  [`${CONSUMER_TOPIC_PREFIX}_${Entities.ACCOUNT}`]: {
    entity: Entities.ACCOUNT,
    owner: APP_NAME,
  },
};

export const ACCOUNT_TOPIC = Entities.ACCOUNT;

export const clientConfig = { host: KAFKA_HOST_MICROSERVICES };
