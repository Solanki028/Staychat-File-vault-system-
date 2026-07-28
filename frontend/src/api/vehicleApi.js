import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const vehicleClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/vehicles`
});

vehicleClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyVehicles = async (companyId, params = {}) => {
  const response = await vehicleClient.get(`/company/${companyId}`, { params });
  return response.data;
};

export const fetchExpiringVehicles = async (companyId) => {
  const response = await vehicleClient.get(`/company/${companyId}/expiring`);
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await vehicleClient.post('/', vehicleData);
  return response.data;
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  const response = await vehicleClient.put(`/${vehicleId}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (vehicleId) => {
  const response = await vehicleClient.delete(`/${vehicleId}`);
  return response.data;
};

export default vehicleClient;
