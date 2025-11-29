// components/AddMaterialModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMaterial: (materialData: any) => Promise<void>;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onAddMaterial
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    minStock: '',
    unit: '',
    category: '',
    supplier: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onAddMaterial({
        name: formData.name,
        sku: formData.sku,
        price: Number(formData.price),
        minStock: Number(formData.minStock),
        unit: formData.unit,
        category: formData.category,
        supplier: formData.supplier || 'Default Supplier'
      });

      // Reset form and close modal on success
      setFormData({
        name: '',
        sku: '',
        price: '',
        minStock: '',
        unit: '',
        category: '',
        supplier: ''
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add material');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-border rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Add New Material
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <Input
            label="Material Name *"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Arabica Coffee Beans"
            required
            disabled={loading}
          />

          <Input
            label="SKU *"
            type="text"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="e.g., CB-001"
            required
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (Rp) *"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              min="0"
              step="1000"
              placeholder="0"
              required
              disabled={loading}
            />

            <Input
              label="Min Stock *"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleChange('minStock', e.target.value)}
              min="0"
              placeholder="0"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Unit *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full bg-white dark:bg-black border border-input rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={loading}
              >
                <option value="">Select unit</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                <option value="pack">pack</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-white dark:bg-black border border-input rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={loading}
              >
                <option value="">Select category</option>
                <option value="Coffee Beans">Coffee Beans</option>
                <option value="Milk & Cream">Milk & Cream</option>
                <option value="Syrups & Sauces">Syrups & Sauces</option>
                <option value="Bakery">Bakery</option>
                <option value="Fruits">Fruits</option>
                <option value="Tea">Tea</option>
                <option value="Sweeteners">Sweeteners</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <Input
            label="Supplier"
            type="text"
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            placeholder="e.g., Local Supplier"
            disabled={loading}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Material'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};