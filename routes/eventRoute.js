import express from 'express'
import { addEvent } from '../controllers/eventController.js';


const router = express.Router();

router.post("/events", addEvent)

export default router;