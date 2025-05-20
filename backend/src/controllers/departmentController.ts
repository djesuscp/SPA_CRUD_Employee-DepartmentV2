import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const departmentId = parseInt(req.params.id);
    const userLogin = req.user?.login;

    if (!userLogin) {
      return res.status(401).json({ message: 'Unauthorized: login missing from token' });
    }

    if (userLogin === 'admin') {
      // Admin: puede ver todos los departamentos y sus empleados
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: { employees: true },
      });

      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }

      return res.json(department);
    }

    // Empleado: buscamos su propio registro
    const employee = await prisma.employee.findUnique({
      where: { login: userLogin },
      select: { departmentId: true }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Si el empleado intenta ver otro departamento, se le deniega
    if (employee.departmentId !== departmentId) {
      return res.status(403).json({ message: 'Forbidden: not allowed to access this department' });
    }

    // Solo su propio departamento, sin empleados
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    return res.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};