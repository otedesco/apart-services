import jwt, { SignOptions } from 'jsonwebtoken';

export function sign(payload: Object, secretKey: string, options?: SignOptions) {
  const key = Buffer.from(secretKey, 'base64').toString('ascii');

  return jwt.sign(payload, key, { ...(options && options), algorithm: 'RS256' });
}

export function verify<T>(token: string, publicKey: string): T {
  const key = Buffer.from(publicKey, 'base64').toString('ascii');

  return jwt.verify(token, key) as T;
}
