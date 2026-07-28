import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const partnerSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company workspace ID is required'],
    index: true
  },
  partnerName: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Partner email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Partner phone is required'],
    trim: true
  },
  ownershipPercentage: {
    type: Number,
    required: [true, 'Ownership percentage is required'],
    min: [0.01, 'Ownership percentage must be at least 0.01%'],
    max: [100.0, 'Ownership percentage cannot exceed 100%']
  },
  role: {
    type: String,
    enum: ['Managing Partner', 'Silent Partner', 'Shareholder'],
    default: 'Shareholder'
  },
  partnerStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  passportNumber: {
    type: String,
    default: null,
    trim: true
  },
  passportExpiry: {
    type: Date,
    default: null
  },
  emiratesId: {
    type: String,
    default: null,
    trim: true
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
partnerSchema.plugin(baseSchemaPlugin);

// Compound Index for Partner Email within a Company
partnerSchema.index({ companyId: 1, email: 1 }, { unique: true });

export default mongoose.model('Partner', partnerSchema);
