import express from 'express';
import { createTeamMember, deleteTeamMember, editTeamMember, getAllTeamMember, getMemberBySlug, getTeamByDepartment } from '../controllers/teamController.js';


const router = express.Router();

router.post('/team/addMember', createTeamMember);
router.put('/team/editMember/:slug', editTeamMember);
router.get('/team/member/:slug', getMemberBySlug);
router.get('/team/department/:department', getTeamByDepartment);
router.delete('/team/member/:id', deleteTeamMember);
router.get('/team/members', getAllTeamMember);


export default router;
