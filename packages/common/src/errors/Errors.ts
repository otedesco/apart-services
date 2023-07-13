export const ValidationError = {
  message: 'Parameters sent are invalid',
  code: 'VALIDATION_ERROR_400',
};

export const UnauthorizedError = {
  message: 'Unauthorized',
  code: 'UNAUTHORIZED_ERROR_401',
};

export const ForbidenError = {
  message: 'You are not allowed to perform this acction',
  code: 'FORBIDEN_ERROR_403',
};

export const ResourceNotFoundError = {
  message: 'Resource Not Found',
  code: 'RESOURCE_NOT_FOUND_404',
};

export const NotNullError = {
  message: 'Columns {{columns}} of table {{table}} should not be null',
  code: 'NOT_NULL_ERROR',
};

export const EncryptionError = ValidationError;
