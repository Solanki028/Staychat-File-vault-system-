# Database Indexes, Relationships & Cascading Soft Delete Rules

## Indexing Strategy Summary

MongoDB performance relies on strategic compound indexes tailored to query patterns in the Company Workspace context:

| Collection | Index Structure | Purpose |
|------------|-----------------|---------|
| `users` | `{ email: 1 }` (unique) | Authentication lookups |
| `companies` | `{ ownerId: 1 }`<br>`{ registrationNumber: 1 }` (unique)<br>`{ licenseExpiryDate: 1 }` | Workspace listing & license expiration checks |
| `documents` | `{ companyId: 1, category: 1, createdAt: -1 }`<br>`{ expiryDate: 1 }` | Paginated workspace document queries & document expiry alerts |
| `employees` | `{ companyId: 1, email: 1 }` (unique) | Unique employee email per company workspace |
| `vehicles` | `{ companyId: 1, vehicleNumber: 1 }` (unique)<br>`{ insuranceExpiry: 1 }` | Vehicle registry & insurance expiry tracking |
| `notifications` | `{ userId: 1, isRead: 1, createdAt: -1 }` | User notification drawer feed |
| `activityLogs` | `{ companyId: 1, createdAt: -1 }` | Workspace activity audit log timeline |

---

## Relationship & Foreign Key Rules

```
                      User (_id)
                          │
          ┌───────────────┴───────────────┐
          │ (ownerId)                     │ (createdBy / updatedBy)
          ▼                               ▼
   Company (_id) ◄──────────────── Base Schema Plugins
          │
          │ (companyId)
          ├───────────────────┬───────────────────┬───────────────────┐
          ▼                   ▼                   ▼                   ▼
   Documents (_id)     Employees (_id)     Partners (_id)      Vehicles (_id)
```

---

## Cascading Soft Delete Rules

When a parent entity is soft-deleted (`Company.softDelete(userId)`), business rules govern cascading soft deletion:

1. **Company Soft Delete (`isDeleted = true`):**
   - Triggers cascading soft deletion on all associated child collection records matching `companyId`:
     - `Documents.updateMany({ companyId }, { isDeleted: true, deletedBy: userId, deletedAt: new Date() })`
     - `Employees.updateMany({ companyId }, ...)`
     - `Partners.updateMany({ companyId }, ...)`
     - `Vehicles.updateMany({ companyId }, ...)`
     - `BankAccounts.updateMany({ companyId }, ...)`
     - `Invoices.updateMany({ companyId }, ...)`

2. **Single Document Soft Delete:**
   - Soft deletes only the targeted document record.
   - Company parent record remains untouched.
