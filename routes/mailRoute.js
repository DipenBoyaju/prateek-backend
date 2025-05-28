import express from 'express'
import { sendMail } from '../controllers/mailController.js';

const router = express.Router();

router.post('/send-query', sendMail)

export default router;