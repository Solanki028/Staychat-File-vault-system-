# Authentication API Specifications

## Base Path: `/api/v1/auth`

---

## 1. Register User

- **Method:** `POST`
- **Path:** `/api/v1/auth/register`
- **Auth:** Public

### Request Body
```json
{
  "fullName": "Priyanshu Solanki",
  "email": "priyanshu@example.com",
  "password": "Password123!"
}
```

### Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "60d5ec49f1b2c52d889e4101",
      "fullName": "Priyanshu Solanki",
      "email": "priyanshu@example.com",
      "role": "owner"
    }
  }
}
```

---

## 2. Login User

- **Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Auth:** Public

### Request Body
```json
{
  "email": "priyanshu@example.com",
  "password": "Password123!"
}
```

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "60d5ec49f1b2c52d889e4101",
      "fullName": "Priyanshu Solanki",
      "email": "priyanshu@example.com",
      "role": "owner"
    }
  }
}
```

---

## 3. Logout User

- **Method:** `POST`
- **Path:** `/api/v1/auth/logout`
- **Auth:** Bearer JWT Token Required

### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 4. Get Current User Profile

- **Method:** `GET`
- **Path:** `/api/v1/auth/me`
- **Auth:** Bearer JWT Token Required

### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d5ec49f1b2c52d889e4101",
      "fullName": "Priyanshu Solanki",
      "email": "priyanshu@example.com",
      "role": "owner",
      "createdAt": "2026-07-28T18:00:00.000Z"
    }
  }
}
```
