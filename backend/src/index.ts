import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import departmentRoutes from './routes/departmentRoutes';
import employeeRoutes from './routes/employeeRoutes';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', employeeRoutes);
app.use('/api', departmentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to http://localhost:${PORT}`);
});
