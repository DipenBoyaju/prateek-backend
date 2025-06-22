import express from 'express'
import { addEvent, deleteEventById, getAllEvents, getEventBySlug, updateEventById } from '../controllers/eventController.js';


const router = express.Router();

router.post("/events/addEvent", addEvent)
router.get("/events/getAllEvents", getAllEvents)
router.get('/events/getEventBySlug/:slug', getEventBySlug);
router.put('/events/updateEvent/:id', updateEventById);
router.delete('/events/delete/:id', deleteEventById);

export default router;