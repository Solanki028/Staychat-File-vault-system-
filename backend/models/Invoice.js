import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0, min: 0 },
    amount: { type: Number, required: true }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company workspace ID is required'],
    index: true
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    trim: true
  },
  invoiceType: {
    type: String,
    enum: ['Invoice', 'Estimate'],
    default: 'Invoice',
    index: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },

  // Client Details
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    index: true
  },
  clientEmail: {
    type: String,
    default: null,
    trim: true
  },
  clientPhone: {
    type: String,
    default: null,
    trim: true
  },
  clientAddress: {
    type: String,
    default: null,
    trim: true
  },

  // Line Items & Totals
  lineItems: {
    type: [lineItemSchema],
    validate: [(val) => val.length > 0, 'At least one line item is required']
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['AED', 'USD', 'EUR', 'GBP', 'INR'],
    default: 'AED'
  },
  invoiceStatus: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft',
    index: true
  },
  notes: {
    type: String,
    default: null
  },
  terms: {
    type: String,
    default: 'Payment due within 30 days.'
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
invoiceSchema.plugin(baseSchemaPlugin);

// Unique Compound Index for Invoice Number within a Company
invoiceSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ companyId: 1, invoiceType: 1, invoiceStatus: 1 });
invoiceSchema.index({ invoiceNumber: 'text', clientName: 'text' });

export default mongoose.model('Invoice', invoiceSchema);
