# Mongoose Base Schema & Audit Model

## Overview

To guarantee enterprise-grade data consistency, operational auditability, and native soft-delete support across the entire MongoDB platform, every single Mongoose schema inherits from the standardized **Base Schema**.

---

## Universal Base Schema Definition

Every MongoDB collection automatically inherits the following core metadata & audit fields:

```javascript
const BaseSchemaDefinition = {
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
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
};
// Mongoose timestamps option automatically adds createdAt and updatedAt fields
```

---

## Standardized Mongoose Plugin Implementation

To eliminate boilerplate, a global Mongoose plugin (`baseSchemaPlugin.js`) is attached to every schema:

```javascript
// backend/models/plugins/baseSchemaPlugin.js
const mongoose = require('mongoose');

module.exports = function baseSchemaPlugin(schema, options) {
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
      ref: 'User' 
    },
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
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
  const excludeDeleted = function() {
    if (!this.getFilter().includeDeleted) {
      this.where({ isDeleted: false });
    }
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);

  // Method to perform soft deletion
  schema.methods.softDelete = async function(userId) {
    this.isDeleted = true;
    this.deletedBy = userId;
    this.deletedAt = new Date();
    this.status = 'archived';
    return await this.save();
  };
};
```

---

## Key Operational Benefits

1. **Consistent Audit Metadata:** Every document tracks creator, modifier, deleter, and timestamps automatically.
2. **Native Soft Delete:** Prevents catastrophic data loss; items remain recoverable for compliance.
3. **Simplified Querying:** Pre-find hooks filter deleted items without polluting service layer queries.
4. **Maintainability:** Uniform fields across all 10+ collections streamline database migrations and debugging.
