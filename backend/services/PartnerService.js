import partnerRepository from '../repositories/PartnerRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class PartnerService {
  async getCompanyPartners(companyId, userId, role) {
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

    const partners = await partnerRepository.findByCompany(companyId);
    const totalOwnershipPercentage = await partnerRepository.calculateTotalOwnership(companyId);

    return {
      partners,
      totalOwnershipPercentage,
      availablePercentage: Number((100.0 - totalOwnershipPercentage).toFixed(2))
    };
  }

  async getPartnerById(partnerId) {
    const partner = await partnerRepository.findById(partnerId);
    if (!partner) {
      const error = new Error('Partner record not found.');
      error.statusCode = 404;
      error.errorCode = 'PARTNER_NOT_FOUND';
      throw error;
    }
    return partner;
  }

  async createPartner(partnerData, userId) {
    // 1. Check duplicate email in company
    const existing = await partnerRepository.findByCompanyAndEmail(partnerData.companyId, partnerData.email);
    if (existing) {
      const error = new Error('A partner with this email already exists in this company workspace.');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_PARTNER_EMAIL';
      throw error;
    }

    // 2. Validate total ownership percentage does not exceed 100%
    const currentTotal = await partnerRepository.calculateTotalOwnership(partnerData.companyId);
    const newTotal = currentTotal + Number(partnerData.ownershipPercentage);

    if (newTotal > 100.0) {
      const remaining = (100.0 - currentTotal).toFixed(2);
      const error = new Error(
        `Ownership allocation exceeds 100.00%. Current total: ${currentTotal.toFixed(2)}%. Maximum available allocation is ${remaining}%.`
      );
      error.statusCode = 400;
      error.errorCode = 'OWNERSHIP_EXCEEDS_100';
      throw error;
    }

    const payload = {
      ...partnerData,
      createdBy: userId,
      updatedBy: userId
    };

    return await partnerRepository.create(payload);
  }

  async updatePartner(partnerId, updateData, userId) {
    const existingPartner = await this.getPartnerById(partnerId);

    if (updateData.email && updateData.email !== existingPartner.email) {
      const duplicate = await partnerRepository.findByCompanyAndEmail(existingPartner.companyId, updateData.email);
      if (duplicate) {
        const error = new Error('A partner with this email already exists in this company workspace.');
        error.statusCode = 409;
        error.errorCode = 'DUPLICATE_PARTNER_EMAIL';
        throw error;
      }
    }

    if (updateData.ownershipPercentage !== undefined) {
      const currentOtherTotal = await partnerRepository.calculateTotalOwnership(existingPartner.companyId, partnerId);
      const newTotal = currentOtherTotal + Number(updateData.ownershipPercentage);

      if (newTotal > 100.0) {
        const remaining = (100.0 - currentOtherTotal).toFixed(2);
        const error = new Error(
          `Ownership allocation exceeds 100.00%. Maximum available allocation for this partner is ${remaining}%.`
        );
        error.statusCode = 400;
        error.errorCode = 'OWNERSHIP_EXCEEDS_100';
        throw error;
      }
    }

    const payload = {
      ...updateData,
      updatedBy: userId
    };

    return await partnerRepository.update(partnerId, payload);
  }

  async deletePartner(partnerId, userId) {
    await this.getPartnerById(partnerId);
    return await partnerRepository.softDelete(partnerId, userId);
  }
}

export default new PartnerService();
