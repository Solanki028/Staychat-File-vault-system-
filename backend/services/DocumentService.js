import path from 'path';
import documentRepository from '../repositories/DocumentRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class DocumentService {
  async getCompanyDocuments(companyId, query, userId, role) {
    // Verify workspace access
    const company = await companyRepository.findById(companyId);
    if (!company) {
      const error = new Error('Target company workspace not found.');
      error.statusCode = 404;
      error.errorCode = 'COMPANY_NOT_FOUND';
      throw error;
    }

    if (role !== 'admin' && company.ownerId.toString() !== userId.toString()) {
      const error = new Error('Access denied. You do not own this company workspace.');
      error.statusCode = 403;
      error.errorCode = 'FORBIDDEN_WORKSPACE';
      throw error;
    }

    return await documentRepository.findByCompany(companyId, query);
  }

  async uploadDocument({ file, companyId, category = 'General', description, expiryDate }, userId) {
    if (!file) {
      const error = new Error('No file uploaded.');
      error.statusCode = 400;
      error.errorCode = 'NO_FILE_PROVIDED';
      throw error;
    }

    const company = await companyRepository.findById(companyId);
    if (!company) {
      const error = new Error('Target company workspace not found.');
      error.statusCode = 404;
      error.errorCode = 'COMPANY_NOT_FOUND';
      throw error;
    }

    const extension = path.extname(file.originalname).toLowerCase().replace('.', '');

    const docPayload = {
      companyId,
      uploadedBy: userId,
      createdBy: userId,
      updatedBy: userId,
      title: file.originalname,
      category,
      originalName: file.originalname,
      storageName: file.filename,
      mimeType: file.mimetype,
      extension,
      size: file.size,
      storagePath: file.path,
      previewUrl: `/uploads/${file.filename}`,
      description: description || null,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    };

    return await documentRepository.create(docPayload);
  }

  async getDocumentById(documentId) {
    const doc = await documentRepository.findById(documentId);
    if (!doc) {
      const error = new Error('Document not found.');
      error.statusCode = 404;
      error.errorCode = 'DOCUMENT_NOT_FOUND';
      throw error;
    }
    return doc;
  }

  async replaceDocument(documentId, file, userId) {
    const existingDoc = await this.getDocumentById(documentId);
    const extension = path.extname(file.originalname).toLowerCase().replace('.', '');

    const updatePayload = {
      originalName: file.originalname,
      storageName: file.filename,
      mimeType: file.mimetype,
      extension,
      size: file.size,
      storagePath: file.path,
      previewUrl: `/uploads/${file.filename}`,
      version: existingDoc.version + 1,
      updatedBy: userId
    };

    return await documentRepository.update(documentId, updatePayload);
  }

  async deleteDocument(documentId, userId) {
    await this.getDocumentById(documentId);
    return await documentRepository.softDelete(documentId, userId);
  }

  async toggleFavorite(documentId) {
    await this.getDocumentById(documentId);
    return await documentRepository.toggleFavorite(documentId);
  }
}

export default new DocumentService();
