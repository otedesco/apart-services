import { CustomError } from '../interfaces/CustomError';

class BaseException extends Error implements CustomError {
  public code: string;
  public status: number;
  public data: {};

  constructor(properties: { message: string; status?: number; data: {}; code: string }) {
    const { message = 'Error', status = 400, code = '', data = {} } = properties;
    super(message);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export default BaseException;
