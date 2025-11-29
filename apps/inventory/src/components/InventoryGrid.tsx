// components/InventoryGrid.tsx
import React from 'react';
import { type RawMaterial } from '../types';
import { InventoryCard } from './InventoryCard';

interface InventoryGridProps {
  items: RawMaterial[];
  onUpdateStock?: (id: number, newStock: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void; // Add this
  deleteLoading?: number | null; // Add this
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ 
  items, 
  onUpdateStock, 
  onEdit,
  onDelete, // Add this
  deleteLoading // Add this
}) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <InventoryCard 
            key={item.id} 
            item={item} 
            onUpdateStock={onUpdateStock}
            onEdit={onEdit}
            onDelete={onDelete} // Pass to card
            deleteLoading={deleteLoading === item.id} // Pass loading state
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <p>No items found</p>
        </div>
      )}
    </div>
  );
};