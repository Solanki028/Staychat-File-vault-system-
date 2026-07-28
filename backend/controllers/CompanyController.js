import companyService from '../services/CompanyService.js';

class CompanyController {
  async getCompanies(req, res, next) {
    try {
      const { search, status, page, limit } = req.query;
      const result = await companyService.getCompanies({
        userId: req.user.id,
        role: req.user.role,
        search,
        status,
        page,
        limit
      });

      return res.status(200).json({
        success: true,
        data: result.companies,
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

  async getCompanyById(req, res, next) {
    try {
      const company = await companyService.getCompanyById(req.params.companyId, req.user.id, req.user.role);
      return res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      next(error);
    }
  }

  async createCompany(req, res, next) {
    try {
      const company = await companyService.createCompany(req.body, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Company created successfully.',
        data: company
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCompany(req, res, next) {
    try {
      const updated = await companyService.updateCompany(req.params.companyId, req.body, req.user.id, req.user.role);
      return res.status(200).json({
        success: true,
        message: 'Company updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompany(req, res, next) {
    try {
      await companyService.deleteCompany(req.params.companyId, req.user.id, req.user.role);
      return res.status(200).json({
        success: true,
        message: 'Company and associated workspace soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CompanyController();
