import companyRepository from '../repositories/CompanyRepository.js';
import File from '../models/File.js';

class DashboardController {
  async getStats(req, res, next) {
    try {
      const ownerId = req.user.role === 'admin' ? null : req.user.id;

      const [totalCompanies, totalDocuments, expiringLicenses] = await Promise.all([
        companyRepository.countByOwner(ownerId),
        File.countDocuments({ isDeleted: false }),
        companyRepository.countExpiringLicenses(30)
      ]);

      return res.status(200).json({
        success: true,
        data: {
          totalCompanies,
          totalDocuments,
          totalEmployees: 0,
          expiringLicenses,
          activeEmployees: 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecent(req, res, next) {
    try {
      const recentDocuments = await File.find({ isDeleted: false })
        .sort({ createdAt: -1, uploadedAt: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        data: recentDocuments
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
