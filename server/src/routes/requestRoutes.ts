import { Router } from 'express';
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateRequestStatus,
  deleteRequest
} from '../controllers/requestController';

const router = Router();

router.get('/', getAllRequests);
router.post('/', createRequest);
router.get('/:id', getRequestById);
router.put('/:id', updateRequest);
router.patch('/:id', updateRequest);
router.patch('/:id/status', updateRequestStatus);
router.delete('/:id', deleteRequest);

export default router;
