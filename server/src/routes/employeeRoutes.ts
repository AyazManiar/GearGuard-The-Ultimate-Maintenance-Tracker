import { Router } from 'express';
import { getAllEmployees, getEmployeeById } from '../controllers/employeeController';

const router = Router();

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);

export default router;
