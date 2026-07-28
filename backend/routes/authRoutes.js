import express from 'express';
import authController from '../controllers/AuthController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { loginValidation, registerValidation } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidation, (req, res, next) => authController.register(req, res, next));
router.post('/login', loginValidation, (req, res, next) => authController.login(req, res, next));
router.post('/logout', authenticateJWT, (req, res) => authController.logout(req, res));
router.get('/me', authenticateJWT, (req, res, next) => authController.me(req, res, next));

export default router;
