# Authorization & Role-Based Access Control (RBAC)

## Overview

Authorization ensures that authenticated users can only perform actions permitted by their role and workspace scope.

---

## Authorization Chain

Every protected endpoint evaluates the following chain before executing business logic:

```
[ Incoming Request ]
         │
         ▼
 1. Authentication Middleware (Valid JWT?)
         │
         ▼
 2. Role Verification (Has required role?)
         │
         ▼
 3. Ownership / Workspace Check (User owns or is assigned to target companyId?)
         │
         ▼
 4. Execute Action
```

---

## Role Matrix

| Action | Business Owner | Company Secretary | Employee |
|--------|----------------|-------------------|----------|
| **Create Company** | ✅ | ❌ | ❌ |
| **Edit Company Details** | ✅ | ✅ | ❌ |
| **Delete Company** | ✅ | ❌ | ❌ |
| **Upload Document** | ✅ | ✅ | ❌ |
| **Delete Document** | ✅ | ❌ | ❌ |
| **View Workspace** | ✅ | ✅ | ✅ |
| **Manage Employees** | ✅ | ✅ | ❌ |
| **Manage Invoices** | ✅ | ✅ | ❌ |

---

## Multi-Tenant Workspace Security Rule

- All queries MUST explicitly scope by `companyId`:
  `Document.find({ companyId: req.params.companyId, ownerId: req.user.id })`
- Cross-company data leaks are prevented at the database repository query level.
