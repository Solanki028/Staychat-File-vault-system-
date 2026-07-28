import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

// Embedded Address Subdocument Schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: [true, 'Street address is required'], trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, default: null, trim: true },
    country: { type: String, required: [true, 'Country is required'], trim: true },
    postalCode: { type: String, default: null, trim: true }
  },
  { _id: false }
);

// Embedded Contact Subdocument Schema
const contactSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, 'Company contact email is required'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Company contact phone is required'], trim: true },
    website: { type: String, default: null, trim: true }
  },
  { _id: false }
);

const companySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    default: null,
    trim: true
  },
  licenseExpiryDate: {
    type: Date,
    default: null,
    index: true
  },
  industry: {
    type: String,
    default: 'General Business',
    trim: true
  },
  companyType: {
    type: String,
    enum: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Freezone'],
    default: 'LLC'
  },
  logoUrl: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },

  // Embedded Subdocuments
  address: {
    type: addressSchema,
    required: true
  },
  contact: {
    type: contactSchema,
    required: true
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
companySchema.plugin(baseSchemaPlugin);

// Text Index for Search
companySchema.index({ companyName: 'text', registrationNumber: 'text', industry: 'text' });

export default mongoose.model('Company', companySchema);
