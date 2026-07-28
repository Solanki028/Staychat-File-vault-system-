import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorMiddleware, notFoundHandler } from './middlewares/errorMiddleware.js';
import { apiRateLimiter, authRateLimiter } from './middlewares/rateLimiter.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bankRoutes from './routes/bankRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

await connectDB();

// Security Hardening Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
        connectSrc: ["'self'", 'http:', 'https:']
      }
    }
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL Query Injection Sanitization
app.use(mongoSanitize());

app.use('/uploads', express.static(uploadsDir));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Company Workspace & Secure Document Management Platform API',
    version: '2.0.0',
    status: 'Running'
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, status: 'ok', service: 'company-workspace-api' });
});

// Apply Global API Rate Limiter
app.use('/api', apiRateLimiter);

// API v1 Routes
app.use('/api/v1/auth', authRateLimiter, authRoutes);
app.use('/api/auth', authRateLimiter, authRoutes); // Alias fallback
app.use('/api/v1/companies', companyRoutes);
app.use('/api/companies', companyRoutes); // Alias fallback
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/dashboard', dashboardRoutes); // Alias fallback
app.use('/api/v1/documents', documentRoutes);
app.use('/api/documents', documentRoutes); // Alias fallback
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/employees', employeeRoutes); // Alias fallback
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/partners', partnerRoutes); // Alias fallback
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/vehicles', vehicleRoutes); // Alias fallback
app.use('/api/v1/bank', bankRoutes);
app.use('/api/bank', bankRoutes); // Alias fallback
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/invoices', invoiceRoutes); // Alias fallback
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);
app.use('/api/v1/search', searchRoutes);

// Existing file routes
app.use('/files', fileRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
