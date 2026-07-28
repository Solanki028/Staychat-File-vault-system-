import Invoice from '../models/Invoice.js';

class InvoiceRepository {
  async findByCompany(companyId, { invoiceType, status, search, page = 1, limit = 10 }) {
    const filter = { companyId };
    if (invoiceType && invoiceType !== 'All') filter.invoiceType = invoiceType;
    if (status && status !== 'All') filter.invoiceStatus = status;

    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      Invoice.countDocuments(filter)
    ]);

    return {
      invoices,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      limit: Number(limit)
    };
  }

  async findById(id) {
    return await Invoice.findById(id).exec();
  }

  async findByCompanyAndNumber(companyId, invoiceNumber) {
    return await Invoice.findOne({ companyId, invoiceNumber }).exec();
  }

  async create(invoiceData) {
    return await Invoice.create(invoiceData);
  }

  async update(id, updateData) {
    return await Invoice.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async updateStatus(id, invoiceStatus) {
    return await Invoice.findByIdAndUpdate(id, { invoiceStatus }, { new: true }).exec();
  }

  async softDelete(id, userId) {
    const inv = await Invoice.findById(id);
    if (!inv) return null;
    return await inv.softDelete(userId);
  }

  async countByCompany(companyId) {
    return await Invoice.countDocuments({ companyId });
  }
}

export default new InvoiceRepository();
