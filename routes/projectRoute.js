import express from 'express'
import { addProject, deleteProject, editProject, getAllProject, getProjectBySlug } from '../controllers/projectController.js'


const router = express.Router()

router.route('/project/addProject').post(addProject);
router.route('/project/getAllProjects').get(getAllProject)
router.route('/project/getProjectBySlug/:slug').get(getProjectBySlug);
router.route('/project/updateProject/:id').put(editProject);
router.route('/project/deleteProject/:id').delete(deleteProject);
export default router;