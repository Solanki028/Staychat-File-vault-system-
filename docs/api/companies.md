# Company Management API Specifications

## Base Path: `/api/v1/companies`

All endpoints require Bearer JWT Authentication.

---

## 1. List Companies

- **Method:** `GET`
- **Path:** `/api/v1/companies`
- **Query Parameters:** `?page=1&limit=10&search=acme&status=active`

### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c52d889e4102",
      "companyName": "Acme Technologies LLC",
      "registrationNumber": "REG-994821",
      "status": "active",
      "address": { "city": "Dubai", "country": "UAE" },
      "createdAt": "2026-07-28T18:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "totalItems": 1, "totalPages": 1 }
}
```

---

## 2. Get Company Detail

- **Method:** `GET`
- **Path:** `/api/v1/companies/:companyId`

### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c52d889e4102",
    "companyName": "Acme Technologies LLC",
    "registrationNumber": "REG-994821",
    "contact": { "email": "info@acme.com", "phone": "+971501234567" },
    "address": { "street": "Sheikh Zayed Rd", "city": "Dubai", "country": "UAE" }
  }
}
```

---

## 3. Create Company

- **Method:** `POST`
- **Path:** `/api/v1/companies`

### Request Body
```json
{
  "companyName": "Acme Technologies LLC",
  "registrationNumber": "REG-994821",
  "contact": { "email": "info@acme.com", "phone": "+971501234567" },
  "address": { "street": "Sheikh Zayed Rd", "city": "Dubai", "country": "UAE" }
}
```

### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Company created successfully.",
  "data": { "_id": "60d5ec49f1b2c52d889e4102" }
}
```

---

## 4. Update Company

- **Method:** `PUT`
- **Path:** `/api/v1/companies/:companyId`

---

## 5. Soft Delete Company

- **Method:** `DELETE`
- **Path:** `/api/v1/companies/:companyId`

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Company and associated workspace records soft-deleted successfully."
}
```
