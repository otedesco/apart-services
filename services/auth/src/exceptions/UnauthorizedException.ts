import { UnauthorizedError, BaseException } from 'commons';

export const UnauthorizedException = new BaseException({ ...UnauthorizedError, status: 401, data: {} });
