// src/hooks/use-transactions.ts
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Transaction, CartItem, ApiResponse } from '../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Transaction[]> = await apiService.getTransactions();
      
      if (response.success && response.data) {
        setTransactions(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (cart: CartItem[], paymentMethod: 'cash' | 'card' | 'digital') => {
    try {
      setError(null);
      
      const transactionData = {
        items: cart,
        paymentMethod,
      };

      const response: ApiResponse<Transaction> = await apiService.createTransaction(transactionData);
      
      if (response.success && response.data) {
        const newTransaction = response.data;
        setTransactions(prev => [newTransaction, ...prev]);
        return newTransaction;
      } else {
        throw new Error(response.error || 'Failed to create transaction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
      console.error('Error creating transaction:', err);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    refreshTransactions: loadTransactions,
  };
}