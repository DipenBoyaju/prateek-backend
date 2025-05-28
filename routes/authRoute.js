import express from 'express'
import { AdminSignup, login, logout } from '../controllers/authController.js';
import { loginSchema, signupSchema } from '../validators/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post("/signup-admin", AdminSignup);
router.post("/login", login);
router.post("/logout", logout);

export default router;