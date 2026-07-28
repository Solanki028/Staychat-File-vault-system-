import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const companyClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/companies`
});

companyClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanies = async (params = {}) => {
  const response = await companyClient.get('/', { params });
  return response.data;
};

export const fetchCompanyById = async (companyId) => {
  const response = await companyClient.get(`/${companyId}`);
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await companyClient.post('/', companyData);
  return response.data;
};

export const updateCompany = async (companyId, companyData) => {
  const response = await companyClient.put(`/${companyId}`, companyData);
  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await companyClient.delete(`/${companyId}`);
  return response.data;
};

export default companyClient;
