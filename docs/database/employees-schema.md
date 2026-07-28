# Employees Schema

## Collection Name: `employees`

Stores employee records within a company workspace.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const EmployeeSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  fullName: { 
    type: String, 
    required: [true, 'Employee full name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true 
  },
  phone: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, default: 'General' },
  joiningDate: { type: Date, required: true },
  passportNumber: { type: String, default: null },
  passportExpiry: { type: Date, default: null },
  visaNumber: { type: String, default: null },
  visaExpiry: { type: Date, default: null },
  notes: { type: String, default: null }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
EmployeeSchema.plugin(baseSchemaPlugin);

// Compound Index: Enforce unique employee email per company workspace
EmployeeSchema.index({ companyId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
```

---

## Indexes & Constraints

- Unique Compound Index: `{ companyId: 1, email: 1 }`.
- `companyId`: Index (`{ companyId: 1 }`).
- Text Index on `fullName` and `designation`.
