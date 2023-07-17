import _ from 'lodash';

import { sendMessage } from './providers/Kafka/Producer';

export interface CallBack<T> {
  (msg: T): void
}

export type Event = {};

interface Strategy {
  (topic: string, evt: Event): Promise<any>
}

function buildEvent<T>(topic: string, suffix: string, message: T) {
  return { 
    name: `${topic}${suffix}`,
    timestamp: Date.now(),
    payload: message,
  };
}

function validateRequiredParams(topic: string, suffix: string) {
  if (typeof topic !== 'string' || typeof suffix !== 'string') {
    throw new Error('topic and eventName arguments must be string');
  }
}

async function notify<T>(
  topic: string, suffix: string, message: T, strategy: Strategy, callBack?: CallBack<T>,
): Promise<boolean> {
  validateRequiredParams(topic, suffix);

  if (!_.isEmpty(message)) {
    await strategy(topic, buildEvent(topic, suffix, message));
    if (callBack && typeof callBack === 'function') callBack(message);

    return true;
  }

  return false;
}

export function notifySync<T>(
  topic: string, suffix: string, message: T, callBack?: CallBack<T>) {
  return notify(
    topic, suffix, message, async () => {}, callBack,
  );
}



export async function notifyAsync<T>(
  topic: string, suffix: string, message: T, callBack?: CallBack<T>) {
  const sent = await notify(topic, suffix, message, sendMessage, callBack);

  if (sent) {
    // Implement some monitoring here
  }
}

export * as Producer from './providers/Kafka/Producer';