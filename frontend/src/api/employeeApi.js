import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const employeeClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/employees`
});

employeeClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyEmployees = async (companyId, params = {}) => {
  const response = await employeeClient.get(`/company/${companyId}`, { params });
  return response.data;
};

export const fetchExpiringDocuments = async (companyId) => {
  const response = await employeeClient.get(`/company/${companyId}/expiring`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await employeeClient.post('/', employeeData);
  return response.data;
};

export const updateEmployee = async (employeeId, employeeData) => {
  const response = await employeeClient.put(`/${employeeId}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await employeeClient.delete(`/${employeeId}`);
  return response.data;
};

export default employeeClient;
