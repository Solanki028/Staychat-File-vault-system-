# API Specification Document

**Project:** Company Workspace & Secure Document Management Platform  
**Version:** 1.0  
**Architecture:** RESTful Web API  
**Protocol:** HTTPS / JSON  
**Authentication:** JWT Bearer Token  
**Status:** Active  

---

## Purpose

This document serves as the master index for the platform's RESTful API Specifications. It defines endpoints, HTTP methods, authorization standards, request/response formats, status codes, query filtering, and file upload parameters.

---

## Specification Modules Index

| # | Endpoint Module | Specification Link | Base Path | Key Functionality |
|---|-----------------|-------------------|-----------|-------------------|
| 1 | **Common & Standards** | [common.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/common.md) | `/api/v1` | Base URLs, status codes, error schemas, pagination, upload rules |
| 2 | **Authentication** | [authentication.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/authentication.md) | `/api/v1/auth` | User registration, login, logout, get profile (`/me`) |
| 3 | **Companies** | [companies.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/companies.md) | `/api/v1/companies` | List, create, update, soft-delete, company detail queries |
| 4 | **Dashboard** | [dashboard.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/dashboard.md) | `/api/v1/dashboard` | Summary statistics, expiring alert indicators, activity feeds |
| 5 | **Documents** | [documents.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/documents.md) | `/api/v1/documents` | Upload (25MB max), previews, downloads, version replacement |
| 6 | **Employees** | [employees.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/employees.md) | `/api/v1/employees` | Employee CRUD, designations, visa/passport expiry parameters |
| 7 | **Partners** | [partners.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/partners.md) | `/api/v1/partners` | Partner directory, ownership percentage validation |
| 8 | **Vehicles** | [vehicles.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/vehicles.md) | `/api/v1/vehicles` | Vehicle registration, insurance status, renewal tracking |
| 9 | **Banking** | [banking.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/banking.md) | `/api/v1/bank` | Bank details, IBAN/Swift records, statement file attachments |
| 10 | **Invoices** | [invoices.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/invoices.md) | `/api/v1/invoices` | Invoices & Estimates CRUD, PDF generation export |
| 11 | **Notifications** | [notifications.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/notifications.md) | `/api/v1/notifications` | User alert drawer, read flags, company audit activity feed |
| 12 | **Global Search** | [search.md](file:///c:/Users/Priyanshu/Downloads/Project%20folders/Staychat%20ai/docs/api/search.md) | `/api/v1/search` | Unified debounced global search across workspace modules |

---

## Directory Overview

```
docs/
├── 01_PRODUCT_REQUIREMENTS_DOCUMENT.md
├── 02_FUNCTIONAL_SPECIFICATION.md
├── 03_SYSTEM_ARCHITECTURE_BLUEPRINT.md
├── 04_DATABASE_DESIGN.md
├── 05_API_SPECIFICATION.md                # Master Index (This File)
└── api/
    ├── common.md
    ├── authentication.md
    ├── companies.md
    ├── dashboard.md
    ├── documents.md
    ├── employees.md
    ├── partners.md
    ├── vehicles.md
    ├── banking.md
    ├── invoices.md
    ├── notifications.md
    └── search.md
```