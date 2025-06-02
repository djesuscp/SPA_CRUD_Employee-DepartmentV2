import express from 'express';
import { registerEmployee, login, getEmployeeById, getEmployees, getEmployeeByLogin, updateEmployee, deleteEmployee } from '../controllers/employeeController';
import { authenticateToken, requireAdmin } from '../middlewares/authentication';

const router = express.Router();

// Register and login.
router.post('/employee/register', registerEmployee);
router.post('/login', login);

// Admin can see all of them, while signed employee can see only its own data.
router.get('/employee/:id', authenticateToken, getEmployeeById);

router.get('/employee/by-login/:login', authenticateToken, getEmployeeByLogin);

// Register requirement to be able to check new register user data against existing user in database.
//router.get('/employee/', getEmployees);

// CRUD only for admin.
router.get('/employee/', authenticateToken, requireAdmin, getEmployees);
router.put('/employee/:id', authenticateToken, requireAdmin, updateEmployee);
router.delete('/employee/:id', authenticateToken, requireAdmin, deleteEmployee);

export default router;