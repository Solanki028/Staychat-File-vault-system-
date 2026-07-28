import Partner from '../models/Partner.js';

class PartnerRepository {
  async findByCompany(companyId) {
    return await Partner.find({ companyId })
      .sort({ ownershipPercentage: -1 })
      .exec();
  }

  async findById(id) {
    return await Partner.findById(id).exec();
  }

  async findByCompanyAndEmail(companyId, email) {
    return await Partner.findOne({ companyId, email }).exec();
  }

  async create(partnerData) {
    return await Partner.create(partnerData);
  }

  async update(id, updateData) {
    return await Partner.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async softDelete(id, userId) {
    const partner = await Partner.findById(id);
    if (!partner) return null;
    return await partner.softDelete(userId);
  }

  async calculateTotalOwnership(companyId, excludePartnerId = null) {
    const filter = { companyId, isDeleted: false };
    if (excludePartnerId) {
      filter._id = { $ne: excludePartnerId };
    }

    const result = await Partner.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$ownershipPercentage' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}

export default new PartnerRepository();
