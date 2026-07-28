import vehicleRepository from '../repositories/VehicleRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class VehicleService {
  async getCompanyVehicles(companyId, query, userId, role) {
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

    return await vehicleRepository.findByCompany(companyId, query);
  }

  async getVehicleById(vehicleId) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      const error = new Error('Vehicle record not found.');
      error.statusCode = 404;
      error.errorCode = 'VEHICLE_NOT_FOUND';
      throw error;
    }
    return vehicle;
  }

  async createVehicle(vehicleData, userId) {
    const existing = await vehicleRepository.findByCompanyAndPlate(vehicleData.companyId, vehicleData.plateNumber);
    if (existing) {
      const error = new Error('A vehicle with this plate number already exists in this company workspace.');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_PLATE_NUMBER';
      throw error;
    }

    const payload = {
      ...vehicleData,
      createdBy: userId,
      updatedBy: userId
    };

    return await vehicleRepository.create(payload);
  }

  async updateVehicle(vehicleId, updateData, userId) {
    const existing = await this.getVehicleById(vehicleId);

    if (updateData.plateNumber && updateData.plateNumber !== existing.plateNumber) {
      const duplicate = await vehicleRepository.findByCompanyAndPlate(existing.companyId, updateData.plateNumber);
      if (duplicate) {
        const error = new Error('A vehicle with this plate number already exists in this company workspace.');
        error.statusCode = 409;
        error.errorCode = 'DUPLICATE_PLATE_NUMBER';
        throw error;
      }
    }

    const payload = {
      ...updateData,
      updatedBy: userId
    };

    return await vehicleRepository.update(vehicleId, payload);
  }

  async deleteVehicle(vehicleId, userId) {
    await this.getVehicleById(vehicleId);
    return await vehicleRepository.softDelete(vehicleId, userId);
  }

  async getExpiringVehicles(companyId) {
    return await vehicleRepository.findExpiringVehicles(companyId);
  }
}

export default new VehicleService();
