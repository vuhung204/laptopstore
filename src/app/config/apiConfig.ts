import axios from 'axios';

// ============================================================
// BASE URL
// ============================================================
export const BASE_URL = 'http://localhost:9765/api';

// ============================================================
// ENDPOINTS
// ============================================================
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register',
  },

  // Catalog
  CATALOG: {
    PRODUCTS:       '/products',
    PRODUCT_DETAIL: (id: number | string) => `/products/${id}`,
    BRANDS:         '/brands',
    CATEGORIES:     '/categories',
  },

  // Cart
  CART: {
    BASE:   '/cart',
    ITEM:   (productId: number | string) => `/cart/${productId}`,
  },

  // User
  USER: {
    PROFILE:    '/user/profile',
    PASSWORD:   '/user/password',
    ADDRESSES:  '/user/addresses',
  },

  // Orders
  ORDERS: {
    BASE:   '/orders',
    DETAIL: (id: number | string) => `/orders/${id}`,
  },
};

// ============================================================
// AXIOS INSTANCE — tự động đính kèm JWT token
// ============================================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: thêm token vào mọi request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → xóa token + redirect về login
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;