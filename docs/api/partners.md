# Partners API Specifications

## Base Path: `/api/v1/partners`

All endpoints require Bearer JWT Authentication.

---

## 1. List Company Partners

- **Method:** `GET`
- **Path:** `/api/v1/partners/company/:companyId`

---

## 2. Get Partner Detail

- **Method:** `GET`
- **Path:** `/api/v1/partners/:partnerId`

---

## 3. Create Partner Record

- **Method:** `POST`
- **Path:** `/api/v1/partners`

### Request Body
```json
{
  "companyId": "60d5ec49f1b2c52d889e4102",
  "partnerName": "Sarah Connor",
  "ownershipPercentage": 49.5,
  "email": "sarah@acme.com",
  "phone": "+971501112233"
}
```

---

## 4. Update Partner

- **Method:** `PUT`
- **Path:** `/api/v1/partners/:partnerId`

---

## 5. Soft Delete Partner

- **Method:** `DELETE`
- **Path:** `/api/v1/partners/:partnerId`
