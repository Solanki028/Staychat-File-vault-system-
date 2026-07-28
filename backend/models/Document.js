import mongoose from 'mongoose';
import baseSchemaPlugin from './plugins/baseSchemaPlugin.js';

const documentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company workspace ID is required'],
    index: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Legal', 'Financial', 'HR', 'Corporate', 'Tax', 'General'],
    default: 'General',
    index: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  storageName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  storagePath: {
    type: String,
    required: true
  },
  previewUrl: {
    type: String,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null,
    index: true
  },
  version: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    default: null
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
documentSchema.plugin(baseSchemaPlugin);

// Compound Index for Workspace Queries
documentSchema.index({ companyId: 1, category: 1, createdAt: -1 });
documentSchema.index({ title: 'text', originalName: 'text' });

export default mongoose.model('Document', documentSchema);
