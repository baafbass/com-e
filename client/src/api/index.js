import { apiClient } from './client';

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  me: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.patch('/auth/me', data),
  changePassword: (data) => apiClient.patch('/auth/me/password', data),
};

export const categoriesApi = {
  list: () => apiClient.get('/categories'),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  remove: (id) => apiClient.delete(`/categories/${id}`),
};

export const productsApi = {
  list: (params) => apiClient.get('/products', { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  remove: (id) => apiClient.delete(`/products/${id}`),
  listReviews: (id) => apiClient.get(`/products/${id}/reviews`),
  addReview: (id, data) => apiClient.post(`/products/${id}/reviews`, data),
};

export const cartApi = {
  get: () => apiClient.get('/cart'),
  addItem: (productId, quantity) => apiClient.post('/cart/items', { productId, quantity }),
  updateItem: (productId, quantity) => apiClient.patch(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => apiClient.delete(`/cart/items/${productId}`),
  clear: () => apiClient.delete('/cart'),
  merge: (items) => apiClient.post('/cart/merge', { items }),
};

export const ordersApi = {
  checkout: (shipping) => apiClient.post('/orders', shipping),
  listMine: () => apiClient.get('/orders/mine'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  cancel: (id) => apiClient.patch(`/orders/${id}/cancel`),
  listAll: (params) => apiClient.get('/orders', { params }),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
};

export const adminApi = {
  stats: () => apiClient.get('/admin/stats'),
  listUsers: () => apiClient.get('/users'),
  updateUserRole: (id, role) => apiClient.patch(`/users/${id}/role`, { role }),
};
