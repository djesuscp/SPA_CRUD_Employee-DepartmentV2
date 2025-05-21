import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET todos los empleados
export const getEmployees = async (_req: Request, res: Response) => {
  const employees = await prisma.employee.findMany();
  if (employees.length === 0) {
    return res.status(404).json({ message: 'There are no employees yet.' });
  }
  res.json(employees);
};

// GET empleado por DNI
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

// POST crear nuevo empleado
export const createEmployee = async (req: Request, res: Response) => {
  const { id, fullName, login, password, departmentId } = req.body;

  if (!id || !fullName || !login || !password || !departmentId) {
    return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });
  }

  const existingEmployee = await prisma.employee.findUnique({ where: { id } });
  const existingLogin = await prisma.employee.findFirst({ where: { login } });
  if (existingEmployee || existingLogin) {
    return res.status(409).json({ message: 'Employee already exists.' });
  }

  const department = await prisma.department.findUnique({ where: { id: departmentId } });
  if (!department) {
    return res.status(404).json({ message: 'Department does not exist.' });
  }

  try {
    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardamos en la base de datos con la contraseña hasheada
    const newEmployee = await prisma.employee.create({
      data: {
        id,
        fullName,
        login,
        password: hashedPassword,
        departmentId,
      },
    });
    res.status(201).json({ message: 'Employee successfully created.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering employee.' });
  }
};

// PUT actualizar empleado
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullName, login, password, departmentId } = req.body;

  if (!fullName || !login || !password || !departmentId) {
    return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });
  }

  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Employee does not exist.' });
  }

  const department = await prisma.department.findUnique({ where: { id: departmentId } });
  if (!department) {
    return res.status(404).json({ message: 'Department does not exist.' });
  }

  await prisma.employee.update({
    where: { id },
    data: {
      fullName,
      login,
      password,
      departmentId,
    },
  });

  res.json({ message: 'Employee successfully updated.' });
};

// DELETE eliminar empleado
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    return res.status(404).json({ message: 'Employee does not exist.' });
  }

  await prisma.employee.delete({ where: { id } });
  res.json({ message: 'Employee successfully deleted.' });
};