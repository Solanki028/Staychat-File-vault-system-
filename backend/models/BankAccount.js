import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const bankAccountSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company workspace ID is required'],
    index: true
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
    index: true
  },
  accountTitle: {
    type: String,
    required: [true, 'Account title is required'],
    trim: true
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true
  },
  iban: {
    type: String,
    required: [true, 'IBAN is required'],
    trim: true
  },
  swiftCode: {
    type: String,
    required: [true, 'SWIFT / BIC code is required'],
    trim: true
  },
  branchName: {
    type: String,
    default: null,
    trim: true
  },
  currency: {
    type: String,
    enum: ['AED', 'USD', 'EUR', 'GBP', 'INR'],
    default: 'AED'
  },
  isPrimary: {
    type: Boolean,
    default: false,
    index: true
  },
  attachmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
bankAccountSchema.plugin(baseSchemaPlugin);

// Unique Index for Account Number within a Company
bankAccountSchema.index({ companyId: 1, accountNumber: 1 }, { unique: true });

export default mongoose.model('BankAccount', bankAccountSchema);
