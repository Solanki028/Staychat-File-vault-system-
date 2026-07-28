# Invoices API Specifications

## Base Path: `/api/v1/invoices`

All endpoints require Bearer JWT Authentication.

---

## 1. List Company Invoices

- **Method:** `GET`
- **Path:** `/api/v1/invoices/company/:companyId`
- **Query Parameters:** `?type=Invoice&page=1&limit=10`

---

## 2. Get Invoice Detail

- **Method:** `GET`
- **Path:** `/api/v1/invoices/:invoiceId`

---

## 3. Create Invoice / Estimate

- **Method:** `POST`
- **Path:** `/api/v1/invoices`

### Request Body
```json
{
  "companyId": "60d5ec49f1b2c52d889e4102",
  "invoiceNumber": "INV-1001",
  "type": "Invoice",
  "clientName": "Global Trading FZ",
  "clientEmail": "billing@globaltrading.com",
  "issueDate": "2026-07-28",
  "dueDate": "2026-08-28",
  "lineItems": [
    {
      "description": "Software Development Services",
      "quantity": 40,
      "unitPrice": 150,
      "amount": 6000
    }
  ],
  "subtotal": 6000,
  "taxRate": 5,
  "taxAmount": 300,
  "totalAmount": 6300
}
```

---

## 4. Update Invoice

- **Method:** `PUT`
- **Path:** `/api/v1/invoices/:invoiceId`

---

## 5. Soft Delete Invoice

- **Method:** `DELETE`
- **Path:** `/api/v1/invoices/:invoiceId`

---

## 6. Generate PDF Export

- **Method:** `POST`
- **Path:** `/api/v1/invoices/:invoiceId/pdf`

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Invoice PDF generated successfully.",
  "data": {
    "pdfUrl": "https://storage.yourdomain.com/invoices/INV-1001.pdf"
  }
}
```
