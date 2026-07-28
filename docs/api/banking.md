# Banking API Specifications

## Base Path: `/api/v1/bank`

All endpoints require Bearer JWT Authentication.

---

## 1. List Company Bank Accounts

- **Method:** `GET`
- **Path:** `/api/v1/bank/company/:companyId`

---

## 2. Get Bank Account Detail

- **Method:** `GET`
- **Path:** `/api/v1/bank/:bankId`

---

## 3. Create Bank Account Record

- **Method:** `POST`
- **Path:** `/api/v1/bank`

### Request Body
```json
{
  "companyId": "60d5ec49f1b2c52d889e4102",
  "bankName": "Emirates NBD",
  "branch": "DIFC Branch",
  "accountHolder": "Acme Technologies LLC",
  "accountNumber": "101992837192",
  "iban": "AE09024000101992837192",
  "swiftCode": "EBNBAEADXXX",
  "currency": "AED"
}
```

---

## 4. Update Bank Account

- **Method:** `PUT`
- **Path:** `/api/v1/bank/:bankId`

---

## 5. Soft Delete Bank Account

- **Method:** `DELETE`
- **Path:** `/api/v1/bank/:bankId`
