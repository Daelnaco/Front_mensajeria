// ==========================================
// API CONFIGURATION
// ==========================================

// Base API URL - Configure in .env
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:9000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  
  // Conversations
  conversations: {
    list: '/conversations',
    get: (id: string) => `/conversations/${id}`,
    create: '/conversations',
    markRead: (id: string) => `/conversations/${id}/read`,
  },
  
  // Messages
  messages: {
    list: (conversationId: string) => `/conversations/${conversationId}/messages`,
    send: (conversationId: string) => `/conversations/${conversationId}/messages`,
    markRead: (messageId: string) => `/messages/${messageId}/read`,
  },
  
  // Disputes
  disputes: {
    list: '/disputes',
    get: (id: string) => `/disputes/${id}`,
    create: '/disputes',
    update: (id: string) => `/disputes/${id}`,
    addEvidence: (id: string) => `/disputes/${id}/evidence`,
    addComment: (id: string) => `/disputes/${id}/comments`,
  },
  
  // File uploads
  uploads: {
    image: '/uploads/image',
    document: '/uploads/document',
  },
} as const;

// HTTP Headers
export const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getMultipartHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Request timeout (ms)
export const REQUEST_TIMEOUT = 30000;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};
