# Companies Schema

## Collection Name: `companies`

Root entity for all company workspace data. Uses **Embedded Subdocuments** for Address and Contact details, and **References** for workspace modules.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

// Embedded Address Subdocument Schema
const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: null },
  country: { type: String, required: true },
  postalCode: { type: String, default: null }
}, { _id: false });

// Embedded Contact Subdocument Schema
const ContactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String, default: null }
}, { _id: false });

const CompanySchema = new mongoose.Schema({
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
    default: null 
  },
  licenseExpiryDate: {
    type: Date,
    default: null,
    index: true
  },
  industry: { type: String, default: null },
  companyType: { type: String, default: 'LLC' },
  logoUrl: { type: String, default: null },
  description: { type: String, default: null },
  
  // Embedded Subdocuments
  address: { type: AddressSchema, required: true },
  contact: { type: ContactSchema, required: true }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
CompanySchema.plugin(baseSchemaPlugin);

module.exports = mongoose.model('Company', CompanySchema);
```

---

## Indexes & Constraints

- `registrationNumber`: Unique Index (`{ registrationNumber: 1 }`).
- `ownerId`: Index (`{ ownerId: 1 }`).
- `companyName`: Text Index (`{ companyName: "text" }`).
- `licenseExpiryDate`: Index (`{ licenseExpiryDate: 1 }`).
