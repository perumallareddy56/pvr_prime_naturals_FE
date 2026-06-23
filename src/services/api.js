import axios from 'axios';

// In production (Vercel), VITE_API_URL must point to the Railway backend.
// In development, fall back to the Vite proxy so local dev still works.
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
    }
  }
  return Promise.reject(error);
});

export default api;
