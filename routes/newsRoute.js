import express from 'express'
import { createNews, deleteNews, editNews, getAllNews, getNewsBySlug } from '../controllers/newsController.js'


const router = express.Router()


router.route('/news/getAllNews').get(getAllNews);
router.route('/news/createNews').post(createNews);
router.route('/news/getNewsBySlug/:slug').get(getNewsBySlug);
router.route('/news/updateNews/:id').put(editNews);
router.route('/news/deleteNews/:id').delete(deleteNews);

export default router;