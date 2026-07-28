import express from 'express';
import dashboardController from '../controllers/DashboardController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/stats', (req, res, next) => dashboardController.getStats(req, res, next));
router.get('/recent', (req, res, next) => dashboardController.getRecent(req, res, next));

export default router;
