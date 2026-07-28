import express from 'express';
import partnerController from '../controllers/PartnerController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { createPartnerValidation, updatePartnerValidation } from '../validators/partnerValidator.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/company/:companyId', (req, res, next) => partnerController.getCompanyPartners(req, res, next));
router.get('/:partnerId', (req, res, next) => partnerController.getPartnerById(req, res, next));
router.post('/', checkRole('owner', 'admin'), createPartnerValidation, (req, res, next) => partnerController.createPartner(req, res, next));
router.put('/:partnerId', checkRole('owner', 'admin'), updatePartnerValidation, (req, res, next) => partnerController.updatePartner(req, res, next));
router.delete('/:partnerId', checkRole('owner', 'admin'), (req, res, next) => partnerController.deletePartner(req, res, next));

export default router;
