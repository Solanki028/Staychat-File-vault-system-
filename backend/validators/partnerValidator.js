import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const createPartnerValidation = [
  body('companyId').trim().notEmpty().withMessage('Company workspace ID is required'),
  body('partnerName').trim().notEmpty().withMessage('Partner name is required'),
  body('email').trim().notEmpty().withMessage('Partner email is required').isEmail().withMessage('Invalid email address'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('ownershipPercentage')
    .notEmpty().withMessage('Ownership percentage is required')
    .isFloat({ min: 0.01, max: 100.0 }).withMessage('Ownership percentage must be between 0.01% and 100.00%'),
  validateResult
];

export const updatePartnerValidation = [
  body('email').optional().trim().isEmail().withMessage('Invalid email address'),
  body('ownershipPercentage')
    .optional()
    .isFloat({ min: 0.01, max: 100.0 }).withMessage('Ownership percentage must be between 0.01% and 100.00%'),
  validateResult
];
