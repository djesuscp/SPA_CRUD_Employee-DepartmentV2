import express from 'express';
import { getDepartmentById, getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController';
import { authenticateToken, requireAdmin } from '../middlewares/authentication';

const router = express.Router();

// Empleados logueados.
router.get('/department/:id', authenticateToken, getDepartmentById);

// Register requirement to be able to fill select option during new registration.
router.get('/department/', getDepartments);

// CRUD de departamentos solo admin.
router.get('/department/', authenticateToken, requireAdmin, getDepartments);
router.get('/department/:id', authenticateToken, requireAdmin, getDepartmentById);
router.post('/department/', authenticateToken, requireAdmin, createDepartment);
router.put('/department/:id', authenticateToken, requireAdmin, updateDepartment);
router.delete('/department/:id', authenticateToken, requireAdmin, deleteDepartment);

export default router;

