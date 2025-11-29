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
  supplier?: string; // Make sure this exists
  lastRestocked?: string;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: MenuIngredient[];
  available: boolean; // This property is required
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