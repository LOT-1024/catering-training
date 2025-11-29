export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  inStock: boolean;
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
  timestamp: Date;
  status: 'completed' | 'refunded';
}

export interface RawMaterial {
  id: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  unit: string;
  category: string;
  status: 'normal' | 'low' | 'critical';
  supplier?: string;
  lastRestocked?: Date;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: MenuIngredient[];
  available: boolean;
}

export interface MenuIngredient {
  materialId: number;
  amount: number;
  unit: string;
}

export interface Stats {
  totalItems: number;
  lowStock: number;
  criticalStock: number;
  totalValue: number;
}

// New interfaces for raw material operations
export interface CreateRawMaterialRequest {
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  unit: string;
  category: string;
  supplier?: string;
}

export interface UpdateRawMaterialRequest {
  name?: string;
  sku?: string;
  minStock?: number;
  price?: number;
  unit?: string;
  category?: string;
  supplier?: string;
}