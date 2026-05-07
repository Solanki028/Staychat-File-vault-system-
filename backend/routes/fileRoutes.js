import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { deleteFile, getFiles, toggleFavorite, uploadFile } from '../controllers/fileController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/json'
]);


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeBaseName = path
      .parse(file.originalname)
      .name
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 80);
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `${safeBaseName}-${Date.now()}${extension}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Unsupported file type.'));
};

const maxFileSize = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
const upload = multer({ storage, fileFilter, limits: { fileSize: maxFileSize } });

router.post('/', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);
router.patch('/:id/favorite', toggleFavorite);

export default router;
