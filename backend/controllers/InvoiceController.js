import invoiceService from '../services/InvoiceService.js';
import pdfService from '../services/PdfService.js';
import companyRepository from '../repositories/CompanyRepository.js';

class InvoiceController {
  async getCompanyInvoices(req, res, next) {
    try {
      const { invoiceType, status, search, page, limit } = req.query;
      const result = await invoiceService.getCompanyInvoices(
        req.params.companyId,
        { invoiceType, status, search, page, limit },
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: result.invoices,
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

  async getInvoiceById(req, res, next) {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.invoiceId);
      return res.status(200).json({
        success: true,
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  async createInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.createInvoice(req.body, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Invoice created successfully.',
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInvoice(req, res, next) {
    try {
      const updated = await invoiceService.updateInvoice(req.params.invoiceId, req.body, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Invoice updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInvoiceStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await invoiceService.updateInvoiceStatus(req.params.invoiceId, status, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Invoice status updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteInvoice(req, res, next) {
    try {
      await invoiceService.deleteInvoice(req.params.invoiceId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Invoice soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async exportPdf(req, res, next) {
    try {
      const invoice = await invoiceService.getInvoiceById(req.params.invoiceId);
      const company = await companyRepository.findById(invoice.companyId);
      return pdfService.generateInvoicePdf(invoice, company, res);
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceController();
