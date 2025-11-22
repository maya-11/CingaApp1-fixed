import axios from 'axios';
import { Platform } from 'react-native';
import { auth } from './firebase';  // ADD THIS IMPORT

// Simple base URL configuration
const API_BASE_URL = __DEV__ 
  ? Platform.OS === 'android' 
    ? 'http://10.0.2.2:5000/api'  // Android emulator
    : 'http://localhost:5000/api'  // iOS simulator
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

// ✅ ADD THIS: Request interceptor to automatically add Firebase token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        console.log('🔐 Adding Firebase token to request');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('🔐 No user logged in, sending request without token');
      }
    } catch (error) {
      console.error('❌ Error getting Firebase token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Simple response interceptor
api.interceptors.response.use(
  (response) => {
    // Only log non-health check successes to reduce noise
    if (!response.config.url?.includes('/health')) {
      console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const url = error.config?.url;
    const status = error.response?.status;
    
    // Don't log expected development errors as errors
    if (url?.includes('/auth/login') && status === 500) {
      console.log('🔧 Auth endpoint returning 500 (expected during development)');
    } else if (status === 404 || status === 401) {
      console.log(`🔧 API ${status} for ${url} (using mock data)`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Backend server not running (expected during development)');
      console.log('💡 Start backend with: cd backend && npm run dev');
    } else if (error.message === 'Network Error') {
      console.log('🔧 Network connection issue (check backend server)');
    } else {
      // Only show as error for unexpected issues
      console.error('❌ API Error:', {
        url,
        status,
        message: error.message,
        code: error.code
      });
    }

    throw error;
  }
);

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    console.log('🔍 Checking backend health...');
    const response = await api.get('/health');
    console.log('✅ Backend is healthy!');
    return response.status === 200;
  } catch (error: any) {
    console.log('🔧 Backend health check failed (expected during development):', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure backend is running with: npm run dev');
      console.log('💡 For Android emulator, use: http://10.0.2.2:5000');
      console.log('💡 For iOS simulator, use: http://localhost:5000');
    }
    
    return false;
  }
};

export default api;