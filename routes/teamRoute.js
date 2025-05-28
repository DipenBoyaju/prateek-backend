import express from 'express';
import { createTeamMember, getTeamByDepartment } from '../controllers/teamController.js';


const router = express.Router();

router.post('/team', createTeamMember);

router.get('/team/:department', getTeamByDepartment);

export default router;
