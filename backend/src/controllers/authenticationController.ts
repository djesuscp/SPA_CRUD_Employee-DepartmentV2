import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const registerEmployee = async (req: Request, res: Response) => {
  const { id, fullName, login, password, departmentId } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await prisma.employee.create({
      data: { id, fullName, login, password: hashedPassword, departmentId }
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', detail: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  try {
    if (login === 'admin') {
      const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD as string);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
      const token = jwt.sign({ login }, process.env.JWT_SECRET as string);
      return res.json({ token });
    }

    const employee = await prisma.employee.findUnique({ where: { login } });
    if (!employee) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) return res.status(401).json({ message: 'Incorrect password' });

    // En tu controlador de login
    const token = jwt.sign({ login: employee.login }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err });
  }
};