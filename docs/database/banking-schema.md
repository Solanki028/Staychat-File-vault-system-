# Banking Schema

## Collection Name: `bankAccounts`

Stores company bank account details and optional verification attachments.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const BankAccountSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  bankName: { type: String, required: true, trim: true },
  branch: { type: String, required: true },
  accountHolder: { type: String, required: true },
  accountNumber: { type: String, required: true },
  iban: { type: String, required: true, trim: true },
  swiftCode: { type: String, required: true, trim: true },
  currency: { type: String, default: 'USD' },
  isPrimary: { type: Boolean, default: false },
  attachmentUrl: { type: String, default: null }, // Refers to document storage file
  attachmentDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', default: null }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
BankAccountSchema.plugin(baseSchemaPlugin);

module.exports = mongoose.model('BankAccount', BankAccountSchema);
```

---

## Indexes & Constraints

- `companyId`: Index (`{ companyId: 1 }`).
- `iban`: Index (`{ iban: 1 }`).
