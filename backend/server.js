import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
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

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true
  })
);
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'file-vault-system' });
});

app.use('/files', fileRoutes);

app.use((error, _req, res, _next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: `File is too large. Max size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.` });
  }

  return res.status(400).json({ message: error.message || 'Request failed.' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
