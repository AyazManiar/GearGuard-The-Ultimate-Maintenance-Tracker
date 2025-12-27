import { Router } from 'express';
import departmentRoutes from './departmentRoutes';
import employeeRoutes from './employeeRoutes';
import teamRoutes from './teamRoutes';
import equipmentRoutes from './equipmentRoutes';
import requestRoutes from './requestRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/teams', teamRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/requests', requestRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GearGuard API is running'
  });
});

export default router;
