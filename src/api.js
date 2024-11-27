import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/auth' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* helpers */
export const register = (formData) => API.post('/register', formData);
export const login = (formData) => API.post('/login', formData);