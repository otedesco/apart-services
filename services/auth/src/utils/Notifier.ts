import { REQUESTER } from '../configs/AppConfig';

export const notify = async (
  topic: string,
  suffix: string,
  message: any,
  requester: typeof REQUESTER = REQUESTER,
  callBack?: (message: any, requester: typeof REQUESTER) => void,
) => {
  console.log(topic, suffix, message, requester, typeof callBack);
};

export const notifySync = async () => {
  console.log('sync');
};
