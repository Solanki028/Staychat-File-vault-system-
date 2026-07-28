import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const notificationClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/notifications`
});

notificationClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotifications = async () => {
  const response = await notificationClient.get('/');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await notificationClient.patch(`/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await notificationClient.patch('/read-all');
  return response.data;
};

export default notificationClient;
