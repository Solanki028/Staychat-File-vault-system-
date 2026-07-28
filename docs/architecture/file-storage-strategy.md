# File Storage Strategy

## Overview

Documents uploaded to the platform follow a controlled pipeline to ensure secure storage, validation, metadata indexation, and fast rendering.

---

## File Handling Pipeline

```
[ User Upload ] ──► [ MIME & Size Validation ] ──► [ Storage Driver (Local / S3) ]
                                                           │
[ Success Response ] ◄── [ DB Record Creation ] ◄─────── [ Save Metadata ]
```

---

## Storage Environments

- **Development:** Local disk storage (`backend/uploads/`) using Multer disk storage engine.
- **Production:** Cloud object storage (AWS S3 or Cloudinary) with secure presigned download URLs.

---

## Storage Constraints

- **Max File Size:** 25MB per file
- **Allowed MIME Types:**
  - Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - Spreadsheets: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - Images: `image/jpeg`, `image/png`, `image/webp`
  - Archives & Text: `application/zip`, `text/plain`

---

## Metadata Schema

Every document stores:
- `originalName`: Human readable name
- `fileName`: Cryptographically hashed unique storage key
- `mimeType`: Verified MIME type
- `size`: Size in bytes
- `category`: Document classification
- `companyId`: Target workspace ID
- `uploadedBy`: User ID
