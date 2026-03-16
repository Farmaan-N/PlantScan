import axios from 'axios';
import { supabase } from '../lib/supabase';

/**
 * Axios API Service
 * Central Axios instance for all backend API communication.
 * Automatically prefixes all requests with /api.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
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
