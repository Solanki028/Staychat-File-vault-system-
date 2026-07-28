import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const createBankValidation = [
  body('companyId').trim().notEmpty().withMessage('Company workspace ID is required'),
  body('bankName').trim().notEmpty().withMessage('Bank name is required'),
  body('accountTitle').trim().notEmpty().withMessage('Account title is required'),
  body('accountNumber').trim().notEmpty().withMessage('Account number is required'),
  body('iban').trim().notEmpty().withMessage('IBAN is required'),
  body('swiftCode').trim().notEmpty().withMessage('SWIFT code is required'),
  body('currency').optional().isIn(['AED', 'USD', 'EUR', 'GBP', 'INR']).withMessage('Invalid currency'),
  validateResult
];

export const updateBankValidation = [
  body('currency').optional().isIn(['AED', 'USD', 'EUR', 'GBP', 'INR']).withMessage('Invalid currency'),
  validateResult
];
