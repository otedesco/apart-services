import { ExternalAuthTypeEnum } from '../../../enums/ExternalAuthTypeEnum';

const properties = {
  email: { type: 'string', format: 'email' },
  password: { type: 'string', minLength: 8 },
  password_confirmation: {
    type: 'string',
    const: {
      $data: '1/password',
    },
  },
  externalId: { type: 'string' },
  externalType: { enum: ExternalAuthTypeEnum },
};

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties,
};
