import { REQUESTER } from '../configs/AppConfig';

export const notify = async (
  topic: string,
  suffix: string,
  message: any,
  requester: typeof REQUESTER = REQUESTER,
  callBack?: (message: any, requester: typeof REQUESTER) => void,
) => {
  console.log('event');
};

export const notifySync = async () => {
  console.log('sync');
};
