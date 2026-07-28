import path from 'path';
import documentService from '../services/DocumentService.js';

class DocumentController {
  async getCompanyDocuments(req, res, next) {
    try {
      const { category, search, isFavorite, page, limit } = req.query;
      const result = await documentService.getCompanyDocuments(
        req.params.companyId,
        { category, search, isFavorite, page, limit },
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: result.documents,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalItems: result.total,
          totalPages: result.pages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentById(req, res, next) {
    try {
      const doc = await documentService.getDocumentById(req.params.documentId);
      return res.status(200).json({
        success: true,
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req, res, next) {
    try {
      const doc = await documentService.uploadDocument(
        {
          file: req.file,
          companyId: req.body.companyId,
          category: req.body.category,
          description: req.body.description,
          expiryDate: req.body.expiryDate
        },
        req.user.id
      );

      return res.status(201).json({
        success: true,
        message: 'Document uploaded successfully.',
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  async replaceDocument(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Replacement file is required.' });
      }
      const updated = await documentService.replaceDocument(req.params.documentId, req.file, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Document version replaced successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadDocument(req, res, next) {
    try {
      const doc = await documentService.getDocumentById(req.params.documentId);
      const filePath = path.resolve(doc.storagePath);
      return res.download(filePath, doc.originalName);
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      await documentService.deleteDocument(req.params.documentId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Document soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleFavorite(req, res, next) {
    try {
      const updated = await documentService.toggleFavorite(req.params.documentId);
      return res.status(200).json({
        success: true,
        message: `Document ${updated.isFavorite ? 'added to' : 'removed from'} favorites.`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();
