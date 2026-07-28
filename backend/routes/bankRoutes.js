import express from 'express';
import bankController from '../controllers/BankController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { createBankValidation, updateBankValidation } from '../validators/bankValidator.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/company/:companyId', (req, res, next) => bankController.getCompanyBankAccounts(req, res, next));
router.get('/:bankId', (req, res, next) => bankController.getBankAccountById(req, res, next));
router.post('/', checkRole('owner', 'secretary', 'admin'), createBankValidation, (req, res, next) => bankController.createBankAccount(req, res, next));
router.put('/:bankId', checkRole('owner', 'secretary', 'admin'), updateBankValidation, (req, res, next) => bankController.updateBankAccount(req, res, next));
router.patch('/:bankId/primary', checkRole('owner', 'secretary', 'admin'), (req, res, next) => bankController.setPrimaryAccount(req, res, next));
router.delete('/:bankId', checkRole('owner', 'admin'), (req, res, next) => bankController.deleteBankAccount(req, res, next));

export default router;
