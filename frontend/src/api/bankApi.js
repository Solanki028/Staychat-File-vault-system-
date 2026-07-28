import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const bankClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/bank`
});

bankClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyBankAccounts = async (companyId) => {
  const response = await bankClient.get(`/company/${companyId}`);
  return response.data;
};

export const createBankAccount = async (bankData) => {
  const response = await bankClient.post('/', bankData);
  return response.data;
};

export const updateBankAccount = async (bankId, bankData) => {
  const response = await bankClient.put(`/${bankId}`, bankData);
  return response.data;
};

export const setPrimaryBankAccount = async (bankId) => {
  const response = await bankClient.patch(`/${bankId}/primary`);
  return response.data;
};

export const deleteBankAccount = async (bankId) => {
  const response = await bankClient.delete(`/${bankId}`);
  return response.data;
};

export default bankClient;
