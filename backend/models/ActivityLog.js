import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const activityLogSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: [true, 'Action description is required'],
    trim: true
  },
  module: {
    type: String,
    enum: ['Auth', 'Company', 'Document', 'Employee', 'Partner', 'Vehicle', 'Banking', 'Invoice', 'System'],
    required: true,
    index: true
  },
  details: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
activityLogSchema.plugin(baseSchemaPlugin);

activityLogSchema.index({ companyId: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
