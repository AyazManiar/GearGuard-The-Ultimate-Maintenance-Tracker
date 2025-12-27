import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/teamController';

const router = Router();

router.get('/', getAllTeams);
router.post('/', createTeam);
router.get('/:id', getTeamById);
router.put('/:id', updateTeam);
router.patch('/:id', updateTeam);
router.delete('/:id', deleteTeam);

export default router;
