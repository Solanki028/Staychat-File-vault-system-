import employeeRepository from '../repositories/EmployeeRepository.js';
import companyRepository from '../repositories/CompanyRepository.js';

class EmployeeService {
  async getCompanyEmployees(companyId, query, userId, role) {
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

    return await employeeRepository.findByCompany(companyId, query);
  }

  async getEmployeeById(employeeId) {
    const emp = await employeeRepository.findById(employeeId);
    if (!emp) {
      const error = new Error('Employee record not found.');
      error.statusCode = 404;
      error.errorCode = 'EMPLOYEE_NOT_FOUND';
      throw error;
    }
    return emp;
  }

  async createEmployee(employeeData, userId) {
    const existing = await employeeRepository.findByCompanyAndEmail(employeeData.companyId, employeeData.email);
    if (existing) {
      const error = new Error('An employee with this email already exists in this company workspace.');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_EMPLOYEE_EMAIL';
      throw error;
    }

    const payload = {
      ...employeeData,
      createdBy: userId,
      updatedBy: userId
    };

    return await employeeRepository.create(payload);
  }

  async updateEmployee(employeeId, updateData, userId) {
    const existingEmp = await this.getEmployeeById(employeeId);

    if (updateData.email && updateData.email !== existingEmp.email) {
      const duplicate = await employeeRepository.findByCompanyAndEmail(existingEmp.companyId, updateData.email);
      if (duplicate) {
        const error = new Error('An employee with this email already exists in this company workspace.');
        error.statusCode = 409;
        error.errorCode = 'DUPLICATE_EMPLOYEE_EMAIL';
        throw error;
      }
    }

    const payload = {
      ...updateData,
      updatedBy: userId
    };

    return await employeeRepository.update(employeeId, payload);
  }

  async deleteEmployee(employeeId, userId) {
    await this.getEmployeeById(employeeId);
    return await employeeRepository.softDelete(employeeId, userId);
  }

  async getExpiringDocuments(companyId) {
    return await employeeRepository.findExpiringDocuments(companyId);
  }
}

export default new EmployeeService();
