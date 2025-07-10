import express from 'express'
import { deleteNewsletter, getAllNewsletters, uploadNewsletter } from '../controllers/newsletterController.js';
import { uploadPdf } from '../middleware/multerMiddleware.js'

const router = express.Router()

router.post("/newsletter/upload", uploadPdf, uploadNewsletter);
router.get("/newsletter/all", getAllNewsletters);
router.delete("/newsletter/deleteNewsletter/:id", deleteNewsletter);

export default router;