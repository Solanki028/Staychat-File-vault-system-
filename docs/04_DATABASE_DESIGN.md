# Database Design & Schemas

**Project Name:** Company Workspace & Secure Document Management Platform  
**Database:** MongoDB Atlas  
**ODM:** Mongoose  
**Version:** 2.0 (Production-Ready Hybrid Schema Architecture)  
**Status:** Active  

---

## Purpose

This document serves as the master index for the Database Architecture and Schema Specifications. It documents the production-ready **Base Schema inheritance pattern**, **Hybrid MongoDB Design Strategy** (References vs. Embedded Subdocuments), schema models for all 10+ collections, compound indexing rules, and cascading soft-delete procedures.

---

## Database Specification Index

| # | Topic / Specification | Document Link | Key Focus |
|---|------------------------|---------------|-----------|
| 1 | **Base Schema & Audit Plugin** | [base-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/base-schema.md) | Standard fields (`_id`, `status`, `isDeleted`, `createdBy`, `updatedBy`, `deletedBy`, `createdAt`, `updatedAt`) & Mongoose query hooks. |
| 2 | **Hybrid Design Strategy** | [hybrid-design-strategy.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/hybrid-design-strategy.md) | Architectural decision matrix: Normalized `ObjectId` references vs. Embedded subdocuments. |
| 3 | **Users Collection** | [users-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/users-schema.md) | Authentication schema, roles (`owner`, `secretary`, `employee`, `admin`), unique indexes. |
| 4 | **Companies Collection** | [companies-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/companies-schema.md) | Root entity schema, embedded Address & Contact subdocuments, owner references. |
| 5 | **Documents Collection** | [documents-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/documents-schema.md) | Metadata schema, file storage pointers, mime types, compound indexing. |
| 6 | **Employees Collection** | [employees-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/employees-schema.md) | Employee records schema, designation, visa/passport expiry, unique compound index. |
| 7 | **Partners Collection** | [partners-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/partners-schema.md) | Ownership percentage validation (0.01% - 100%), company partnership records. |
| 8 | **Vehicles Collection** | [vehicles-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/vehicles-schema.md) | Registration & insurance expiry tracking, vehicle numbers, unique workspace indexes. |
| 9 | **Banking Collection** | [banking-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/banking-schema.md) | Bank details, IBAN, Swift codes, document attachment pointers. |
| 10 | **Invoices & Settings** | [invoices-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/invoices-schema.md) | Invoice settings schema, embedded Line Items subdocuments, tax/total calculations. |
| 11 | **Audit Logs & Alerts** | [audit-activity-schema.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/audit-activity-schema.md) | System notification feed, audit log schema, IP tracking, metadata. |
| 12 | **Indexes & Cascading Rules** | [indexes-relationships.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/database/indexes-relationships.md) | Foreign key rules, performance indexing table, cascading soft delete workflows. |

---

## Directory Overview

```
docs/
├── 01_PRODUCT_REQUIREMENTS_DOCUMENT.md
├── 02_FUNCTIONAL_SPECIFICATION.md
├── 03_SYSTEM_ARCHITECTURE_BLUEPRINT.md
├── 04_DATABASE_DESIGN.md                  # Master Index (This File)
└── database/
    ├── base-schema.md
    ├── hybrid-design-strategy.md
    ├── users-schema.md
    ├── companies-schema.md
    ├── documents-schema.md
    ├── employees-schema.md
    ├── partners-schema.md
    ├── vehicles-schema.md
    ├── banking-schema.md
    ├── invoices-schema.md
    ├── audit-activity-schema.md
    └── indexes-relationships.md
```