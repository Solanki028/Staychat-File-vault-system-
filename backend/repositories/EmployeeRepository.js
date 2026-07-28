import Employee from '../models/Employee.js';

class EmployeeRepository {
  async findByCompany(companyId, { department, status, search, page = 1, limit = 10 }) {
    const filter = { companyId };
    if (department && department !== 'All') filter.department = department;
    if (status && status !== 'All') filter.employmentStatus = status;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      Employee.countDocuments(filter)
    ]);

    return {
      employees,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      limit: Number(limit)
    };
  }

  async findById(id) {
    return await Employee.findById(id).exec();
  }

  async findByCompanyAndEmail(companyId, email) {
    return await Employee.findOne({ companyId, email }).exec();
  }

  async create(employeeData) {
    return await Employee.create(employeeData);
  }

  async update(id, updateData) {
    return await Employee.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async softDelete(id, userId) {
    const emp = await Employee.findById(id);
    if (!emp) return null;
    return await emp.softDelete(userId);
  }

  async countByCompany(companyId) {
    return await Employee.countDocuments({ companyId, employmentStatus: 'Active' });
  }

  async findExpiringDocuments(companyId, daysThreshold = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysThreshold);

    return await Employee.find({
      companyId,
      $or: [
        { 'passportDetails.expiryDate': { $lte: futureDate, $gte: new Date() } },
        { 'visaDetails.expiryDate': { $lte: futureDate, $gte: new Date() } },
        { 'emiratesIdDetails.expiryDate': { $lte: futureDate, $gte: new Date() } }
      ]
    }).exec();
  }
}

export default new EmployeeRepository();
