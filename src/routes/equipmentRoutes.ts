import { Router } from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController';

const router = Router();

router.get('/', getAllEquipment);
router.post('/', createEquipment);
router.get('/:id', getEquipmentById);
router.put('/:id', updateEquipment);
router.patch('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
