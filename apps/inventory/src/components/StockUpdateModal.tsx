// components/StockUpdateModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type RawMaterial } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface StockUpdateModalProps {
  item: RawMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (id: number, newStock: number) => void;
}

export const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdateStock
}) => {
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (item) {
      setStock(item.stock.toString());
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    const newStock = Number(stock);
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(item.id, newStock);
      onClose();
    }
  };

  const handleQuickUpdate = (change: number) => {
    if (!item) return;
    const currentStock = Number(stock);
    const newStock = Math.max(0, currentStock + change);
    setStock(newStock.toString());
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-border rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Update Stock - {item.name}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Current Stock
            </label>
            <div className="bg-secondary p-3 rounded-lg">
              <p className="text-foreground font-semibold">
                {item.stock} {item.unit}
              </p>
            </div>
          </div>

          <Input
            label="New Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            required
          />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick Adjustments</p>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleQuickUpdate(-10)}
                className="text-xs"
              >
                -10
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleQuickUpdate(-1)}
                className="text-xs"
              >
                -1
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleQuickUpdate(1)}
                className="text-xs"
              >
                +1
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleQuickUpdate(10)}
                className="text-xs"
              >
                +10
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Stock
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};