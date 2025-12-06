/**
 * API Service Wrapper
 * Author: EcoTracker Team
 * Date: 2025-12-06
 * Purpose: Centralized API calls to backend using axios
 * TODOs:
 * - Replace hardcoded userId with auth token from context/redux
 * - Add request/response interceptors for auth headers
 * - Add retry logic for failed requests
 */

import axios from 'axios';

// Use empty baseURL so CRA proxy works (proxy configured in package.json)
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Post a log entry (vehicle, plastics, trees, heating)
 * @param {number} userId - User ID (TODO: get from auth)
 * @param {string} type - Entry type: vehicle|plastics|trees|heating
 * @param {object} payload - Entry data
 * @returns {Promise} - Saved entry with co2_estimate
 */
export const postLog = async (userId, type, payload) => {
  const response = await api.post('/api/log', {
    userId,
    type,
    payload
  });
  return response.data;
};

/**
 * Calculate CO2 without saving (preview)
 * @param {number} userId - User ID (TODO: get from auth)
 * @param {string} type - Entry type
 * @param {object} payload - Entry data
 * @returns {Promise} - { co2_estimate }
 */
export const calcCO2 = async (userId, type, payload) => {
  const response = await api.post('/api/calc', {
    userId,
    type,
    payload
  });
  return response.data;
};

/**
 * Get analytics and recent entries
 * @param {number} userId - User ID (TODO: get from auth)
 * @returns {Promise} - { entries: [...], aggregates: {...} }
 */
export const getAnalytics = async (userId) => {
  const response = await api.get(`/api/analytics?userId=${userId}`);
  return response.data;
};

/**
 * Get user profile and lifetime stats
 * @param {number} userId - User ID (TODO: get from auth)
 * @returns {Promise} - Profile data with lifetime stats
 */
export const getProfile = async (userId) => {
  const response = await api.get(`/api/profile?userId=${userId}`);
  return response.data;
};

/**
 * Export user data as CSV
 * @param {number} userId - User ID (TODO: get from auth)
 * @returns {Promise} - Blob data for CSV download
 */
export const exportCSV = async (userId) => {
  const response = await api.get(`/api/export?userId=${userId}`, {
    responseType: 'blob'
  });
  return response.data;
};

export default api;
