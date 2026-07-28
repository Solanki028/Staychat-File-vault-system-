# Notifications & Activity Log API Specifications

## Base Path: `/api/v1/notifications`

All endpoints require Bearer JWT Authentication.

---

## 1. Get User Notifications

- **Method:** `GET`
- **Path:** `/api/v1/notifications`
- **Query Parameters:** `?isRead=false&page=1&limit=20`

### Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5ec49f1b2c52d889e4777",
      "type": "DOCUMENT_EXPIRING",
      "title": "Document Expiring Soon",
      "message": "Trade License expires in 7 days.",
      "isRead": false,
      "createdAt": "2026-07-28T18:00:00.000Z"
    }
  ]
}
```

---

## 2. Mark Notification as Read

- **Method:** `PATCH`
- **Path:** `/api/v1/notifications/:id/read`

---

## 3. Mark All Notifications as Read

- **Method:** `PATCH`
- **Path:** `/api/v1/notifications/read-all`

---

## 4. Delete Notification

- **Method:** `DELETE`
- **Path:** `/api/v1/notifications/:id`

---

## 5. Get Company Activity Audit Logs

- **Method:** `GET`
- **Path:** `/api/v1/activity/company/:companyId`
- **Query Parameters:** `?page=1&limit=20`
