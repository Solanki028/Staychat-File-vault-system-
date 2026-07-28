import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const createCompanyValidation = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('contact.email').trim().notEmpty().withMessage('Contact email is required').isEmail().withMessage('Invalid contact email'),
  body('contact.phone').trim().notEmpty().withMessage('Contact phone is required'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.country').trim().notEmpty().withMessage('Country is required'),
  validateResult
];

export const updateCompanyValidation = [
  body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('contact.email').optional().trim().isEmail().withMessage('Invalid contact email'),
  validateResult
];
