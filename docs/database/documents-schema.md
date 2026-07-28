# Documents Schema

## Collection Name: `documents`

Stores document file metadata, versioning information, and references to parent companies and uploading users.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const DocumentSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  category: { 
    type: String, 
    enum: ['Legal', 'Financial', 'HR', 'Corporate', 'Tax', 'General'],
    default: 'General',
    index: true 
  },
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  mimeType: { type: String, required: true },
  extension: { type: String, required: true },
  size: { type: Number, required: true }, // Size in bytes
  storagePath: { type: String, required: true },
  previewUrl: { type: String, default: null },
  expiryDate: { type: Date, default: null, index: true },
  version: { type: Number, default: 1 },
  description: { type: String, default: null }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
DocumentSchema.plugin(baseSchemaPlugin);

// Compound Index for Company Workspace Queries
DocumentSchema.index({ companyId: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('Document', DocumentSchema);
```

---

## Indexes & Constraints

- Compound Index: `{ companyId: 1, category: 1, createdAt: -1 }`.
- `expiryDate`: Index (`{ expiryDate: 1 }`).
- Text Index on `title` and `originalName`.
