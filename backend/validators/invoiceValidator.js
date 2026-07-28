import { body } from 'express-validator';
import { validateResult } from './authValidator.js';

export const createInvoiceValidation = [
  body('companyId').trim().notEmpty().withMessage('Company workspace ID is required'),
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601(),
  body('lineItems').isArray({ min: 1 }).withMessage('At least one line item is required'),
  body('lineItems.*.description').trim().notEmpty().withMessage('Line item description is required'),
  body('lineItems.*.quantity').isFloat({ min: 1 }).withMessage('Line item quantity must be at least 1'),
  body('lineItems.*.unitPrice').isFloat({ min: 0 }).withMessage('Line item unit price must be non-negative'),
  validateResult
];

export const updateInvoiceValidation = [
  body('lineItems').optional().isArray({ min: 1 }),
  validateResult
];
