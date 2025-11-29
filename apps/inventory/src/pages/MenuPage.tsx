// pages/MenuPage.tsx
import React from 'react';
import { MenuList } from '../components/MenuList';
import { MenuBuilder } from '../components/MenuBuilder';
import { useMenus } from '../hooks/useMenus';
import { Plus } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const {
    menus,
    showBuilder,
    editingMenu,
    materials,
    handleAddMenu,
    handleDeleteMenu,
    handleEditMenu,
    handleUpdateMenu, // Add this function
    openBuilder,
    closeBuilder
  } = useMenus();

  const handleSaveMenu = (menuData: any) => {
    if (editingMenu) {
      // If editing an existing menu, call update function
      handleUpdateMenu(editingMenu.id, menuData);
    } else {
      // If no editing menu, create new one
      handleAddMenu(menuData);
    }
  };

  return (
    <>
      {!showBuilder ? (
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Menu Management</h2>
                <p className="text-muted-foreground mt-1">{menus.length} menu items available</p>
              </div>
              <button
                onClick={() => {
                  // Clear any editing state when creating new
                  if (editingMenu) {
                    handleEditMenu(null);
                  }
                  openBuilder();
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create New Menu
              </button>
            </div>
          </div>
          <MenuList
            menus={menus}
            materials={materials}
            onEdit={handleEditMenu}
            onDelete={handleDeleteMenu}
          />
        </div>
      ) : (
        <MenuBuilder
          materials={materials}
          onSave={handleSaveMenu} // Use the new handler
          onCancel={closeBuilder}
          initialMenu={editingMenu}
        />
      )}
    </>
  );
};