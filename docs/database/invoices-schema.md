# Invoices & Invoice Settings Schemas

## Overview

Invoicing leverages a **Hybrid MongoDB Architecture**:
- `invoiceSettings`: Collection storing default company template configuration.
- `invoices`: Main invoice collection using **Embedded Line Items Subdocuments** and an **Embedded Snapshot** of issuer details at time of issue.

---

## 1. Invoice Settings Collection (`invoiceSettings`)

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

const InvoiceSettingsSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
  issuerName: { type: String, required: true },
  issuerEmail: { type: String, required: true },
  issuerPhone: { type: String, required: true },
  taxNumber: { type: String, default: null },
  address: { type: String, required: true },
  logoUrl: { type: String, default: null },
  footerNote: { type: String, default: 'Thank you for your business!' },
  invoicePrefix: { type: String, default: 'INV-' },
  nextInvoiceNumber: { type: Number, default: 1001 }
});

InvoiceSettingsSchema.plugin(baseSchemaPlugin);
module.exports = mongoose.model('InvoiceSettings', InvoiceSettingsSchema);
```

---

## 2. Invoices Collection (`invoices`)

```javascript
const mongoose = require('mongoose');
const baseSchemaPlugin = require('./plugins/baseSchemaPlugin');

// Embedded Line Item Subdocument Schema
const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  invoiceNumber: { type: String, required: true },
  type: { type: String, enum: ['Invoice', 'Estimate'], default: 'Invoice' },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientAddress: { type: String, default: null },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  
  // Embedded Subdocuments
  lineItems: [LineItemSchema],
  
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  notes: { type: String, default: null },
  pdfUrl: { type: String, default: null }
});

InvoiceSchema.plugin(baseSchemaPlugin);
InvoiceSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
```
