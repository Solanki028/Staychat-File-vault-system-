import mongoose from 'mongoose';

/**
 * Universal Base Schema Plugin for Mongoose Schemas.
 * Automatically adds audit fields, soft-delete capability, and query filtering.
 */
export default function baseSchemaPlugin(schema) {
  schema.add({
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'suspended'],
      default: 'active',
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    deletedAt: {
      type: Date,
      default: null
    }
  });

  schema.set('timestamps', true);

  // Pre-query Hook: Exclude soft-deleted records by default
  const excludeDeleted = function () {
    if (!this.getFilter().includeDeleted) {
      this.where({ isDeleted: false });
    }
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);

  // Instance method for Soft Delete
  schema.methods.softDelete = async function (userId) {
    this.isDeleted = true;
    this.deletedBy = userId || null;
    this.deletedAt = new Date();
    this.status = 'archived';
    return await this.save();
  };
}
