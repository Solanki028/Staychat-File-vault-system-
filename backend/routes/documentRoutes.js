import express from 'express';
import documentController from '../controllers/DocumentController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { uploadSingle } from '../middlewares/uploadMiddleware.js';
import { uploadDocumentValidation } from '../validators/documentValidator.js';

const router = express.Router();

router.use(authenticateJWT);

router.post('/upload', uploadSingle, uploadDocumentValidation, (req, res, next) => documentController.uploadDocument(req, res, next));
router.get('/company/:companyId', (req, res, next) => documentController.getCompanyDocuments(req, res, next));
router.get('/:documentId', (req, res, next) => documentController.getDocumentById(req, res, next));
router.get('/:documentId/download', (req, res, next) => documentController.downloadDocument(req, res, next));
router.put('/:documentId', uploadSingle, checkRole('owner', 'secretary', 'admin'), (req, res, next) => documentController.replaceDocument(req, res, next));
router.delete('/:documentId', checkRole('owner', 'admin'), (req, res, next) => documentController.deleteDocument(req, res, next));
router.patch('/:documentId/favorite', (req, res, next) => documentController.toggleFavorite(req, res, next));

export default router;
