# Backend Architecture

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ODM:** Mongoose (MongoDB)
- **Authentication:** JSON Web Token (JWT), bcrypt
- **File Uploads:** Multer
- **Security:** Helmet, CORS, Express Validator
- **Logging:** Morgan / Winston

---

## Directory Layout (`backend/`)

```
backend/
├── config/       # Environment variables & DB connection settings
├── controllers/  # Request handlers (Thin Controllers)
├── logs/         # Server application logs
├── middlewares/  # Express middlewares (Auth, Validation, Error Handling)
├── models/       # Mongoose schemas & data models
├── repositories/ # Database query abstraction layer
├── routes/       # API route handlers
├── services/     # Core business logic processing
├── uploads/      # Temporary/Local file storage
├── utils/        # Utility helpers (JWT generators, formatters)
└── validators/   # Express Validator schema rules
```

---

## Layered Architecture Pattern

The backend strictly adheres to a 4-tier layered architecture:

```
[ HTTP Request ]
       │
       ▼
 [ Route / Middleware ] ➔ Input Validation & Auth Checks
       │
       ▼
  [ Controller ]        ➔ HTTP Request/Response Handling (Thin)
       │
       ▼
   [ Service ]          ➔ Business Logic & Rules Processing
       │
       ▼
  [ Repository ]       ➔ Data Access & Mongoose Query Layer
       │
       ▼
   [ MongoDB ]          ➔ Database Storage
```

### Architectural Constraints
- **Controllers remain thin:** No inline queries or heavy logic.
- **Services handle rules:** Business logic, transformations, calculations.
- **Repositories control queries:** Mongoose queries encapsulated in repository methods.

---

## Error Handling Pipeline

Global Express Error Handler catches all sync/async errors and formats standardized responses:

```json
{
  "status": "fail | error",
  "message": "Human readable error summary",
  "error": {
    "code": "INVALID_INPUT",
    "details": []
  }
}
```

- Never expose internal server stack traces in production responses.
- Catches Validation, Auth, Authorization, DB, File Upload, and standard JS exceptions.

---

## Logging Strategy

- **API Logs:** HTTP status, endpoint, latency, response size.
- **Auth Logs:** Login attempts, token issuance, failed auth checks.
- **File Logs:** Uploads, file replacements, deletions.
- **Audit Logs:** System actions per company workspace.
