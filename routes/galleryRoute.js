import express from 'express'
import { deleteImage, getAllImages, uploadMultipleImages } from '../controllers/galleryController.js';
import { upload } from '../utils/cloudinaryUpload.js';


const router = express.Router()

router.post('/gallery/upload-multiple', upload.array('images', 10), uploadMultipleImages);
router.get('/gallery/all', getAllImages);
router.delete("/gallery/:id", deleteImage);

export default router;