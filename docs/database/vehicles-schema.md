# Vehicles Schema

## Collection Name: `vehicles`

Stores vehicle registration records and insurance expiry tracking for a company workspace.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const VehicleSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  vehicleNumber: { 
    type: String, 
    required: [true, 'Vehicle number is required'],
    trim: true 
  },
  registrationNumber: { type: String, required: true },
  registrationExpiry: { type: Date, required: true, index: true },
  insuranceNumber: { type: String, required: true },
  insuranceExpiry: { type: Date, required: true, index: true },
  insuranceProvider: { type: String, default: null },
  vehicleType: { type: String, enum: ['Sedan', 'SUV', 'Van', 'Truck', 'Other'], default: 'Sedan' },
  manufacturer: { type: String, default: null },
  model: { type: String, default: null },
  year: { type: Number, default: null }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
VehicleSchema.plugin(baseSchemaPlugin);

// Compound Unique Index: Vehicle number per company
VehicleSchema.index({ companyId: 1, vehicleNumber: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
```

---

## Indexes & Expiry Tracking

- `insuranceExpiry`: Indexed for automated expiration notifications.
- `registrationExpiry`: Indexed for registration alerts.
- Unique Compound Index: `{ companyId: 1, vehicleNumber: 1 }`.
