import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const documentClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/documents`
});

documentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyDocuments = async (companyId, params = {}) => {
  const response = await documentClient.get(`/company/${companyId}`, { params });
  return response.data;
};

export const uploadDocument = async (formData, onUploadProgress) => {
  const response = await documentClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
  return response.data;
};

export const downloadDocument = (documentId) => {
  const token = localStorage.getItem('token');
  window.open(`${API_BASE_URL}/api/v1/documents/${documentId}/download?token=${token}`, '_blank');
};

export const deleteDocument = async (documentId) => {
  const response = await documentClient.delete(`/${documentId}`);
  return response.data;
};

export const toggleFavoriteDocument = async (documentId) => {
  const response = await documentClient.patch(`/${documentId}/favorite`);
  return response.data;
};

export default documentClient;
