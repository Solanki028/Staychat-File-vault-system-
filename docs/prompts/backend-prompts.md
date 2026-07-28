# Backend Development Prompts

## Template 1: Creating a New API Endpoint Module

```markdown
Role: Senior Node.js / Express Backend Developer
Task: Implement full CRUD endpoints for [FeatureName] under `/api/v1/companies/:companyId/[feature]`.
Requirements:
1. Model: Define Mongoose schema in `models/[FeatureName].js` with `companyId`, `ownerId`, `createdBy`, `updatedBy`, `timestamps`.
2. Repository: Create data access layer in `repositories/[FeatureName]Repository.js`.
3. Service: Put business rules and validation logic in `services/[FeatureName]Service.js`.
4. Controller: Implement thin request/response controller in `controllers/[FeatureName]Controller.js`.
5. Middleware: Apply `authenticateJWT` and RBAC permission checks in `routes/[FeatureName]Routes.js`.
```

---

## Template 2: Implementing File Upload Middleware & Storage

```markdown
Role: Backend Security Specialist
Task: Add secure file upload handling for [Module] using Multer.
Requirements:
1. Validate MIME type and file extension strictly.
2. Restrict maximum payload size to 25MB.
3. Save metadata record into MongoDB Atlas with workspace isolation.
```
