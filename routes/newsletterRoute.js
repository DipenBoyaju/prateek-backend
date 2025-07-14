import express from 'express'
import { deleteNewsletter, getAllNewsletters, publishStatus, uploadNewsletter } from '../controllers/newsletterController.js';
import { uploadPdf } from '../middleware/multerMiddleware.js'

const router = express.Router()

router.post("/newsletter/upload", uploadPdf, uploadNewsletter);
router.get("/newsletter/all", getAllNewsletters);
router.delete("/newsletter/deleteNewsletter/:id", deleteNewsletter);
router.patch('/newsletter/publishStatus/:id', publishStatus);

export default router;