import { Router } from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController';

import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController';

import { authenticateToken, requireAdmin } from '../middlewares/authentication';

const router = Router();

// Middleware: autenticación + verificación de admin
router.use(authenticateToken, requireAdmin);

// CRUD de departamentos
router.get('/department', getDepartments);
router.get('/department/:id', getDepartmentById);
router.post('/department', createDepartment);
router.put('/department/:id', updateDepartment);
router.delete('/department/:id', deleteDepartment);

// CRUD de empleados
router.get('/employee', getEmployees);
router.get('/employee/:id', getEmployeeById);
router.put('/employee/:id', updateEmployee);
router.delete('/employee/:id', deleteEmployee);

export default router;
