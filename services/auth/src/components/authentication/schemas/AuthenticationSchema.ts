import { ExternalAuthTypeEnum } from 'enums/ExternalAuthTypeEnum';

export const signUpSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
    externalAuthType: { type: 'string', enum: Object.values(ExternalAuthTypeEnum) },
    externalId: { type: 'string' },
    passwordConfirmation: {
      type: 'string',
      const: {
        $data: '1/password',
      },
    },
    name: { type: 'string' },
    lastname: { type: 'string' },
  },
};
