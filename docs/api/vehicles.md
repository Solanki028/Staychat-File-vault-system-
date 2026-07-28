# Vehicles API Specifications

## Base Path: `/api/v1/vehicles`

All endpoints require Bearer JWT Authentication.

---

## 1. List Company Vehicles

- **Method:** `GET`
- **Path:** `/api/v1/vehicles/company/:companyId`

---

## 2. Get Vehicle Detail

- **Method:** `GET`
- **Path:** `/api/v1/vehicles/:vehicleId`

---

## 3. Create Vehicle Record

- **Method:** `POST`
- **Path:** `/api/v1/vehicles`

### Request Body
```json
{
  "companyId": "60d5ec49f1b2c52d889e4102",
  "vehicleNumber": "DXB-99812",
  "registrationNumber": "REG-V-441",
  "registrationExpiry": "2027-05-30",
  "insuranceNumber": "INS-77281",
  "insuranceExpiry": "2027-05-30",
  "vehicleType": "Sedan"
}
```

---

## 4. Update Vehicle

- **Method:** `PUT`
- **Path:** `/api/v1/vehicles/:vehicleId`

---

## 5. Soft Delete Vehicle

- **Method:** `DELETE`
- **Path:** `/api/v1/vehicles/:vehicleId`
