import invoiceRepository from '../repositories/InvoiceRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class InvoiceService {
  calculateTotals(lineItems = [], discountAmount = 0) {
    let subtotal = 0;
    let taxAmount = 0;

    const computedItems = lineItems.map((item) => {
      const amount = Number(item.quantity) * Number(item.unitPrice);
      const tax = (amount * Number(item.taxRate || 0)) / 100;
      subtotal += amount;
      taxAmount += tax;

      return {
        ...item,
        amount
      };
    });

    const totalAmount = subtotal + taxAmount - Number(discountAmount || 0);

    return {
      lineItems: computedItems,
      subtotal,
      taxAmount,
      discountAmount: Number(discountAmount || 0),
      totalAmount: totalAmount > 0 ? totalAmount : 0
    };
  }

  async getCompanyInvoices(companyId, query, userId, role) {
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

    return await invoiceRepository.findByCompany(companyId, query);
  }

  async getInvoiceById(invoiceId) {
    const inv = await invoiceRepository.findById(invoiceId);
    if (!inv) {
      const error = new Error('Invoice record not found.');
      error.statusCode = 404;
      error.errorCode = 'INVOICE_NOT_FOUND';
      throw error;
    }
    return inv;
  }

  async createInvoice(invoiceData, userId) {
    const count = await invoiceRepository.countByCompany(invoiceData.companyId);
    const year = new Date().getFullYear();
    const autoNumber = `INV-${year}-${(count + 1).toString().padStart(4, '0')}`;
    const invoiceNumber = invoiceData.invoiceNumber || autoNumber;

    const existing = await invoiceRepository.findByCompanyAndNumber(invoiceData.companyId, invoiceNumber);
    if (existing) {
      const error = new Error('An invoice with this invoice number already exists in this company workspace.');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_INVOICE_NUMBER';
      throw error;
    }

    const totals = this.calculateTotals(invoiceData.lineItems, invoiceData.discountAmount);

    const payload = {
      ...invoiceData,
      invoiceNumber,
      ...totals,
      createdBy: userId,
      updatedBy: userId
    };

    return await invoiceRepository.create(payload);
  }

  async updateInvoice(invoiceId, updateData, userId) {
    const existing = await this.getInvoiceById(invoiceId);

    let totals = {};
    if (updateData.lineItems) {
      totals = this.calculateTotals(updateData.lineItems, updateData.discountAmount ?? existing.discountAmount);
    }

    const payload = {
      ...updateData,
      ...totals,
      updatedBy: userId
    };

    return await invoiceRepository.update(invoiceId, payload);
  }

  async updateInvoiceStatus(invoiceId, status, userId) {
    await this.getInvoiceById(invoiceId);
    return await invoiceRepository.updateStatus(invoiceId, status);
  }

  async deleteInvoice(invoiceId, userId) {
    await this.getInvoiceById(invoiceId);
    return await invoiceRepository.softDelete(invoiceId, userId);
  }
}

export default new InvoiceService();
