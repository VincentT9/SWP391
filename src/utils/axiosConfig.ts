import axios from 'axios';

// Create axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization' : `Bearer ${localStorage.getItem('authToken') || ''}`,
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token
instance.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      // Handle token expiration - e.g., redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Log errors
    console.error('API Error:', error);
    
    return Promise.reject(error);
  }
);

export default instance;
