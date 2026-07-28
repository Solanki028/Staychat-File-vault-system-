import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/auth`
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData) => {
  const response = await authClient.post('/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await authClient.post('/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await authClient.post('/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await authClient.get('/me');
  return response.data;
};

export default authClient;
