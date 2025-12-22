import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenPayload } from '../types';

export const generateAccessToken = (payload: ITokenPayload): string => {
  const ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET || 'access-token-secret') as string;
  const ACCESS_TOKEN_EXPIRY = (process.env.ACCESS_TOKEN_EXPIRY || '15m') as string;
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'] };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

export const generateRefreshToken = (payload: ITokenPayload): string => {
  const REFRESH_TOKEN_SECRET = (process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret') as string;
  const REFRESH_TOKEN_EXPIRY = (process.env.REFRESH_TOKEN_EXPIRY || '7d') as string;
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'] };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  const ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET || 'access-token-secret') as string;
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as ITokenPayload;
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  const REFRESH_TOKEN_SECRET = (process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret') as string;
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as ITokenPayload;
};

export const getRefreshTokenFromHeader = (headers) => {
  const authHeader = headers['authorization'];
  const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!refreshToken) {
    console.error("user didn't add refresh token to the request");

    return null;
  }

  return refreshToken;
};

