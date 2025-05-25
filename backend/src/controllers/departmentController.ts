import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Check admin. DONE.
const checkAdmin = (login: string | undefined) => {
  if (login === 'admin') return true;
  else return false;
}

// GET ALL departments. DONE.
export const getDepartments = async (req: Request, res: Response) => {
  const departments = await prisma.department.findMany();
  if (departments.length === 0) return res.status(404).json({ message: 'There are no departments yet.' });
  else return res.json(departments);
};

// GET department by Id. DONE.
export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const departmentId = parseInt(req.params.id);
    const userLogin = req.user?.login;
    if (!userLogin) return res.status(401).json({ message: 'Unauthorized: login missing from token' });
    if (checkAdmin(userLogin)) {

      // Admin is able to see all departmments with their employees.
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: { employees: true },
      });

      // Check if department exists.
      if (!department) return res.status(404).json({ message: 'Department not found' });
      return res.json(department);
    }

    // Employee can only see the department it belongs to.
    const employee = await prisma.employee.findUnique({
      where: { login: userLogin },
      select: { departmentId: true }
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Employee cannot see other departments.
    if (employee.departmentId !== departmentId) return res.status(403).json({ message: 'Forbidden: not allowed to access this department' });

    // Employee can only see its department, without being able to see other employees.
    const department = await prisma.department.findUnique({ where: { id: departmentId }, select: { id: true, name: true, phone: true, email: true }});
    if (!department) return res.status(404).json({ message: 'Department not found' });
    return res.json(department);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// CREATE department. DONE.
export const createDepartment = async (req: Request, res: Response) => {
  const { name, phone, email } = req.body;
  
  // Check department provided data.
  if (!name || !phone || !email) return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });

  try {
    const existingDepartment = await prisma.department.findFirst({
      where: {
        OR: [
          { name },
          { phone },
          { email }
        ]
      }
    });
    if (existingDepartment) return res.status(400).json({ message: 'A department with the same name, phone, or email already exists.' });
    const newDepartment = await prisma.department.create({ data: { name, phone, email }});
    return res.status(201).json({ message: 'Department successfully created.', data: newDepartment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// UPDATE department. DONE.
export const updateDepartment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, phone, email } = req.body;

  // Check department provided data.
  if (!name || !phone || !email) return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });

  try {

    // Check if department exists.
    const existingDepartment = await prisma.department.findUnique({ where: { id: parseInt(id) }});
    if (!existingDepartment) return res.status(404).json({ message: 'Department not found.' });

    // Verify if another department uses any of the provided data.
    const conflictDepartment = await prisma.department.findFirst({
      where: {
        AND: [
          {
            // Exclude current department.
            id: { not: parseInt(id) }
          },
          {
            OR: [
              { name },
              { phone },
              { email }
            ]
          }
        ]
      }
    });
    if (conflictDepartment) return res.status(400).json({ message: 'Another department already uses that name, phone, or email.' });

    // Update department.
    const updated = await prisma.department.update({ where: { id: parseInt(id) }, data: { name, phone, email }});
    return res.json({ message: 'Department successfully updated.', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE department. DONE.
export const deleteDepartment = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const department = await prisma.department.findUnique({ where: { id } });

  // Check if department exists.
  if (!department) return res.status(404).json({ message: 'Department does not exist.' });
  await prisma.department.delete({ where: { id } });
  return res.json({ message: 'Department successfully deleted.' });
};