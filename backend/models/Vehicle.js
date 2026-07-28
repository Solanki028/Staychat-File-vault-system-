import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const vehicleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company workspace ID is required'],
    index: true
  },
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    trim: true
  },
  chassisNumber: {
    type: String,
    default: null,
    trim: true
  },
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required']
  },
  color: {
    type: String,
    default: null,
    trim: true
  },
  registrationExpiry: {
    type: Date,
    required: [true, 'Registration expiry date is required'],
    index: true
  },
  insuranceExpiry: {
    type: Date,
    required: [true, 'Insurance expiry date is required'],
    index: true
  },
  assignedDriver: {
    type: String,
    default: 'Unassigned',
    trim: true
  },
  vehicleStatus: {
    type: String,
    enum: ['Active', 'Maintenance', 'Decommissioned'],
    default: 'Active',
    index: true
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
vehicleSchema.plugin(baseSchemaPlugin);

// Unique Compound Index for Plate Number within a Company
vehicleSchema.index({ companyId: 1, plateNumber: 1 }, { unique: true });
vehicleSchema.index({ plateNumber: 'text', make: 'text', model: 'text' });

export default mongoose.model('Vehicle', vehicleSchema);
