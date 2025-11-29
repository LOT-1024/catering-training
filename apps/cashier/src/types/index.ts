// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  inStock?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Material {
  id: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  unit: string;
  category: string;
  status: 'normal' | 'low' | 'critical';
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  ingredients: {
    materialId: number;
    amount: number;
    unit: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}