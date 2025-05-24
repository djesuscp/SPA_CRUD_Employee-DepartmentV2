import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Check admin. DONE
const checkAdmin = (login: string | undefined) => {
  if (login === 'admin') return true;
  else return false;
}

// GET all employees. DONE
export const getEmployees = async (_req: Request, res: Response) => {
  const employees = await prisma.employee.findMany();
  if (employees.length === 0) return res.status(404).json({ message: 'There are no employees yet.' });
  else res.json(employees);
};

// GET employee by ID. DONE
export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!checkAdmin(req.userLogin)) {
      const employee = await prisma.employee.findUnique({ where: { login: req.userLogin } });
      if (!employee || employee.id !== id) return res.status(403).json({ message: 'Access denied' });
    }
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving employee', detail: err });
  }
};

// UPDATE employee. DONE
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fullName, login, password, departmentId } = req.body;

  if (!fullName || !login || !password || !departmentId) return res.status(400).json({ message: 'Some data is missing in the request body. Check it again, please.' });

  if (checkAdmin(login)) return res.status(409).json({ message: 'User already exists.' });

  try {
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Employee does not exist.' });
    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) return res.status(404).json({ message: 'Department does not exist.' });
    const updateData: any = {
      fullName,
      login,
      departmentId,
    };

    // Password encrypt during update.
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });
     res.json({ message: 'Employee successfully updated.' });
    // These 2 lines return the employee without the password.
    //const { password: _, ...employeeWithoutPassword } = updatedEmployee;
    //res.json(employeeWithoutPassword);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
};

// DELETE employee. DONE
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({ where: { id }, select: { login: true}, });
    if (!employee) return res.status(404).json({ message: 'Employee does not exist.' });
    if (checkAdmin(employee.login)) return res.status(403).json({ message: 'Cannot delete the admin user.' });
    await prisma.employee.delete({ where: { id } });
    res.json({ message: 'Employee successfully deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error. Something went wrong trying to delete an employee.' });
  }
};

// REGISTER or CREATE employee. DONE
export const registerEmployee = async (req: Request, res: Response) => {
  const { id, fullName, login, password, departmentId } = req.body;
  if (!id || !fullName || !login || !password || !departmentId) return res.status(400).json({ message: 'Missing fields in request body' });
  if (checkAdmin(login)) return res.status(409).json({ message: 'User already exists.' });

  // Verify existing login.
  const exists = await prisma.employee.findUnique({ where: { login } });
  if (exists) return res.status(400).json({ message: 'Employee with this login already exists' });
  try {
    // Encrypt password.
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await prisma.employee.create({ data: { id, fullName, login, password: hashedPassword, departmentId }});
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', detail: error });
  }
};

// LOGIN employee.
export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  try {
    if (checkAdmin(login)) {
      const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD as string);
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
      const token = jwt.sign({ login }, process.env.JWT_SECRET as string);
      return res.json({ token });
    }
    const employee = await prisma.employee.findUnique({ where: { login } });
    if (!employee) return res.status(404).json({ message: 'User not found' });
    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) return res.status(401).json({ message: 'Incorrect password' });

    // Generate token.
    const token = jwt.sign({ login: employee.login }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err });
  }
};