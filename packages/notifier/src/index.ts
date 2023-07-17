import _ from 'lodash';

import { sendMessage } from './providers/Kafka/Producer';

export type Requester = {};

export interface CallBack<T> {
  (msg: T, req: Requester): void
}

export type Event = {};

interface Strategy {
  (topic: string, evt: Event): Promise<any>
}

function buildEvent<T>(topic: string, suffix: string, message: T, requester: Requester) {
  return { 
    name: `${topic}${suffix}`,
    timestamp: Date.now(),
    payload: message,
    requester, 
  };
}

function validateRequiredParams(topic: string, suffix: string) {
  if (typeof topic !== 'string' || typeof suffix !== 'string') {
    throw new Error('topic and eventName arguments must be string');
  }
}

async function notify<T>(
  topic: string, suffix: string, message: T, requester: Requester, strategy: Strategy, callBack?: CallBack<T>,
): Promise<boolean> {
  validateRequiredParams(topic, suffix);

  if (!_.isEmpty(message)) {
    await strategy(topic, buildEvent(topic, suffix, message, requester));
    if (callBack && typeof callBack === 'function') callBack(message, requester);

    return true;
  }

  return false;
}

export function notifySync<T>(
  topic: string, suffix: string, message: T, requester: Requester, callBack?: CallBack<T>) {
  return notify(
    topic, suffix, message, requester, async () => {}, callBack,
  );
}



export async function notifyAsync<T>(
  topic: string, suffix: string, message: T, requester: Requester, callBack?: CallBack<T>) {
  const sent = await notify(topic, suffix, message, requester,  sendMessage, callBack);

  if (sent) {
    // Implement some monitoring here
  }
}

export * as Producer from './providers/Kafka/Producer';