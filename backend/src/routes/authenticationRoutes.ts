import express from 'express';
import { registerEmployee, login } from '../controllers/authenticationController';

const router = express.Router();

// Registro y login sin token
router.post('/employee', registerEmployee);
router.post('/login', login);

export default router;