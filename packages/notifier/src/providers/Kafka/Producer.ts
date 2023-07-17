import _ from 'lodash';
import { Producer, ProducerGlobalConfig } from 'node-rdkafka';
import type { LoggerFactory } from 'server-utils';


export type ProducerConfig = ProducerGlobalConfig &  {
  logger?: LoggerFactory['logger'],
  enabled: boolean,
  prefix: string
  producerPollInterval: number
};

let producer: Producer;

let producerConfig:ProducerConfig;

const getKafkaProducerConfig = (): ProducerGlobalConfig => 
  _.omit(producerConfig, ['logger', 'enabled', 'prefix', 'producerPollInterval']);

export interface Init {
  (cfg: ProducerGlobalConfig): Producer
}

const startConnection = (initFn: Init) => {
  producerConfig.logger?.debug('Kafka starting connection');
  const client = initFn(getKafkaProducerConfig());
  client.connect();

  return client;
};

const initProducer = (config: ProducerGlobalConfig) => new Producer(config);

const getConnection = () => producer;

export function start(config: ProducerConfig) {
  if (!config.enabled) return null;
  producerConfig = config;

  if (!producer) {
    producer = startConnection(initProducer);
    
    producer.on('ready', () => {
      producerConfig.logger?.debug('Kafka producer connection ready');
    });

    producer.on('connection.failure', (err) => {
      producerConfig.logger?.error(`Error on producer ${err}`);
    });

    producer.setPollInterval(producerConfig.producerPollInterval || 100);
  }

  return producer;
}


const retryProduce = (newTopic: string, bufferedMessage: Buffer) => {
  let conn;
  try {
    if (producerConfig.enabled) conn = getConnection();
    conn?.produce(newTopic, null, bufferedMessage);
  } catch (err) {
    producerConfig.logger?.error(`Error:\n${err}`);
    producerConfig.logger?.warn(`Retrying SendMessage on topic ${newTopic} for message ${bufferedMessage.toString()}`);
    conn?.poll();
    conn?.produce(newTopic, null, bufferedMessage);
  }
};

export async function sendMessage(topic: string, message: any): Promise<void> {
  const prefix = process.env.KAFKA_TOPIC_PREFIX;
  if (!prefix) throw new Error('KAFKA_TOPIC_PREFIX env variable is not set');

  const messageParsed = typeof message === 'object'
    ? JSON.stringify(message)
    : message.toString();

  const bufferedMessage = Buffer.from(messageParsed);
  const newTopic = `${prefix}_${topic}`;

  producerConfig.logger?.debug(`New message for topic: ${newTopic}, message: ${bufferedMessage}`);

  try {
    retryProduce(newTopic, bufferedMessage);
  } catch (err) {
    producerConfig.logger?.error(`Error on sendMessage: ${err}`);
  }
}