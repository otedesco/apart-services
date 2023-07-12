import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ajvDefaultOptions } from '../../../configs/ValidationConfigs';
import { signUpSchema } from '../schemas/AuthenticationSchema';

const ajv = new Ajv({ ...ajvDefaultOptions, $data: true });

addFormats(ajv, ['email', 'password']);

export const signUp = ajv.compile(signUpSchema);
