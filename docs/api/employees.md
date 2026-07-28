# Employees API Specifications

## Base Path: `/api/v1/employees`

All endpoints require Bearer JWT Authentication.

---

## 1. List Company Employees

- **Method:** `GET`
- **Path:** `/api/v1/employees/company/:companyId`
- **Query Parameters:** `?page=1&limit=10&search=john`

---

## 2. Get Employee Detail

- **Method:** `GET`
- **Path:** `/api/v1/employees/:employeeId`

---

## 3. Create Employee

- **Method:** `POST`
- **Path:** `/api/v1/employees`

### Request Body
```json
{
  "companyId": "60d5ec49f1b2c52d889e4102",
  "fullName": "John Doe",
  "email": "john.doe@company.com",
  "phone": "+971509998877",
  "designation": "Software Engineer",
  "department": "Engineering",
  "joiningDate": "2026-01-15"
}
```

---

## 4. Update Employee

- **Method:** `PUT`
- **Path:** `/api/v1/employees/:employeeId`

---

## 5. Soft Delete Employee

- **Method:** `DELETE`
- **Path:** `/api/v1/employees/:employeeId`
