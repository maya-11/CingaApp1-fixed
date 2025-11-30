// 🔝 IMPORTS MUST BE AT THE TOP
import axios from 'axios';
import { Platform } from 'react-native';
import { auth } from '../services/firebase';  // ✅ Correct path!

// Select correct base URL
const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'   // Android emulator
    : 'http://localhost:5000/api' // iOS simulator
  : 'https://your-production-backend.com/api';

console.log('📱 Using API base URL:', API_BASE_URL);

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Add Firebase token to each request
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token error:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
