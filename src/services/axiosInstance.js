import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/account/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (token logic handled elsewhere)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
