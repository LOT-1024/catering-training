// components/InventoryCard.tsx
import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react'; // Add Trash2 icon
import { type RawMaterial } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface InventoryCardProps {
  item: RawMaterial;
  onUpdateStock?: (id: number, newStock: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void; // Add this
  deleteLoading?: boolean; // Add this
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ 
  item, 
  onUpdateStock, 
  onEdit,
  onDelete, // Add this
  deleteLoading = false // Add this
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-400 bg-red-950";
      case "low":
        return "text-yellow-400 bg-yellow-950";
      default:
        return "text-green-400 bg-green-950";
    }
  };

  const getStockDisplay = () => {
    const percentage = (item.stock / (item.minStock * 2)) * 100;
    return Math.min(percentage, 100);
  };

  const handleUpdateStock = () => {
    onUpdateStock?.(item.id, item.stock);
  };

  const handleEdit = () => {
    onEdit?.(item.id);
  };

  // Add delete handler
  const handleDelete = () => {
    onDelete?.(item.id);
  };

  return (
    <Card className="hover:border-accent transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-foreground font-semibold text-sm">{item.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">SKU: {item.sku}</p>
        </div>
        {item.status !== "normal" && <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Stock Level</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(item.status)}`}>
              {item.stock} {item.unit}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all" 
              style={{ width: `${getStockDisplay()}%` }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-secondary p-2 rounded">
            <p className="text-muted-foreground">Min Stock</p>
            <p className="text-foreground font-semibold">
              {item.minStock} {item.unit}
            </p>
          </div>
          <div className="bg-secondary p-2 rounded">
            <p className="text-muted-foreground">Price</p>
            <p className="text-accent font-semibold">Rp {item.price.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="secondary" 
            className="flex-1 text-xs"
            onClick={handleUpdateStock}
          >
            Update Stock
          </Button>
          <Button 
            className="flex-1 text-xs"
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>

        {/* Add delete button */}
        <Button 
          variant="danger" 
          className="w-full text-xs flex items-center justify-center gap-1"
          onClick={handleDelete}
          disabled={deleteLoading}
        >
          <Trash2 className="h-3 w-3" />
          {deleteLoading ? 'Deleting...' : 'Delete Material'}
        </Button>
      </div>
    </Card>
  );
};