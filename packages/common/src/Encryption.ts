import { genSalt, hash, compare } from 'bcrypt';

import { BaseException, EncryptionError } from './errors';

function buildBaseError(code: string, message: string, data = {}): BaseException {
  return new BaseException({ status: 400, code, message, data });
}

function validateResult<T>(result: T): void {
  if (!result) {
    throw buildBaseError(EncryptionError.code, EncryptionError.message);
  }
}

async function encryptionHandler<T>(promise: Promise<T>): Promise<T> {
  const result: T = await promise;
  validateResult(result);

  return result;
}

export async function generateSalt(saltRounds: number) {
  return await encryptionHandler(genSalt(saltRounds));
}

export async function generateHash(plainTextData: string, saltRounds = 10, salt: string | null = null) {
  let generatedSalt = salt;
  if (!generatedSalt) {
    generatedSalt = await generateSalt(saltRounds);
  }
  const generatedHash = await encryptionHandler(hash(plainTextData, generatedSalt));

  return { generatedHash, generatedSalt };
}

export async function compareWithHash(plainTextData: string, hashedData: string) {
  return await encryptionHandler(compare(plainTextData, hashedData));
}
