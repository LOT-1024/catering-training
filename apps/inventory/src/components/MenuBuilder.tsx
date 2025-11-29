// components/MenuBuilder.tsx
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { type Menu, type MenuIngredient, type RawMaterial } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface MenuBuilderProps {
  materials: RawMaterial[];
  onSave: (menu: Omit<Menu, 'id'>) => void;
  onCancel: () => void;
  initialMenu?: Menu | null;
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({ 
  materials, 
  onSave, 
  onCancel, 
  initialMenu 
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [available, setAvailable] = useState(true); // Add this state
  const [ingredients, setIngredients] = useState<MenuIngredient[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [amount, setAmount] = useState("");

  const categories = ["Coffee", "Pastry", "Beverage", "Food", "Snack"];

  // Reset form when initialMenu changes
  useEffect(() => {
    if (initialMenu) {
      setName(initialMenu.name);
      setDescription(initialMenu.description || "");
      setPrice(initialMenu.price.toString());
      setCategory(initialMenu.category);
      setAvailable(initialMenu.available); // Set available state
      setIngredients(initialMenu.ingredients);
    } else {
      // Reset form for new menu
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Coffee");
      setAvailable(true); // Default to available for new menus
      setIngredients([]);
    }
    setSelectedMaterial("");
    setAmount("");
  }, [initialMenu]);

  const handleAddIngredient = () => {
    if (!selectedMaterial || !amount) return;

    const material = materials.find((m) => m.id === Number(selectedMaterial));
    if (!material) return;

    const newIngredient: MenuIngredient = {
      materialId: Number(selectedMaterial),
      amount: Number(amount),
      unit: material.unit,
    };

    setIngredients([...ingredients, newIngredient]);
    setSelectedMaterial("");
    setAmount("");
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name || !price || ingredients.length === 0) {
      alert("Please fill in all required fields and add at least one ingredient");
      return;
    }

    // Include the available property
    onSave({
      name,
      description,
      price: Number(price),
      category,
      available,
      ingredients,
    });
  };

  const getMaterialName = (materialId: number) => {
    return materials.find((m) => m.id === materialId)?.name || "";
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {initialMenu ? "Edit Menu" : "Create New Menu"}
          </h2>

          <div className="space-y-4">
            <Input
              label="Menu Name *"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cappuccino"
            />

            <Input
              label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., With steamed milk"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-black border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-card">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Price (Rp) *"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>

            {/* Add availability toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2"
              />
              <label htmlFor="available" className="text-sm font-medium text-foreground">
                Available for sale
              </label>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-bold text-foreground mb-4">Ingredients *</h3>

              <Card className="p-4 mb-4">
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="flex-1 bg-white dark:bg-black border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select material...</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id} className="bg-white dark:bg-black">
                        {mat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-20 bg-card border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button
                    onClick={handleAddIngredient}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </Card>

              {ingredients.length > 0 && (
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between bg-secondary p-3 rounded text-sm">
                      <div>
                        <p className="text-foreground font-medium">{getMaterialName(ingredient.materialId)}</p>
                        <p className="text-muted-foreground text-xs">
                          {ingredient.amount} {ingredient.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-border">
              <Button onClick={handleSave} className="flex-1">
                {initialMenu ? "Update Menu" : "Save Menu"}
              </Button>
              <Button variant="secondary" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};