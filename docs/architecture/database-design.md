# Database Design & Schemas

## Database Platform

- **Engine:** MongoDB Atlas
- **ODM:** Mongoose

---

## Architectural Principles

1. **Base Schema Inheritance:** Every collection schema inherits standardized audit and soft-delete metadata:
   `status`, `isDeleted`, `createdBy`, `updatedBy`, `deletedBy`, `deletedAt`, `createdAt`, `updatedAt`.
2. **Hybrid MongoDB Architecture:**
   - **Normalized References (`ObjectId` refs):** Used for large, dynamic entities (`Company` ➔ `Documents`, `Employees`, `Partners`, `Vehicles`, `Invoices`, `Bank Accounts`).
   - **Embedded Subdocuments:** Used for small, bounded, tightly-bound data (`Address`, `Contact Details`, `Invoice Line Items`).
3. **Company Workspace Scope:** All non-user queries are scoped by `companyId` with compound indexes.

---

## Specification Links

For detailed Mongoose schema definitions, field validations, and index configurations, refer to the modular database documentation suite:

- 📋 [Base Schema & Audit Plugin](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/base-schema.md)
- ⚖️ [Hybrid Design Strategy](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/hybrid-design-strategy.md)
- 👤 [Users Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/users-schema.md)
- 🏢 [Companies Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/companies-schema.md)
- 📁 [Documents Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/documents-schema.md)
- 👥 [Employees Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/employees-schema.md)
- 🤝 [Partners Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/partners-schema.md)
- 🚗 [Vehicles Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/vehicles-schema.md)
- 🏦 [Banking Schema](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/banking-schema.md)
- 🧾 [Invoices & Settings Schemas](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/invoices-schema.md)
- 🔔 [Notifications & Audit Activity Schemas](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/audit-activity-schema.md)
- ⚡ [Indexes, Relationships & Cascading Rules](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/indexes-relationships.md)
