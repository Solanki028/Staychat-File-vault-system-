# Partners Schema

## Collection Name: `partners`

Stores partner details and ownership percentages for a company workspace.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const PartnerSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  partnerName: { 
    type: String, 
    required: [true, 'Partner name is required'],
    trim: true 
  },
  ownershipPercentage: { 
    type: Number, 
    required: [true, 'Ownership percentage is required'],
    min: [0.01, 'Ownership must be greater than 0%'],
    max: [100, 'Ownership cannot exceed 100%']
  },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  address: { type: String, default: null },
  nationality: { type: String, default: null },
  passportNumber: { type: String, default: null }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
PartnerSchema.plugin(baseSchemaPlugin);

// Indexing
PartnerSchema.index({ companyId: 1, partnerName: 1 });

module.exports = mongoose.model('Partner', PartnerSchema);
```

---

## Validation & Business Rule Enforcement

- `ownershipPercentage` validation: Range between 0.01% and 100%.
- Aggregation Validation: Service layer verifies that `SUM(ownershipPercentage)` across all active partners of a company does not exceed 100.00%.
