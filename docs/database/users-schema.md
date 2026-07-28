# Users Schema

## Collection Name: `users`

Stores system users and authentication credentials.

---

## Schema Definition

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false // Do not include in queries by default
  },
  role: { 
    type: String, 
    enum: ['owner', 'secretary', 'employee', 'admin'],
    default: 'owner' 
  },
  phone: { 
    type: String, 
    default: null 
  },
  avatarUrl: { 
    type: String, 
    default: null 
  },
  lastLoginAt: { 
    type: Date, 
    default: null 
  }
});

// Inherit status, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt
UserSchema.plugin(baseSchemaPlugin);

module.exports = mongoose.model('User', UserSchema);
```

---

## Indexes & Constraints

- `email`: Unique Index (`{ email: 1 }`, `unique: true`).
- `role`: Secondary Index (`{ role: 1 }`).
- Inherited Base Schema Indexes (`{ status: 1 }`, `{ isDeleted: 1 }`).
