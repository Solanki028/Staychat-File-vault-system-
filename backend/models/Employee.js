import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const documentDetailSchema = new mongoose.Schema(
  {
    number: { type: String, default: null, trim: true },
    expiryDate: { type: Date, default: null, index: true }
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company workspace ID is required'],
    index: true
  },
  fullName: {
    type: String,
    required: [true, 'Employee full name is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Employee email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Employee phone number is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  department: {
    type: String,
    default: 'General',
    trim: true,
    index: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    default: 0
  },
  employmentStatus: {
    type: String,
    enum: ['Active', 'On Leave', 'Terminated'],
    default: 'Active',
    index: true
  },

  // Document Expiry Tracking Subdocuments
  passportDetails: {
    type: documentDetailSchema,
    default: () => ({})
  },
  visaDetails: {
    type: documentDetailSchema,
    default: () => ({})
  },
  emiratesIdDetails: {
    type: documentDetailSchema,
    default: () => ({})
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
employeeSchema.plugin(baseSchemaPlugin);

// Unique Compound Index for Employee Email within a Company
employeeSchema.index({ companyId: 1, email: 1 }, { unique: true });
employeeSchema.index({ companyId: 1, department: 1, employmentStatus: 1 });
employeeSchema.index({ fullName: 'text', email: 'text', designation: 'text' });

export default mongoose.model('Employee', employeeSchema);
