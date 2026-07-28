import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const auditClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/audit-logs`
});

auditClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyAuditLogs = async (companyId) => {
  const response = await auditClient.get(`/company/${companyId}`);
  return response.data;
};

export default auditClient;
