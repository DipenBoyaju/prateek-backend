import express from 'express'
import { addSubProject, deleteSubProject, editSubProject, getAllSubProject, getProjectByDivision, getProjectsByMainId, getSubProjectBySlug } from '../controllers/subProjectController.js';


const router = express.Router()

router.route('/subProject/addProject').post(addSubProject);
router.route('/subProject/getAllProjects').get(getAllSubProject)
router.route('/subProject/getProjectsByMainId').get(getProjectsByMainId)
router.route('/subProject/getProjectBySlug/:slug').get(getSubProjectBySlug);
router.route('/subProject/updateProject/:id').put(editSubProject);
router.route('/subProject/deleteProject/:id').delete(deleteSubProject);
router.route('/subProject/getProjectByDivision').get(getProjectByDivision)

export default router;