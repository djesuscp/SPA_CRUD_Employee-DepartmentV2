import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
    if (err) return res.sendStatus(403);
    req.userLogin = decoded.login;
    req.user = decoded as { login: string };
    next();
  });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userLogin !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

