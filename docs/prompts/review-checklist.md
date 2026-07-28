# Code Review Checklist

Use this checklist before opening Pull Requests or declaring feature completion.

---

## 1. Architecture & Design
- [ ] Code follows layered architecture (Component ➔ Hook ➔ Redux / Route ➔ Controller ➔ Service ➔ Repository).
- [ ] No database calls or business logic exist directly inside controllers or React components.
- [ ] Entity is properly scoped to `companyId` (workspace multi-tenancy rule).

## 2. Security & Data Protection
- [ ] All sensitive endpoints are protected by `authenticateJWT` and RBAC middleware.
- [ ] User inputs are validated on both client (Zod) and server (Express Validator).
- [ ] No hardcoded secrets, keys, or passwords.
- [ ] File uploads validate MIME type and size limit (max 25MB).

## 3. UI/UX & Quality
- [ ] Includes Skeleton Loaders / Spinners for async operations.
- [ ] Empty state UI rendered when data array is empty.
- [ ] User-friendly toast error alerts configured.
- [ ] Fully responsive on mobile, tablet, and desktop views.

## 4. Verification & Testing
- [ ] Code compiles cleanly without build errors.
- [ ] API responses tested and verified against expected schemas.
