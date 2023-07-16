import jwt, { SignOptions } from 'jsonwebtoken';

export function sign(payload: Object, secretKey: string, options?: SignOptions): string | null {
  try {
    const key = Buffer.from(secretKey, 'base64').toString('ascii');

    return jwt.sign(payload, key, { ...(options && options), algorithm: 'RS256' });
  } catch (err) {
    return null;
  }
}

export function verify<T>(token: string | null, publicKey: string): T | null {
  if (!token) return null;
  
  try {
    const key = Buffer.from(publicKey, 'base64').toString('ascii');

    return jwt.verify(token, key) as T;
  } catch (error) {
    return null;
  }
}
