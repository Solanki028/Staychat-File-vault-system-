import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const createVehicleValidation = [
  body('companyId').trim().notEmpty().withMessage('Company workspace ID is required'),
  body('plateNumber').trim().notEmpty().withMessage('Plate number is required'),
  body('make').trim().notEmpty().withMessage('Vehicle make is required'),
  body('model').trim().notEmpty().withMessage('Vehicle model is required'),
  body('year').notEmpty().withMessage('Vehicle year is required').isInt({ min: 1900, max: 2100 }),
  body('registrationExpiry').notEmpty().withMessage('Registration expiry date is required').isISO8601(),
  body('insuranceExpiry').notEmpty().withMessage('Insurance expiry date is required').isISO8601(),
  validateResult
];

export const updateVehicleValidation = [
  body('year').optional().isInt({ min: 1900, max: 2100 }),
  body('registrationExpiry').optional().isISO8601(),
  body('insuranceExpiry').optional().isISO8601(),
  validateResult
];
