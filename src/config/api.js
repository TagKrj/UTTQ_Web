
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  // ==================== AUTH ====================
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh`,
    PROFILE: `${API_BASE_URL}/api/auth/me`,
  },

  // ==================== DOCUMENTS ====================
  DOCUMENTS: {
    UPLOAD: `${API_BASE_URL}/api/documents/upload`,
  },

  
};

export default API_ENDPOINTS;