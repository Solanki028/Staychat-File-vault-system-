import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/files`
});

export const fetchFiles = () => api.get('/');

export const uploadFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
};

export const deleteFile = (id) => api.delete(`/${id}`);

export const toggleFavorite = (id) => api.patch(`/${id}/favorite`);

export default api;
