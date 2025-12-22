import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../types';
import { verifyAccessToken } from '../utils/authUtils';

const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = verifyAccessToken(token);

    req.user = { _id: decoded._id };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

export default authMiddleware;


