import ActivityLog from '../models/ActivityLog.js';

class AuditLogRepository {
  async findByCompany(companyId, { limit = 50 }) {
    return await ActivityLog.find({ companyId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(logData) {
    return await ActivityLog.create(logData);
  }
}

export default new AuditLogRepository();
