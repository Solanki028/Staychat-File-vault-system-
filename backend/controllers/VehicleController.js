import vehicleService from '../services/VehicleService.js';

class VehicleController {
  async getCompanyVehicles(req, res, next) {
    try {
      const { status, search, page, limit } = req.query;
      const result = await vehicleService.getCompanyVehicles(
        req.params.companyId,
        { status, search, page, limit },
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: result.vehicles,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalItems: result.total,
          totalPages: result.pages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicleById(req, res, next) {
    try {
      const vehicle = await vehicleService.getVehicleById(req.params.vehicleId);
      return res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  }

  async createVehicle(req, res, next) {
    try {
      const vehicle = await vehicleService.createVehicle(req.body, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Vehicle record created successfully.',
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req, res, next) {
    try {
      const updated = await vehicleService.updateVehicle(req.params.vehicleId, req.body, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Vehicle record updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req, res, next) {
    try {
      await vehicleService.deleteVehicle(req.params.vehicleId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Vehicle record soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpiringVehicles(req, res, next) {
    try {
      const vehicles = await vehicleService.getExpiringVehicles(req.params.companyId);
      return res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VehicleController();
