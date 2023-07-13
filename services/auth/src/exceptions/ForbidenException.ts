import { ForbidenError, BaseException } from 'commons';

export const ForbidenException = new BaseException({ ...ForbidenError, status: 403, data: {} });
