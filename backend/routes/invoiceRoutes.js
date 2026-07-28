import express from 'express';
import invoiceController from '../controllers/InvoiceController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { createInvoiceValidation, updateInvoiceValidation } from '../validators/invoiceValidator.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/company/:companyId', (req, res, next) => invoiceController.getCompanyInvoices(req, res, next));
router.get('/:invoiceId', (req, res, next) => invoiceController.getInvoiceById(req, res, next));
router.get('/:invoiceId/pdf', (req, res, next) => invoiceController.exportPdf(req, res, next));
router.post('/', checkRole('owner', 'secretary', 'admin'), createInvoiceValidation, (req, res, next) => invoiceController.createInvoice(req, res, next));
router.put('/:invoiceId', checkRole('owner', 'secretary', 'admin'), updateInvoiceValidation, (req, res, next) => invoiceController.updateInvoice(req, res, next));
router.patch('/:invoiceId/status', checkRole('owner', 'secretary', 'admin'), (req, res, next) => invoiceController.updateInvoiceStatus(req, res, next));
router.delete('/:invoiceId', checkRole('owner', 'admin'), (req, res, next) => invoiceController.deleteInvoice(req, res, next));

export default router;
