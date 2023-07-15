import { ForbidenError, CustomError } from 'commons';

export class ForbidenException extends Error implements CustomError {
  public status: number;

  public code: string;

  public message: string;

  public data: Object | null;

  constructor(properties?: { status: 401; code: string; data: Object }) {
    const { status = 403, code = ForbidenError.code, data = null } = properties ?? {};
    super(ForbidenError.code);
    this.status = status;
    this.code = code;
    this.message = ForbidenError.message;
    this.data = data;
  }
}
