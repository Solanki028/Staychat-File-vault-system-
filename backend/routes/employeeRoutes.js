import express from 'express';
import employeeController from '../controllers/EmployeeController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { createEmployeeValidation, updateEmployeeValidation } from '../validators/employeeValidator.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/company/:companyId', (req, res, next) => employeeController.getCompanyEmployees(req, res, next));
router.get('/company/:companyId/expiring', (req, res, next) => employeeController.getExpiringDocuments(req, res, next));
router.get('/:employeeId', (req, res, next) => employeeController.getEmployeeById(req, res, next));
router.post('/', checkRole('owner', 'secretary', 'admin'), createEmployeeValidation, (req, res, next) => employeeController.createEmployee(req, res, next));
router.put('/:employeeId', checkRole('owner', 'secretary', 'admin'), updateEmployeeValidation, (req, res, next) => employeeController.updateEmployee(req, res, next));
router.delete('/:employeeId', checkRole('owner', 'admin'), (req, res, next) => employeeController.deleteEmployee(req, res, next));

export default router;
