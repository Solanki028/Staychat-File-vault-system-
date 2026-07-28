# Hybrid MongoDB Design Strategy

## Overview

A high-performance production MERN application requires a balanced document design. We implement a **Hybrid MongoDB Architecture**:

- **Normalized References (`ObjectId` refs):** Used for large, dynamic, or independently queried entities.
- **Embedded Subdocuments:** Used for small, tightly-bound, sub-entity objects that are always queried with the parent entity.

---

## Strategy Comparison Matrix

| Criteria | Normalized References (`ObjectId`) | Embedded Subdocuments |
|----------|-----------------------------------|-----------------------|
| **Best For** | Large, unbound data (`Documents`, `Employees`, `Vehicles`, `Invoices`) | Small, bounded data (`Address`, `Contact Details`, `Invoice Line Items`) |
| **Document Limit** | Avoids 16MB document size limit | Stored within parent 16MB document |
| **Query Flexibility** | Can filter/paginate independently (`GET /api/v1/vehicles?page=2`) | Must read parent document first |
| **Performance Impact** | Requires `.populate()` or `$lookup` joins | Fast single-document read (zero joins) |

---

## Architecture Rules & Boundary Decisions

### 1. Entities Using References (`ObjectId` + `ref`)

- **Company ➔ Documents:** Company may have thousands of files. Files are independently managed, previewed, and filtered.
- **Company ➔ Employees:** Independent directory queries, search, pagination, and role assignments.
- **Company ➔ Vehicles:** Vehicle records require independent expiry tracking and notifications.
- **Company ➔ Partners:** Ownership records require independent audit tracking.
- **Company ➔ Bank Accounts:** Banking records store attached file metadata.
- **Company ➔ Invoices:** Large collection with pagination, search, and client filtering.

### 2. Entities Using Embedded Subdocuments

- **Company ➔ Address Subdocument:** `address: { street, city, country, postalCode }` (always fetched with Company).
- **Company ➔ Contact Details Subdocument:** `contact: { email, phone, website }` (always fetched with Company).
- **Invoice ➔ Line Items Subdocument:** `lineItems: [{ description, quantity, rate, amount }]` (bounded per invoice document).
- **Invoice ➔ Issuer Settings Subdocument:** Snapshot of company tax and header info at time of invoice creation.
