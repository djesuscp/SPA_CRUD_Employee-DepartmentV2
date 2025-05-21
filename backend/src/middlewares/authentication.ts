import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware que verifica si el token es válido
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401).json({ message: 'No token provided' });

  jwt.verify(token, SECRET, (err, decoded: any) => {
    if (err) return res.sendStatus(403);
    req.userLogin = decoded.login;
    req.user = decoded as { login: string };
    next();
  });
};

// Middleware que permite el acceso solo al admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.userLogin !== 'admin') {
    return res.status(403).json({ message: 'Access restricted to admin only' });
  }
  next();
};

