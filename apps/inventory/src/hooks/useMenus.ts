// hooks/useMenus.ts
import { useState, useEffect } from 'react';
import { type Menu, type RawMaterial } from '../types';
import { menuAPI, inventoryAPI } from '../services/api';

export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both menus and materials in parallel
      const [menusResult, materialsResult] = await Promise.all([
        menuAPI.getMenus(),
        inventoryAPI.getMaterials()
      ]);

      setMenus(menusResult.data);
      setMaterials(materialsResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async (menuData: Omit<Menu, 'id'>) => {
    try {
      const result = await menuAPI.createMenu(menuData);
      setMenus(prev => [...prev, result.data]);
      closeBuilder();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create menu');
    }
  };

  const handleUpdateMenu = (id: number, updatedMenu: Omit<Menu, 'id'>) => {
    setMenus(prev => 
      prev.map(menu => 
        menu.id === id ? { ...updatedMenu, id } : menu
      )
    );
    setEditingMenu(null);
    setShowBuilder(false);
  };


  const handleEditMenu = (menu: Menu | null) => {
    setEditingMenu(menu);
    setShowBuilder(true);
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      await menuAPI.deleteMenu(id);
      setMenus(prev => prev.filter(menu => menu.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete menu');
    }
  };

  const openBuilder = () => {
    setEditingMenu(null);
    setShowBuilder(true);
  };

  const closeBuilder = () => {
    setShowBuilder(false);
    setEditingMenu(null);
  };

  return {
    menus,
    materials,
    showBuilder,
    editingMenu,
    loading,
    error,
    handleAddMenu,
    handleDeleteMenu,
    handleEditMenu,
    handleUpdateMenu,
    openBuilder,
    closeBuilder,
    refreshData: loadData,
  };
};