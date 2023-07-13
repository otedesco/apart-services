import { BaseException, NotNullError } from 'commons';
import { NotNullViolationError } from 'objection-db-errors';
import { LoggerFactory } from 'server-utils';

const { logger } = LoggerFactory.getInstance(__filename);

export function DatabaseErrorHandler(err: Error) {
  if (err instanceof NotNullViolationError) {
    logger.error(err);
    return new BaseException({
      ...NotNullError,
      data: {
        column: err.column,
        table: err.table,
      },
    });
  }

  return {};
}
