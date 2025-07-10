import express from 'express'
import { AdminSignup, changePassword, login, logout } from '../controllers/authController.js';
import { loginSchema, signupSchema } from '../validators/auth.js';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/signup-admin", AdminSignup);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/changePassword", authenticateToken, changePassword)

export default router;