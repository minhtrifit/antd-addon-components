import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const session = Cookies.get('mtf-app');

    if (session) {
      try {
        const parsedSession = JSON.parse(session);

        const token = parsedSession?.token;

        if (token) {
          config.headers.token = `${token}`;
        }
      } catch (error) {
        console.error('Không thể parse session:', error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    return Promise.reject(error);
  },
);

export default axiosInstance;
