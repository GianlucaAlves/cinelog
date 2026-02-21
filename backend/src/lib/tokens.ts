import jwt from 'jsonwebtoken';
import { Response } from 'express';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
};

export const setRefreshTokenCookie = (res: Response, userId: number) => {
  const token = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });

  res.cookie('refreshToken', token, {
    httpOnly: true,    
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',  
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: '/api/auth/refresh', 
  });
};