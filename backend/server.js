import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorMiddleware, notFoundHandler } from './middlewares/errorMiddleware.js';
import fileRoutes from './routes/fileRoutes.js';

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

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use('/files', fileRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
