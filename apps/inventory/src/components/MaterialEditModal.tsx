// components/MaterialEditModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type RawMaterial } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface MaterialEditModalProps {
  material: RawMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMaterial: (id: number, updates: Partial<RawMaterial>) => void;
}

export const MaterialEditModal: React.FC<MaterialEditModalProps> = ({
  material,
  isOpen,
  onClose,
  onUpdateMaterial
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    minStock: '',
    unit: '',
    category: ''
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        sku: material.sku,
        price: material.price.toString(),
        minStock: material.minStock.toString(),
        unit: material.unit,
        category: material.category
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material) return;

    onUpdateMaterial(material.id, {
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.price),
      minStock: Number(formData.minStock),
      unit: formData.unit,
      category: formData.category
    });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-border rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Edit Material - {material.name}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Material Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          <Input
            label="SKU"
            type="text"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (Rp)"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              min="0"
              required
            />

            <Input
              label="Min Stock"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleChange('minStock', e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
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
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select category</option>
                <option value="Coffee Beans">Coffee Beans</option>
                <option value="Milk & Cream">Milk & Cream</option>
                <option value="Syrups & Sauces">Syrups & Sauces</option>
                <option value="Bakery">Bakery</option>
                <option value="Fruits">Fruits</option>
                <option value="Other">Other</option>
              </select>
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};