import Vehicle from '../models/Vehicle.js';

class VehicleRepository {
  async findByCompany(companyId, { status, search, page = 1, limit = 10 }) {
    const filter = { companyId };
    if (status && status !== 'All') filter.vehicleStatus = status;

    if (search) {
      filter.$or = [
        { plateNumber: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { assignedDriver: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      Vehicle.countDocuments(filter)
    ]);

    return {
      vehicles,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      limit: Number(limit)
    };
  }

  async findById(id) {
    return await Vehicle.findById(id).exec();
  }

  async findByCompanyAndPlate(companyId, plateNumber) {
    return await Vehicle.findOne({ companyId, plateNumber }).exec();
  }

  async create(vehicleData) {
    return await Vehicle.create(vehicleData);
  }

  async update(id, updateData) {
    return await Vehicle.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async softDelete(id, userId) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return null;
    return await vehicle.softDelete(userId);
  }

  async findExpiringVehicles(companyId, daysThreshold = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysThreshold);

    return await Vehicle.find({
      companyId,
      $or: [
        { registrationExpiry: { $lte: futureDate } },
        { insuranceExpiry: { $lte: futureDate } }
      ]
    }).exec();
  }
}

export default new VehicleRepository();
