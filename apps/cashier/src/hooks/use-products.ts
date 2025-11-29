// src/hooks/use-products.ts
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Product, ApiResponse } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the function and prevent infinite re-renders
  const loadProducts = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Product[]> = await apiService.getProducts(category);
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't use any external variables

  // Load all products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]); // Now loadProducts is stable

  return {
    products,
    loading,
    error,
    loadProducts,
  };
}