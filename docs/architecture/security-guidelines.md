# Security Guidelines

## Core Principles

Security takes precedence over convenience across all application layers.

---

## Technical Security Standards

### 1. Authentication & Secrets
- Never commit secrets or API keys to version control.
- Enforce strict environment variables stored in `.env`.
- Use bcrypt with salt factor 12 for password hashing.
- Short-lived JWT access tokens.

### 2. Request Security & Middlewares
- **Helmet:** Secure HTTP response headers (XSS Filter, HSTS, Frameguard).
- **CORS:** Restrict allowed origins strictly to the frontend domain.
- **Express Rate Limit:** Limit API requests (e.g., 100 requests per 15 minutes per IP; stricter limits on `/auth` routes).

### 3. Data Sanitization & Input Validation
- Validate all incoming payloads with Zod (Frontend) and Express Validator (Backend).
- Prevent NoSQL injection by sanitizing query inputs.
- Prevent Cross-Site Scripting (XSS) by encoding outputs.

### 4. File Upload Protections
- Validate file extensions AND MIME signatures (magic bytes).
- Store uploaded files outside the public web root or use presigned URLs.
- Rename uploaded files to cryptographically generated UUIDs.
