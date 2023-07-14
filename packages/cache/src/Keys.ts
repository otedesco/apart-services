import _ from 'lodash';

const PREFIX = process.env.CACHE_PREFIX || '';
const KEY_SEPARATOR = ':';

export interface ArgsMapper<T extends Object> {
  (args: T): T;
}

const normalizeValue = (value: any) => {
  const stringValue = JSON.stringify(value);

  const newValue = stringValue.replace(/\s+/, '-').toLowerCase();

  return newValue;
};

const getModifiedObject = <T extends {}>(object: T, argsMapper?: ArgsMapper<T>): T => {
  let modified = object;
  if (argsMapper) modified = argsMapper(object);

  return modified;
};

export const buildKey = <T extends Object>(prefix: string, object: T, argsMapper?: ArgsMapper<T>): string => {
  const modified = getModifiedObject(object, argsMapper);
  if (_.isEmpty(modified)) return buildRootKey(prefix);

  const generatedKey = _.chain(Object.entries(modified))
    .reduce(
      (array: string[], [key, value]) =>
        value !== undefined ? [...array, `${key}${KEY_SEPARATOR}${normalizeValue(value)}`] : array,
      [],
    )
    .sort()
    .reduce((array: string[], key: string) => (key.match(/id:/) ? [key, ...array] : [...array, key]), [])
    .flatten()
    .join(KEY_SEPARATOR)
    .value();

  return `${PREFIX}${KEY_SEPARATOR}${prefix}${KEY_SEPARATOR}${generatedKey}`;
};

export const buildIdKey = <T extends {}>(
  prefix: string,
  idColumns: string | string[],
  object: T,
  argsMapper?: ArgsMapper<T>,
): string => {
  const idObject = _.pick(getModifiedObject(object, argsMapper), idColumns);

  if (Object.keys(idObject).length !== idColumns.length) throw new Error(`Must have all id columns ${idColumns}`);

  return buildKey(`${prefix}${KEY_SEPARATOR}idkey`, idObject);
};

export const buildRootKey = (prefix: string) => `${PREFIX}${KEY_SEPARATOR}${prefix}${KEY_SEPARATOR}rootkey`;

export const buildPattern = (customPattern: string) => `${PREFIX}${KEY_SEPARATOR}${customPattern || '*'}`;
