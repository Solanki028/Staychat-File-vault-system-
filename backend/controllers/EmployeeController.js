import employeeService from '../services/EmployeeService.js';

class EmployeeController {
  async getCompanyEmployees(req, res, next) {
    try {
      const { department, status, search, page, limit } = req.query;
      const result = await employeeService.getCompanyEmployees(
        req.params.companyId,
        { department, status, search, page, limit },
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: result.employees,
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

  async getEmployeeById(req, res, next) {
    try {
      const emp = await employeeService.getEmployeeById(req.params.employeeId);
      return res.status(200).json({
        success: true,
        data: emp
      });
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const emp = await employeeService.createEmployee(req.body, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Employee record created successfully.',
        data: emp
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const updated = await employeeService.updateEmployee(req.params.employeeId, req.body, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Employee record updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      await employeeService.deleteEmployee(req.params.employeeId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Employee record soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpiringDocuments(req, res, next) {
    try {
      const docs = await employeeService.getExpiringDocuments(req.params.companyId);
      return res.status(200).json({
        success: true,
        data: docs
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();
