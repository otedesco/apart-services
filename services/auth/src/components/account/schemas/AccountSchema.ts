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
  externalType: { type: 'string' },
};

export const createSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email'],
  properties,
};
