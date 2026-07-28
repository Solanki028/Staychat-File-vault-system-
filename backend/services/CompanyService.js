import companyRepository from '../repositories/CompanyRepository.js';

class CompanyService {
  async getCompanies({ userId, role, search, status, page, limit }) {
    // Business Owners view their owned companies; admins view all
    const ownerId = role === 'admin' ? null : userId;
    return await companyRepository.findAll({ ownerId, search, status, page, limit });
  }

  async getCompanyById(companyId, userId, role) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      const error = new Error('Company not found.');
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

    return company;
  }

  async createCompany(companyData, userId) {
    const existing = await companyRepository.findByRegistrationNumber(companyData.registrationNumber);
    if (existing) {
      const error = new Error('A company with this registration number already exists.');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_REGISTRATION_NUMBER';
      throw error;
    }

    const payload = {
      ...companyData,
      ownerId: userId,
      createdBy: userId,
      updatedBy: userId
    };

    return await companyRepository.create(payload);
  }

  async updateCompany(companyId, updateData, userId, role) {
    const company = await this.getCompanyById(companyId, userId, role);

    if (updateData.registrationNumber && updateData.registrationNumber !== company.registrationNumber) {
      const existing = await companyRepository.findByRegistrationNumber(updateData.registrationNumber);
      if (existing) {
        const error = new Error('A company with this registration number already exists.');
        error.statusCode = 409;
        error.errorCode = 'DUPLICATE_REGISTRATION_NUMBER';
        throw error;
      }
    }

    const payload = {
      ...updateData,
      updatedBy: userId
    };

    return await companyRepository.update(companyId, payload);
  }

  async deleteCompany(companyId, userId, role) {
    await this.getCompanyById(companyId, userId, role);
    return await companyRepository.softDelete(companyId, userId);
  }
}

export default new CompanyService();
