import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const invoiceClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/invoices`
});

invoiceClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCompanyInvoices = async (companyId, params = {}) => {
  const response = await invoiceClient.get(`/company/${companyId}`, { params });
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await invoiceClient.post('/', invoiceData);
  return response.data;
};

export const updateInvoiceStatus = async (invoiceId, status) => {
  const response = await invoiceClient.patch(`/${invoiceId}/status`, { status });
  return response.data;
};

export const downloadInvoicePdf = (invoiceId) => {
  const token = localStorage.getItem('token');
  window.open(`${API_BASE_URL}/api/v1/invoices/${invoiceId}/pdf?token=${token}`, '_blank');
};

export const deleteInvoice = async (invoiceId) => {
  const response = await invoiceClient.delete(`/${invoiceId}`);
  return response.data;
};

export default invoiceClient;
