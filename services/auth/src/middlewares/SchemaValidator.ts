import { ValidateFunction } from 'ajv';
import { RequestHandler, Request } from 'express';

import ValidationError from '../exceptions/ValidationException';

export const validateOrThrow = (validator: ValidateFunction, toValidate: any = {}) => {
  if (!validator(toValidate)) {
    throw new ValidationError({
      errors: validator.errors,
    });
  }
};

const validate =
  (validator: ValidateFunction, builder: (req: Request) => any): RequestHandler =>
  (req, _res, next) => {
    const toValidate = builder(req);
    validateOrThrow(validator, toValidate);
    next();
  };

// FIXME: no explicit any
export const validateIncomingData: any = (validator: ValidateFunction) =>
  validate(validator, (req: Request<any>) => req.body);
