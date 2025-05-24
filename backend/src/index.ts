import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authenticationRoutes from './routes/authenticationRoutes';
import departmentRoutes from './routes/departmentRoutes';
import employeeRoutes from './routes/employeeRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/department', departmentRoutes);
// app.use('/api/employee', employeeRoutes);

app.use('/api', authenticationRoutes); // /api/login y /api/empleado (registro)
app.use('/api/employee', employeeRoutes); // /api/empleado/:id
app.use('/api/department', departmentRoutes); // /api/departamento/:id
app.use('/api/admin', adminRoutes); // solo admin

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to http://localhost:${PORT}`);
});
