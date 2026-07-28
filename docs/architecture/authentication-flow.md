# Authentication Flow

## Overview

Authentication uses stateless **JSON Web Tokens (JWT)**. Passwords are hashed securely with **bcrypt** (salt factor 12).

---

## Authentication Sequence

```
User App (Client)               Express Server              MongoDB Atlas
    │                                │                            │
    │ ─── 1. POST /auth/login ─────► │                            │
    │     (email, password)          │ ─── 2. Query User ───────► │
    │                                │ ◄── 3. Return User Data ── │
    │                                │                            │
    │                                │ ─── 4. Compare bcrypt hash │
    │                                │                            │
    │                                │ ─── 5. Sign JWT Token      │
    │ ◄── 6. Return JWT + Profile ── │                            │
    │                                │                            │
    │ ─── 7. GET /api/v1/companies ─►│                            │
    │     Header: Bearer <Token>     │ ─── 8. Verify JWT          │
    │                                │ ─── 9. Execute Request ──► │
    │ ◄── 10. Return API Data ────── │ ◄── 11. DB Response ────── │
```

---

## Token Specifications

- **Token Type:** Bearer Token (JWT)
- **Token Location:** `Authorization` header (`Bearer <token>`)
- **Expiration:** 24 hours (Development), 1 hour (Production with refresh token fallback)
- **Payload Contents:** `{ userId, email, role, iat, exp }`

---

## Route Guards

- **Frontend:** `ProtectedRoute` component wraps private routes, redirecting unauthenticated users to `/login`.
- **Backend:** `authenticateJWT` middleware extracts token, verifies signature, attaches `req.user` payload to request.
