import auditLogService from '../services/AuditLogService.js';

class AuditLogController {
  async getCompanyLogs(req, res, next) {
    try {
      const logs = await auditLogService.getCompanyLogs(req.params.companyId);
      return res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditLogController();
