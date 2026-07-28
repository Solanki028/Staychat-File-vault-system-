import auditLogRepository from '../repositories/AuditLogRepository.js';

class AuditLogService {
  async getCompanyLogs(companyId) {
    return await auditLogRepository.findByCompany(companyId, { limit: 50 });
  }

  async logAction({ companyId, userId, userEmail, action, module, details, ipAddress }) {
    try {
      return await auditLogRepository.create({
        companyId,
        userId,
        userEmail,
        action,
        module,
        details,
        ipAddress: ipAddress || '127.0.0.1'
      });
    } catch (error) {
      console.error('Audit log creation failed:', error.message);
    }
  }
}

export default new AuditLogService();
