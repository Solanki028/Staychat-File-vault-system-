# Global Search API Specification

## Base Path: `/api/v1/search`

Provides unified debounced global search across workspace entities (Companies, Documents, Employees, Vehicles, Partners).

---

## 1. Execute Global Search

- **Method:** `GET`
- **Path:** `/api/v1/search`
- **Query Parameters:**
  - `keyword`: (Required) String term to match across titles, names, numbers
  - `companyId`: (Optional) Restrict search within a specific company workspace
  - `module`: (Optional) `Companies` | `Documents` | `Employees` | `Vehicles` | `Partners`
  - `page`: Page index (default 1)
  - `limit`: Result count (default 10)

### Request Example
`GET /api/v1/search?keyword=license&companyId=60d5ec49f1b2c52d889e4102`

### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "companies": [],
    "documents": [
      {
        "_id": "60d5ec49f1b2c52d889e4999",
        "title": "Trade_License.pdf",
        "category": "Legal",
        "matchedField": "title"
      }
    ],
    "employees": [],
    "vehicles": [
      {
        "_id": "60d5ec49f1b2c52d889e4333",
        "vehicleNumber": "DXB-99812",
        "matchedField": "registrationNumber"
      }
    ]
  }
}
```
