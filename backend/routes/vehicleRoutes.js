import express from 'express';
import vehicleController from '../controllers/VehicleController.js';
import { authenticateJWT, checkRole } from '../middlewares/authMiddleware.js';
import { createVehicleValidation, updateVehicleValidation } from '../validators/vehicleValidator.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/company/:companyId', (req, res, next) => vehicleController.getCompanyVehicles(req, res, next));
router.get('/company/:companyId/expiring', (req, res, next) => vehicleController.getExpiringVehicles(req, res, next));
router.get('/:vehicleId', (req, res, next) => vehicleController.getVehicleById(req, res, next));
router.post('/', checkRole('owner', 'secretary', 'admin'), createVehicleValidation, (req, res, next) => vehicleController.createVehicle(req, res, next));
router.put('/:vehicleId', checkRole('owner', 'secretary', 'admin'), updateVehicleValidation, (req, res, next) => vehicleController.updateVehicle(req, res, next));
router.delete('/:vehicleId', checkRole('owner', 'admin'), (req, res, next) => vehicleController.deleteVehicle(req, res, next));

export default router;
