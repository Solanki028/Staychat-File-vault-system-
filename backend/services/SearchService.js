import searchRepository from '../repositories/SearchRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class SearchService {
  async searchWorkspace(companyId, query, userId, role) {
    if (!query || query.trim().length === 0) {
      return {
        documents: [],
        employees: [],
        partners: [],
        vehicles: [],
        bankAccounts: [],
        invoices: []
      };
    }

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

    return await searchRepository.globalSearch(companyId, query.trim(), 5);
  }
}

export default new SearchService();
