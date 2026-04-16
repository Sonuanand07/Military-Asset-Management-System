import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Set default headers
const instance = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => instance.post('/auth/login', { email, password }),
  register: (name, email, password, role, base) =>
    instance.post('/auth/register', { name, email, password, role, base }),
};

export const dashboardAPI = {
  getSummary: (base, startDate, endDate) =>
    instance.get('/dashboard/summary', { params: { base, startDate, endDate } }),
};

export const purchasesAPI = {
  getAll: (filters) => instance.get('/purchases', { params: filters }),
  create: (data) => instance.post('/purchases', data),
};

export const transfersAPI = {
  getAll: (filters) => instance.get('/transfers', { params: filters }),
  create: (data) => instance.post('/transfers', data),
  updateStatus: (id, status) => instance.put(`/transfers/${id}`, { status }),
};

export const assignmentsAPI = {
  getAll: (filters) => instance.get('/assignments', { params: filters }),
  create: (data) => instance.post('/assignments', data),
  recordExpenditure: (id, expendedQuantity) =>
    instance.put(`/assignments/${id}/expend`, { expendedQuantity }),
};

export default instance;
