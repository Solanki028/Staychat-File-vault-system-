# Staychat Vault ➔ Company Workspace SaaS Migration Checklist

**Project Name:** Company Workspace & Secure Document Management Platform  
**Target Architecture:** Multi-Tenant Company Workspace SaaS Platform  
**Status:** Phase 1 Complete (Phase 2 Ready)  
**Last Updated:** 2026-07-28  

---

## Overview

This checklist tracks the step-by-step transformation of the existing **Staychat Vault** codebase into a production-grade **Company Workspace & Secure Document Management Platform**.

Every phase must be executed strictly following the 4-Phase Workflow:
1. **Analysis**
2. **Planning & Approval**
3. **Implementation** (One logical feature at a time)
4. **Completion Report & Checklist Update**

---

## 📋 Transformation Master Checklist

### Phase 1: Core Foundation, Base Schema & Infrastructure Setup
- [x] Install missing frontend & backend dependencies (`@reduxjs/toolkit`, `react-redux`, `jsonwebtoken`, `bcryptjs`, `helmet`, `express-rate-limit`, `express-validator`, `zod`, `react-hook-form`).
- [x] Implement Mongoose `baseSchemaPlugin.js` with soft-delete query hooks (`isDeleted`, `deletedBy`, `deletedAt`, `status`) and audit fields (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`).
- [x] Set up 4-tier backend architecture directories (`repositories/`, `services/`, `controllers/`, `middlewares/`, `validators/`).
- [x] Configure Redux Toolkit store (`src/redux/store.js`) and UI layout containers (`AuthLayout`, `DashboardLayout`, `WorkspaceLayout`).
- [x] Verify clean server & client build runs.

---

### Phase 2: Authentication & Role Management Engine
- [x] Create `User` model inheriting Base Schema with bcrypt password hashing.
- [x] Implement `UserRepository`, `UserService`, `AuthController`, and `/api/v1/auth` routes (`register`, `login`, `logout`, `me`).
- [x] Build `authenticateJWT` and RBAC permission check middlewares (`checkRole`).
- [x] Build frontend `authSlice`, `api/authApi.js`, `Login.jsx`, `Register.jsx`, and `ProtectedRoute.jsx` route guard.
- [x] Verify authentication flow end-to-end.

---

### Phase 3: Company Root Entity & Dashboard
- [x] Create `Company` model with embedded `Address` & `Contact` subdocuments.
- [x] Implement `CompanyRepository`, `CompanyService`, `CompanyController`, and `/api/v1/companies` endpoints.
- [x] Build frontend `companySlice` and `api/companyApi.js`.
- [x] Implement Dashboard Summary Cards & Company Grid with "Add Company" modal.
- [x] Verify Company creation, updating, and soft deletion.

---

### Phase 4: Company Workspace Layout & Sidebar Navigation
- [x] Implement `WorkspaceLayout.jsx` with persistent sidebar navigation for active company context (`/workspace/:companyId/*`).
- [x] Build workspace header with company logo, switcher, and breadcrumb navigation.
- [x] Build workspace module sub-routes (`/overview`, `/documents`, `/employees`, `/partners`, `/vehicles`, `/banking`, `/invoices`, `/settings`).
- [x] Verify seamless workspace navigation and company state isolation.

---

### Phase 5: Documents Module Transformation
- [x] Refactor existing file storage logic into workspace-scoped `Document` model (`companyId`, `category`, `version`, `storagePath`).
- [x] Implement `DocumentRepository`, `DocumentService`, `DocumentController`, and `/api/v1/documents` endpoints.
- [x] Upgrade Multer storage engine into `uploadMiddleware.js` supporting 25MB limits & MIME validation.
- [x] Upgrade frontend `FileCard.jsx` to `DocumentCard.jsx` with workspace category badges, previews, downloads, and replacement.
- [x] Upgrade `UploadBox.jsx` to inject `companyId` context during uploads.
- [x] Verify workspace-isolated document upload, preview, download, and soft delete.

---

### Phase 6: Employee Management Module
- [x] Create `Employee` model with unique compound index `{ companyId: 1, email: 1 }`.
- [x] Implement `EmployeeRepository`, `EmployeeService`, `EmployeeController`, and `/api/v1/employees` CRUD endpoints.
- [x] Build frontend Employee directory table with search, designation filters, and Add/Edit employee modal.
- [x] Verify employee CRUD operations and workspace scoping.

---

### Phase 7: Partner Management Module
- [x] Create `Partner` model with `ownershipPercentage` validation (0.01% - 100%).
- [x] Implement `PartnerRepository`, `PartnerService` (with 100% total company ownership cap validation), `PartnerController`, and `/api/v1/partners` endpoints.
- [x] Build frontend Partner management view with total percentage allocation progress bar.
- [x] Verify partner CRUD and 100% cap validation.

---

### Phase 8: Vehicle Registry & Expiry Tracking Module
- [x] Create `Vehicle` model with indexed `registrationExpiry` and `insuranceExpiry`.
- [x] Implement `VehicleRepository`, `VehicleService`, `VehicleController`, and `/api/v1/vehicles` endpoints.
- [x] Build frontend Vehicle management table with automatic renewal expiry badges (Warning / Expired).
- [x] Verify vehicle CRUD and expiry indicators.

---

### Phase 9: Banking Module & Attachments
- [ ] Create `BankAccount` model with IBAN/Swift fields and document attachment pointers.
- [ ] Implement `BankRepository`, `BankService`, `BankController`, and `/api/v1/bank` endpoints.
- [ ] Build frontend Banking view with bank account cards and verification statement attachments.
- [ ] Verify banking record CRUD and file attachment linking.

---

### Phase 10: Invoice System & PDF Generation Module
- [ ] Create `InvoiceSettings` and `Invoice` models with embedded `LineItems` subdocuments.
- [ ] Implement `InvoiceRepository`, `InvoiceService`, `InvoiceController`, and `/api/v1/invoices` endpoints.
- [ ] Build PDF invoice export service engine (`POST /api/v1/invoices/:invoiceId/pdf`).
- [ ] Build frontend Invoice list, invoice generator form, issuer settings tab, and PDF preview/download modal.
- [ ] Verify invoice creation, calculation, and PDF export.

---

### Phase 11: System Notifications & Activity Audit Logs
- [ ] Create `Notification` and `ActivityLog` models.
- [ ] Implement `NotificationService` and `ActivityLogService` triggering on all CRUD actions.
- [ ] Build backend endpoints `/api/v1/notifications` and `/api/v1/activity/company/:companyId`.
- [ ] Build frontend notification drawer with unread counter and workspace activity timeline.
- [ ] Verify automated log entries and alert triggers.

---

### Phase 12: Debounced Global Search Engine
- [ ] Implement `SearchService` and `SearchController` (`GET /api/v1/search?keyword=...&companyId=...`).
- [ ] Build MongoDB text indexes on Companies, Documents, Employees, Vehicles, and Partners.
- [ ] Build frontend debounced global search bar in header with instant modal results.
- [ ] Verify search execution under 200ms across all workspace entities.

---

### Phase 13: Security Hardening & Performance Optimization
- [ ] Integrate Helmet HTTP security headers and CORS strict domain configuration.
- [ ] Implement Express Rate Limiter (`express-rate-limit`) on API and Auth routes.
- [ ] Apply Mongo injection sanitization and Express Validator input schemas.
- [ ] Optimize frontend bundle splitting, image lazy loading, and React memoization.
- [ ] Verify security rules and load responsiveness.

---

### Phase 14: Final QA, Verification & Deployment Readiness
- [ ] Conduct end-to-end user flow testing (Registration ➔ Company Creation ➔ Workspace Operations ➔ Invoicing ➔ Audit Logging).
- [ ] Verify full responsive layout on Mobile (320px), Tablet (768px), and Desktop (1280px+).
- [ ] Validate zero console errors, zero stack trace leaks, clean loading states, empty states, and toast alerts.
- [ ] Prepare production environment variables and deployment scripts.

---

## 🎯 Definition of Done (Per Phase)

A phase is marked complete `[x]` only when:
1. UI components are fully styled with Aurora Glass design tokens.
2. Backend code follows 4-tier layered architecture (Thin Controller ➔ Service ➔ Repository ➔ Base Schema Model).
3. All inputs pass Zod (client) and Express Validator (server) checks.
4. Loading state, empty state, and toast alert handling are included.
5. Code compiles cleanly with zero runtime/build errors.
6. Phase Completion Report is submitted and approved by the user.
