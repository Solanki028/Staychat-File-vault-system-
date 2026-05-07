import fs from 'fs/promises';
import path from 'path';
import File from '../models/File.js';

const toPublicFileUrl = (req, fileName) => `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file = await File.create({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileUrl: toPublicFileUrl(req, req.file.filename),
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });

    return res.status(201).json({ message: 'File uploaded successfully.', file });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    return res.status(500).json({ message: 'Failed to upload file.', error: error.message });
  }
};

export const getFiles = async (_req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch files.', error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const resolvedPath = path.resolve(file.filePath);
    await fs.unlink(resolvedPath).catch((error) => {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    });

    await file.deleteOne();

    return res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete file.', error: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    file.isFavorite = !file.isFavorite;
    await file.save();

    return res.status(200).json({ message: `File ${file.isFavorite ? 'added to' : 'removed from'} favorites.`, file });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update favorite status.', error: error.message });
  }
};
