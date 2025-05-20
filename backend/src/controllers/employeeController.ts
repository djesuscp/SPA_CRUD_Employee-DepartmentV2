import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (req.userLogin !== 'admin') {
      const employee = await prisma.employee.findUnique({ where: { login: req.userLogin } });
      if (!employee || employee.id !== id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving employee', detail: err });
  }
};