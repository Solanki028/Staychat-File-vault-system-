# Documents API Specifications

## Base Path: `/api/v1/documents`

All endpoints require Bearer JWT Authentication.

---

## 1. Upload Document

- **Method:** `POST`
- **Path:** `/api/v1/documents/upload`
- **Content-Type:** `multipart/form-data`

### Form Body
- `file`: (Binary file payload, max 25MB)
- `companyId`: ObjectId string
- `category`: `Legal` | `Financial` | `HR` | `Corporate` | `Tax` | `General`
- `description`: (Optional text description)
- `expiryDate`: (Optional ISO date string)

### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Document uploaded successfully.",
  "data": {
    "_id": "60d5ec49f1b2c52d889e4999",
    "title": "Trade_License.pdf",
    "category": "Legal",
    "size": 1048576,
    "mimeType": "application/pdf"
  }
}
```

---

## 2. Get Workspace Documents

- **Method:** `GET`
- **Path:** `/api/v1/documents/company/:companyId`
- **Query Parameters:** `?category=Legal&search=license&page=1&limit=10`

---

## 3. Get Document Detail

- **Method:** `GET`
- **Path:** `/api/v1/documents/:documentId`

---

## 4. Download Document

- **Method:** `GET`
- **Path:** `/api/v1/documents/:documentId/download`

---

## 5. Preview Document

- **Method:** `GET`
- **Path:** `/api/v1/documents/:documentId/preview`

---

## 6. Replace Document Version

- **Method:** `PUT`
- **Path:** `/api/v1/documents/:documentId`
- **Content-Type:** `multipart/form-data`

---

## 7. Soft Delete Document

- **Method:** `DELETE`
- **Path:** `/api/v1/documents/:documentId`
