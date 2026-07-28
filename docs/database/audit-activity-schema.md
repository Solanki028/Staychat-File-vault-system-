# Notifications & Audit Activity Schemas

## Overview

Tracks system notifications, user alerts, and system-wide audit logging for compliance and activity monitoring.

---

## 1. Notifications Collection (`notifications`)

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const NotificationSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['UPLOAD_SUCCESS', 'UPLOAD_FAILED', 'DOCUMENT_EXPIRING', 'LICENSE_EXPIRING', 'COMPANY_CREATED', 'SYSTEM_ALERT'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false, index: true },
  actionUrl: { type: String, default: null }
});

NotificationSchema.plugin(baseSchemaPlugin);
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
```

---

## 2. Activity / Audit Logs Collection (`activityLogs`)

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const ActivityLogSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true }, // e.g. "CREATE_COMPANY", "UPLOAD_FILE", "DELETE_EMPLOYEE"
  module: { type: String, required: true }, // e.g. "Company", "Documents", "Employees"
  description: { type: String, required: true },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
});

ActivityLogSchema.plugin(baseSchemaPlugin);
ActivityLogSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
```
