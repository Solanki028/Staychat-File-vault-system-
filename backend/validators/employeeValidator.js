import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const createEmployeeValidation = [
  body('companyId').trim().notEmpty().withMessage('Company workspace ID is required'),
  body('fullName').trim().notEmpty().withMessage('Employee full name is required'),
  body('email').trim().notEmpty().withMessage('Employee email is required').isEmail().withMessage('Invalid email address'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  validateResult
];

export const updateEmployeeValidation = [
  body('email').optional().trim().isEmail().withMessage('Invalid email address'),
  validateResult
];
