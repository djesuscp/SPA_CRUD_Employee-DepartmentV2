import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const findEmployeeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
            const employee = await prisma.employee.findUnique({ where: { id } });
            if (!employee) return res.status(404).json({ message: 'Employee not found.' });
            res.json(employee);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving employee', detail: error });
    }
}