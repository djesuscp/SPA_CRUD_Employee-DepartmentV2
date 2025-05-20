import express from 'express';
import { getDepartmentById } from '../controllers/departmentController';
import { authenticateToken } from '../middlewares/authentication';

const router = express.Router();

router.get('/:id', authenticateToken, getDepartmentById);

export default router;

