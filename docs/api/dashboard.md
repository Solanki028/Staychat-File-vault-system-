# Dashboard API Specifications

## Base Path: `/api/v1/dashboard`

All endpoints require Bearer JWT Authentication.

---

## 1. Get Dashboard Summary Statistics

- **Method:** `GET`
- **Path:** `/api/v1/dashboard/stats`

### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "totalCompanies": 12,
    "totalDocuments": 148,
    "totalEmployees": 45,
    "expiringLicenses": 3,
    "expiringDocuments": 7,
    "recentUploadsCount": 15
  }
}
```

---

## 2. Get Recent Activities & Uploads Feed

- **Method:** `GET`
- **Path:** `/api/v1/dashboard/recent`
- **Query Parameters:** `?limit=10`

### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "id": "log_991283",
      "action": "UPLOAD_FILE",
      "module": "Documents",
      "description": "Uploaded Trade_License.pdf",
      "createdAt": "2026-07-28T18:10:00.000Z"
    }
  ]
}
```
