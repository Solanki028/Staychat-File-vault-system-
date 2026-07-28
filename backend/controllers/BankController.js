import bankService from '../services/BankService.js';

class BankController {
  async getCompanyBankAccounts(req, res, next) {
    try {
      const accounts = await bankService.getCompanyBankAccounts(
        req.params.companyId,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: accounts
      });
    } catch (error) {
      next(error);
    }
  }

  async getBankAccountById(req, res, next) {
    try {
      const account = await bankService.getBankAccountById(req.params.bankId);
      return res.status(200).json({
        success: true,
        data: account
      });
    } catch (error) {
      next(error);
    }
  }

  async createBankAccount(req, res, next) {
    try {
      const account = await bankService.createBankAccount(req.body, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Bank account created successfully.',
        data: account
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBankAccount(req, res, next) {
    try {
      const updated = await bankService.updateBankAccount(req.params.bankId, req.body, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Bank account updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async setPrimaryAccount(req, res, next) {
    try {
      const updated = await bankService.setPrimaryAccount(req.params.bankId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Bank account set as primary for this company.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBankAccount(req, res, next) {
    try {
      await bankService.deleteBankAccount(req.params.bankId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Bank account soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BankController();
