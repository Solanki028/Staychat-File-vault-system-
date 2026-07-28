import express from 'express';
import auditLogController from '../controllers/AuditLogController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/company/:companyId', (req, res, next) => auditLogController.getCompanyLogs(req, res, next));

export default router;
