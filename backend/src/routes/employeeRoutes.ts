import express from 'express';
import { registerEmployee, login, getEmployeeById, getEmployees, updateEmployee, deleteEmployee } from '../controllers/employeeController';
import { authenticateToken, requireAdmin } from '../middlewares/authentication';

const router = express.Router();

// Registro y login sin token
router.post('/employee/register', registerEmployee);
router.post('/login', login);

// Solo empleado logueado.
router.get('/employee/:id', authenticateToken, getEmployeeById);

// CRUD de empleados solo admin.
router.get('/employee/', authenticateToken, requireAdmin, getEmployees);
router.get('/employee/:id', authenticateToken, requireAdmin, getEmployeeById);
router.put('/employee/:id', authenticateToken, requireAdmin, updateEmployee);
router.delete('/employee/:id', authenticateToken, requireAdmin, deleteEmployee);

export default router;