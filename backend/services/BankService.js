import bankRepository from '../repositories/BankRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class BankService {
  async getCompanyBankAccounts(companyId, userId, role) {
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

    return await bankRepository.findByCompany(companyId);
  }

  async getBankAccountById(bankId) {
    const account = await bankRepository.findById(bankId);
    if (!account) {
      const error = new Error('Bank account record not found.');
      error.statusCode = 404;
      error.errorCode = 'BANK_ACCOUNT_NOT_FOUND';
      throw error;
    }
    return account;
  }

  async createBankAccount(bankData, userId) {
    const existing = await bankRepository.findByCompanyAndAccount(bankData.companyId, bankData.accountNumber);
    if (existing) {
      const error = new Error('A bank account with this account number already exists in this company workspace.');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_ACCOUNT_NUMBER';
      throw error;
    }

    const count = await bankRepository.countByCompany(bankData.companyId);
    const isFirstAccount = count === 0;

    const payload = {
      ...bankData,
      isPrimary: isFirstAccount ? true : Boolean(bankData.isPrimary),
      createdBy: userId,
      updatedBy: userId
    };

    const created = await bankRepository.create(payload);

    if (bankData.isPrimary && !isFirstAccount) {
      await bankRepository.setPrimaryAccount(bankData.companyId, created._id);
    }

    return created;
  }

  async updateBankAccount(bankId, updateData, userId) {
    const existing = await this.getBankAccountById(bankId);

    if (updateData.accountNumber && updateData.accountNumber !== existing.accountNumber) {
      const duplicate = await bankRepository.findByCompanyAndAccount(existing.companyId, updateData.accountNumber);
      if (duplicate) {
        const error = new Error('A bank account with this account number already exists in this company workspace.');
        error.statusCode = 409;
        error.errorCode = 'DUPLICATE_ACCOUNT_NUMBER';
        throw error;
      }
    }

    const payload = {
      ...updateData,
      updatedBy: userId
    };

    const updated = await bankRepository.update(bankId, payload);

    if (updateData.isPrimary) {
      await bankRepository.setPrimaryAccount(existing.companyId, bankId);
    }

    return updated;
  }

  async setPrimaryAccount(bankId, userId) {
    const account = await this.getBankAccountById(bankId);
    return await bankRepository.setPrimaryAccount(account.companyId, bankId);
  }

  async deleteBankAccount(bankId, userId) {
    await this.getBankAccountById(bankId);
    return await bankRepository.softDelete(bankId, userId);
  }
}

export default new BankService();
