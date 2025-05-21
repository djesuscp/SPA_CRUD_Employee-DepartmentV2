import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDepartments = async (req: Request, res: Response): Promise<Response> => {
  const departments = await prisma.department.findMany();
  if (departments.length === 0) {
    return res.status(404).json({ message: 'There are no departments yet.' });
  }
  else {
    return res.json(departments);
  }
};

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

export const createDepartment = async (req: Request, res: Response): Promise<Response> => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });
  }

  const exists = await prisma.department.findFirst({ where: { name } });
  if (exists) {
    return res.status(400).json({ message: 'Department already exists.' });
  }

  const newDepartment = await prisma.department.create({
    data: { name, phone, email },
  });

  return res.status(201).json({ message: 'Department successfully created.', data: newDepartment });
};

export const updateDepartment = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id);
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });
  }

  const department = await prisma.department.findUnique({ where: { id } });
  if (!department) {
    return res.status(404).json({ message: 'Department does not exist.' });
  }

  const updated = await prisma.department.update({
    where: { id },
    data: { name, phone, email },
  });

  return res.json({ message: 'Department successfully updated.', data: updated });
};

export const deleteDepartment = async (req: Request, res: Response): Promise<Response> => {
  const id = parseInt(req.params.id);

  const department = await prisma.department.findUnique({ where: { id } });
  if (!department) {
    return res.status(404).json({ message: 'Department does not exist.' });
  }

  await prisma.department.delete({ where: { id } });

  return res.json({ message: 'Department successfully deleted.' });
};