// API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://3.108.63.91:3000';

// Create axios instance with base URL
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
