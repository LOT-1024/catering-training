// pages/Home.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { StatsPanel } from '../components/StatsPanel';
import { CategoryFilter } from '../components/CategoryFilter';
import { InventoryGrid } from '../components/InventoryGrid';
import { StockUpdateModal } from '../components/StockUpdateModal';
import { MaterialEditModal } from '../components/MaterialEditModal';
import { AddMaterialModal } from '../components/AddMaterialModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal'; 
import { useInventory } from '../hooks/useInventory';
import { AlertCircle, Utensils, Plus } from 'lucide-react';
import { type RawMaterial } from '../types';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const {
    materials,
    stats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    updateMaterialStock,
    updateMaterial,
    createRawMaterial,
    deleteMaterial,
    loading,
    error,
  } = useInventory();

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Add this state
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleUpdateStockClick = (id: number) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      setSelectedMaterial(material);
      setStockModalOpen(true);
    }
  };

  const handleEditClick = (id: number) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      setSelectedMaterial(material);
      setEditModalOpen(true);
    }
  };

  // Updated delete handler with modal
  const handleDeleteClick = (id: number) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      setSelectedMaterial(material);
      setDeleteModalOpen(true);
    }
  };

  // Handle actual deletion after confirmation
  const handleConfirmDelete = async () => {
    if (!selectedMaterial) return;

    setDeleteLoading(selectedMaterial.id);
    try {
      await deleteMaterial(selectedMaterial.id);
      setDeleteModalOpen(false);
      setSelectedMaterial(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete material');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleUpdateStock = (id: number, newStock: number) => {
    updateMaterialStock(id, newStock);
    setStockModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleUpdateMaterial = (id: number, updates: Partial<RawMaterial>) => {
    updateMaterial(id, updates);
    setEditModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleAddMaterial = async (materialData: any) => {
    try {
      await createRawMaterial(materialData);
      setAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add material:', err);
    }
  };

  const handleCloseModals = () => {
    setStockModalOpen(false);
    setEditModalOpen(false);
    setAddModalOpen(false);
    setDeleteModalOpen(false); // Add this
    setSelectedMaterial(null);
  };

  // Add loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading inventory...</p>
        </div>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-destructive">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load inventory</h3>
          <p className="text-sm mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
            <p className="text-muted-foreground mt-1">{materials.length} items in stock</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Material
          </button>
        </div>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <StatsPanel stats={stats} />
      <CategoryFilter 
        categories={categories} 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
      />
      <InventoryGrid 
        items={materials} 
        onUpdateStock={handleUpdateStockClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        deleteLoading={deleteLoading}
      />
      
      <StockUpdateModal
        item={selectedMaterial}
        isOpen={stockModalOpen}
        onClose={handleCloseModals}
        onUpdateStock={handleUpdateStock}
      />
      
      <MaterialEditModal
        material={selectedMaterial}
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        onUpdateMaterial={handleUpdateMaterial}
      />

      <AddMaterialModal
        isOpen={addModalOpen}
        onClose={handleCloseModals}
        onAddMaterial={handleAddMaterial}
      />

      {/* Add the delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        title="Delete Material"
        message={`Are you sure you want to delete "${selectedMaterial?.name}"? This action cannot be undone.`}
        confirmText="Delete Material"
        loading={deleteLoading !== null}
      />

      <div className="fixed bottom-6 right-6">
        <Link to="/menu">
          <button className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Manage Menus
          </button>
        </Link>
      </div>
    </>
  );
};