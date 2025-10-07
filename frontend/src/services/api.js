import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: baseUrl,
});

// Add request interceptor to include auth headers
api.interceptors.request.use(
  (config) => {
    const userEmail = localStorage.getItem('userEmail');
    const adminEmail = localStorage.getItem('adminEmail');
    
    // Add x-user-email header if available
    if (userEmail) {
      config.headers['x-user-email'] = userEmail;
    } else if (adminEmail) {
      config.headers['x-user-email'] = adminEmail;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;