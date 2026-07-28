import express from 'express';
import notificationController from '../controllers/NotificationController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', (req, res, next) => notificationController.getUserNotifications(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));
router.patch('/read-all', (req, res, next) => notificationController.markAllAsRead(req, res, next));

export default router;
