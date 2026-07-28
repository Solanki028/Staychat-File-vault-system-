# Milestone 3: Invoicing, Search & Enterprise Readiness

## Objective

Incorporate billing utilities, global system-wide debounced search, role permissions, notification alerts, and audit logging.

---

## Key Deliverables

- [ ] **Invoice System:** Invoice and Estimate generator, customizable company header/footer, PDF export engine.
- [ ] **Global Search & Filter:** Cross-entity search (Companies, Documents, Employees, Vehicles) with input debouncing.
- [ ] **Notifications Module:** System alerts for upload status, document expiration, and license warnings.
- [ ] **Role Permissions (RBAC):** Access control enforcement for Business Owner vs. Company Secretary.
- [ ] **Audit Logging:** System-wide event logging (Create/Edit/Delete actions, Logins, File operations).

---

## Success Criteria

- Invoices generate and export cleanly to PDF.
- Search queries execute across all entities within 200ms debounce window.
- Audit logs capture all workspace mutations with user and timestamp context.
