import express from 'express';
import companyController from '../controllers/CompanyController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { createCompanyValidation, updateCompanyValidation } from '../validators/companyValidator.js';

const router = express.Router();

// Apply JWT authentication to all company endpoints
router.use(authenticateJWT);

router.get('/', (req, res, next) => companyController.getCompanies(req, res, next));
router.get('/:companyId', (req, res, next) => companyController.getCompanyById(req, res, next));
router.post('/', checkRole('owner', 'admin'), createCompanyValidation, (req, res, next) => companyController.createCompany(req, res, next));
router.put('/:companyId', checkRole('owner', 'secretary', 'admin'), updateCompanyValidation, (req, res, next) => companyController.updateCompany(req, res, next));
router.delete('/:companyId', checkRole('owner', 'admin'), (req, res, next) => companyController.deleteCompany(req, res, next));

export default router;
