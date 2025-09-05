import axios from 'axios';
import API_BASE_URL from '../config';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include credentials
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is always true
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
