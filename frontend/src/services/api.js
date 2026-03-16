import axios from 'axios';
import { supabase } from '../lib/supabase';

/**
 * Axios API Service
 * Central Axios instance for all backend API communication.
 * Automatically prefixes all requests with /api.
 */
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  
  // Ensure the custom URL ends with /api if it doesn't already
  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,   // 60 second timeout (LLM can be slow)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
// Runs before every request - injects auth token and logs in dev
api.interceptors.request.use(
  async (config) => {
    // Get the active session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
// Runs on every response - extracts error messages for consistent error handling
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Success: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV || import.meta.env.PROD) {
      console.error('❌ API Error Details:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    let message = 'An unexpected error occurred';
    
    if (error.response?.data) {
      const data = error.response.data;
      // Extract message from various common error formats
      if (typeof data === 'string') {
        message = data;
      } else if (data.error) {
        message = typeof data.error === 'object' ? (data.error.message || JSON.stringify(data.error)) : data.error;
      } else if (data.message) {
        message = typeof data.message === 'object' ? JSON.stringify(data.message) : data.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    // Special handling for CORS or Network errors
    if (error.message === 'Network Error' && !error.response) {
      message = 'Connection error. Please check if the backend is running and CORS is configured correctly.';
    }

    return Promise.reject(new Error(message));
  }
);

// ── API Methods ──────────────────────────────────────────────────────────────

/**
 * Sends an image to the backend for plant identification
 * @param {File} imageFile - The plant image file to analyze
 * @returns {Promise<Object>} Full plant data including name, confidence, and info
 */
export const identifyPlant = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/plant/identify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Fetches scan history from Supabase via the backend
 * @param {number} limit - Maximum number of scans to return
 * @returns {Promise<Array>} Array of scan records
 */
export const getScanHistory = async (limit = 50) => {
  const response = await api.get(`/history?limit=${limit}`);
  return response.data;
};

/**
 * Deletes a scan from history
 * @param {string} id - The UUID of the scan to delete
 */
export const deleteScan = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

export default api;
