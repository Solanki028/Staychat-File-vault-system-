# Common API Specifications & Architecture

## Overview

All platform endpoints adhere to RESTful architecture over HTTPS using JSON payload formats and JWT Bearer token authentication.

---

## Base URLs

- **Development:** `http://localhost:5000/api/v1`
- **Production:** `https://api.yourdomain.com/api/v1`

---

## Standard Response Schemas

### Success Response (`200 OK`, `201 Created`)

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Error Response (`400`, `401`, `403`, `404`, `422`, `500`)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "Email must be unique" }
  ]
}
```

---

## Standard HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Deletion succeeded
- `400 Bad Request` - Invalid payload formatting
- `401 Unauthorized` - Missing or expired JWT token
- `403 Forbidden` - Insufficient role permissions
- `404 Not Found` - Requested resource does not exist
- `409 Conflict` - Duplicate unique field constraint
- `422 Validation Error` - Business logic validation failed
- `500 Internal Server Error` - Server exception

---

## Standard Query Parameters

- **Pagination:** `?page=1&limit=10`
- **Sorting:** `?sort=createdAt&order=desc` (`asc` | `desc`)
- **Search:** `?search=keyword`
- **Filtering:** `?status=active&category=Legal`

---

## File Upload Constraints

- **Max Size:** 25 MB per upload
- **Allowed MIME Types:** PDF, PNG, JPG, JPEG, WEBP, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP
- **Rejected Formats:** Executable binaries, scripts, unknown MIME types
