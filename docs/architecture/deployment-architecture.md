# Deployment Architecture

## Hosting Infrastructure

```
                               ┌─────────────────┐
                               │  Vercel CDN     │
                               │  (React 19 SPA) │
                               └────────┬────────┘
                                        │
                                 HTTPS REST API
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Render / Railway│
                               │ Node.js Server  │
                               └────────┬────────┘
                                        │
                       ┌────────────────┴────────────────┐
                       ▼                                 ▼
             ┌───────────────────┐             ┌───────────────────┐
             │   MongoDB Atlas   │             │ AWS S3 Storage    │
             │   Cluster         │             │ (Production Bucket)│
             └───────────────────┘             └───────────────────┘
```

---

## Deployment Target Allocation

- **Frontend:** Vercel (Edge CDN delivery, automated preview builds).
- **Backend Service:** Render / Railway (Managed Node.js container hosting).
- **Database:** MongoDB Atlas (Multi-region replica set).
- **File Storage:** AWS S3 Bucket with private ACLs and CloudFront distributions.

---

## CI/CD Pipeline Flow

```
[ Git Push / PR ] ──► [ Automated Tests ] ──► [ Lint & Build Check ] ──► [ Deploy Staging ] ──► [ Production Release ]
```

1. **Developer:** Pushes code to feature branch.
2. **GitHub Actions:** Runs automated unit/integration tests and build checks.
3. **Staging:** Automatic deployment on merge to `development`.
4. **Production:** Manual release tag triggers automated deployment to Vercel & Render.
