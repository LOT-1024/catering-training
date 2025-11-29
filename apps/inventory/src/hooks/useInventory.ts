// hooks/useInventory.ts
import { useState, useEffect } from "react";
import { type RawMaterial, type Stats } from "../types";
import { inventoryAPI } from "../services/api";

export const useInventory = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load materials on component mount
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await inventoryAPI.getMaterials();
      setMaterials(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  // Create new material
  const createRawMaterial = async (
    materialData: Omit<RawMaterial, "id" | "status" | "lastRestocked">
  ) => {
    try {
      const result = await inventoryAPI.createMaterial(materialData);
      // Add the new material to local state
      setMaterials((prev) => [...prev, result.data]);
      return result.data;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to create material"
      );
    }
  };

  // Delete material
  const deleteMaterial = async (id: number): Promise<void> => {
    try {
      await inventoryAPI.deleteMaterial(id);
      // Remove the material from local state
      setMaterials((prev) => prev.filter((material) => material.id !== id));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete material"
      );
    }
  };

  // Update material stock
  const updateMaterialStock = async (
    id: number,
    newStock: number
  ): Promise<void> => {
    try {
      const result = await inventoryAPI.updateMaterialStock(
        id,
        newStock,
        "set"
      );
      setMaterials((prev) =>
        prev.map((material) => (material.id === id ? result.data : material))
      );
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update stock"
      );
    }
  };

  // Update material
  const updateMaterial = async (
    id: number,
    updates: Partial<RawMaterial>
  ): Promise<void> => {
    try {
      const result = await inventoryAPI.updateMaterial(id, updates);
      setMaterials((prev) =>
        prev.map((material) => (material.id === id ? result.data : material))
      );
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update material"
      );
    }
  };

  // Filter materials based on search and category
  const categories = ["All", ...new Set(materials.map((m) => m.category))];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const stats: Stats = {
    totalItems: materials.length,
    lowStock: materials.filter((m) => m.status === "low").length,
    criticalStock: materials.filter((m) => m.status === "critical").length,
    totalValue: materials.reduce((sum, m) => sum + m.price * m.stock, 0),
  };

  return {
    materials: filteredMaterials,
    stats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    loading,
    error,
    createRawMaterial,
    deleteMaterial,
    updateMaterialStock,
    updateMaterial,
    refreshMaterials: loadMaterials, // Add refresh function
  };
};
