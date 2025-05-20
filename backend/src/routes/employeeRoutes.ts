import express from 'express';
import { getEmployeeById } from '../controllers/employeeController';
import { authenticateToken } from '../middlewares/authentication';

const router = express.Router();

router.get('/:id', authenticateToken, getEmployeeById);

export default router;