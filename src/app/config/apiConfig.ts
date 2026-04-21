// ============================================================
// BASE URL — đọc từ env hoặc dùng localhost mặc định
// ============================================================
export const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080';

// ============================================================
// ENDPOINTS
// ============================================================
export const ENDPOINTS = {
  CATALOG: {
    PRODUCTS:       '/api/products',
    PRODUCT_DETAIL: (id: number | string) => `/api/products/${id}`,
    BRANDS:         '/api/brands',
    CATEGORIES:     '/api/categories',
  },
};

// ============================================================
// Helper — fetch với base URL và JWT token tự động
// ============================================================
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    localStorage.getItem('authToken') ??
    sessionStorage.getItem('authToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    window.location.href = '/login';
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export default apiFetch;
