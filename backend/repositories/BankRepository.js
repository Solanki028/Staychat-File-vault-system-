import BankAccount from '../models/BankAccount.js';

class BankRepository {
  async findByCompany(companyId) {
    return await BankAccount.find({ companyId })
      .populate('attachmentId', 'originalName previewUrl mimeType size')
      .sort({ isPrimary: -1, createdAt: -1 })
      .exec();
  }

  async findById(id) {
    return await BankAccount.findById(id)
      .populate('attachmentId', 'originalName previewUrl mimeType size')
      .exec();
  }

  async findByCompanyAndAccount(companyId, accountNumber) {
    return await BankAccount.findOne({ companyId, accountNumber }).exec();
  }

  async create(bankData) {
    return await BankAccount.create(bankData);
  }

  async update(id, updateData) {
    return await BankAccount.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async softDelete(id, userId) {
    const account = await BankAccount.findById(id);
    if (!account) return null;
    return await account.softDelete(userId);
  }

  async setPrimaryAccount(companyId, primaryAccountId) {
    // Unset current primary accounts for this company
    await BankAccount.updateMany({ companyId, isPrimary: true }, { isPrimary: false });
    // Set target account as primary
    return await BankAccount.findByIdAndUpdate(primaryAccountId, { isPrimary: true }, { new: true });
  }

  async countByCompany(companyId) {
    return await BankAccount.countDocuments({ companyId });
  }
}

export default new BankRepository();
