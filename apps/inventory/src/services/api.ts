// services/api.ts
import { type RawMaterial, type Menu, type Stats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// Inventory API
export const inventoryAPI = {
  // Get all materials
  getMaterials: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/inventory/materials${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<{ data: RawMaterial[]; pagination: any }>(endpoint);
  },

  // Get material by ID
  getMaterial: (id: number) => {
    return apiCall<{ data: RawMaterial }>(`/inventory/materials/${id}`);
  },

  // Create new material
  createMaterial: (materialData: Omit<RawMaterial, 'id' | 'status' | 'lastRestocked'>) => {
    return apiCall<{ data: RawMaterial; message: string }>('/inventory/materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  },

  // Update material
  updateMaterial: (id: number, updates: Partial<RawMaterial>) => {
    return apiCall<{ data: RawMaterial; message: string }>(`/inventory/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Update material stock
  updateMaterialStock: (id: number, stock: number, operation: 'set' | 'add' = 'set') => {
    return apiCall<{ data: RawMaterial; message: string }>(`/inventory/materials/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock, operation }),
    });
  },

  // Delete material
  deleteMaterial: (id: number) => {
    return apiCall<{ message: string }>(`/inventory/materials/${id}`, {
      method: 'DELETE',
    });
  },

  // Get inventory stats
  getStats: () => {
    return apiCall<{ data: Stats }>('/inventory/materials/stats');
  },

  // Get categories
  getCategories: () => {
    return apiCall<{ data: string[] }>('/inventory/materials/categories');
  },
};

// Menu API
export const menuAPI = {
  // Get all menus
  getMenus: (params?: { category?: string; available?: boolean; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.available !== undefined) queryParams.append('available', params.available.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/menu${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<{ data: Menu[]; pagination: any }>(endpoint);
  },

  // Create menu
  createMenu: (menuData: Omit<Menu, 'id' | 'available' | 'cost' | 'profitMargin'>) => {
    return apiCall<{ data: Menu; message: string }>('/menu', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  },

  // Update menu
  updateMenu: (id: number, updates: Partial<Menu>) => {
    return apiCall<{ data: Menu; message: string }>(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete menu
  deleteMenu: (id: number) => {
    return apiCall<{ message: string }>(`/menu/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cashier API
export const cashierAPI = {
  // Get products for cashier
  getProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/cashier/products${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<{ data: any[]; pagination: any }>(endpoint);
  },

  // Create transaction
  createTransaction: (transactionData: any) => {
    return apiCall<{ data: any; message: string }>('/cashier/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  // Get transactions
  getTransactions: (params?: { limit?: number; offset?: number; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const endpoint = `/cashier/transactions${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<{ data: any[]; pagination: any }>(endpoint);
  },
};

// Health check
export const healthAPI = {
  check: () => {
    return apiCall<{ status: string; timestamp: string; service: string; version: string }>('/health');
  },
};