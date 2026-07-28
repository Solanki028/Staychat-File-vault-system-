import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const uploadDocumentValidation = [
  body('companyId').trim().notEmpty().withMessage('Company workspace ID is required'),
  body('category')
    .optional()
    .isIn(['Legal', 'Financial', 'HR', 'Corporate', 'Tax', 'General'])
    .withMessage('Invalid category'),
  validateResult
];
