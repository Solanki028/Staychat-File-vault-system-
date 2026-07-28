import Company from '../models/Company.js';

class CompanyRepository {
  async findAll({ ownerId, search, status, page = 1, limit = 10 }) {
    const filter = {};
    if (ownerId) filter.ownerId = ownerId;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      Company.countDocuments(filter)
    ]);

    return {
      companies,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      limit: Number(limit)
    };
  }

  async findById(id) {
    return await Company.findById(id).exec();
  }

  async findByRegistrationNumber(registrationNumber) {
    return await Company.findOne({ registrationNumber }).exec();
  }

  async create(companyData) {
    return await Company.create(companyData);
  }

  async update(id, updateData) {
    return await Company.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async softDelete(id, userId) {
    const company = await Company.findById(id);
    if (!company) return null;
    return await company.softDelete(userId);
  }

  async countByOwner(ownerId) {
    return await Company.countDocuments({ ownerId });
  }

  async countExpiringLicenses(daysThreshold = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysThreshold);

    return await Company.countDocuments({
      licenseExpiryDate: { $lte: futureDate, $gte: new Date() }
    });
  }
}

export default new CompanyRepository();
