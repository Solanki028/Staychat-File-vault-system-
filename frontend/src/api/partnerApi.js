import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const partnerClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/partners`
});

partnerClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyPartners = async (companyId) => {
  const response = await partnerClient.get(`/company/${companyId}`);
  return response.data;
};

export const createPartner = async (partnerData) => {
  const response = await partnerClient.post('/', partnerData);
  return response.data;
};

export const updatePartner = async (partnerId, partnerData) => {
  const response = await partnerClient.put(`/${partnerId}`, partnerData);
  return response.data;
};

export const deletePartner = async (partnerId) => {
  const response = await partnerClient.delete(`/${partnerId}`);
  return response.data;
};

export default partnerClient;
