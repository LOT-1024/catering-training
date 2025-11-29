// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Cannot connect to server');
      }
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.fetchWithAuth('/health');
  }

  // Products
  async getProducts(category?: string) {
    const url = category ? `/cashier/products?category=${encodeURIComponent(category)}` : '/cashier/products';
    return this.fetchWithAuth(url);
  }

  // Transactions
  async createTransaction(transactionData: any) {
    return this.fetchWithAuth('/cashier/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactions() {
    return this.fetchWithAuth('/cashier/transactions');
  }

  async getTransaction(id: string) {
    return this.fetchWithAuth(`/cashier/transactions/${id}`);
  }

  // Inventory
  async getMaterials(category?: string, status?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const url = queryString ? `/inventory/materials?${queryString}` : '/inventory/materials';
    return this.fetchWithAuth(url);
  }

  async getMaterial(id: number) {
    return this.fetchWithAuth(`/inventory/materials/${id}`);
  }

  async updateMaterialStock(id: number, stock: number) {
    return this.fetchWithAuth(`/inventory/materials/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  }

  async getInventoryStats() {
    return this.fetchWithAuth('/inventory/materials/stats');
  }

  // Menu
  async getMenus() {
    return this.fetchWithAuth('/menu');
  }

  async createMenu(menuData: any) {
    return this.fetchWithAuth('/menu', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  }

  async updateMenu(id: number, menuData: any) {
    return this.fetchWithAuth(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  }

  async deleteMenu(id: number) {
    return this.fetchWithAuth(`/menu/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();