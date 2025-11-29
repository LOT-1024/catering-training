import React from "react";
import { Trash2, Edit2 } from "lucide-react";
import { type Menu, type RawMaterial } from "../types";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface MenuListProps {
  menus: Menu[];
  materials: RawMaterial[];
  onEdit: (menu: Menu) => void;
  onDelete: (id: number) => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  menus,
  materials,
  onEdit,
  onDelete,
}) => {
  const getMaterialName = (materialId: number) => {
    const material = materials.find((m) => m.id === materialId);
    return material?.name || "Unknown Material";
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menus.map((menu) => (
          <Card key={menu.id} className="hover:border-accent transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-foreground font-semibold text-sm">
                    {menu.name}
                  </h3>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">
                    {menu.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      menu.available
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {menu.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {menu.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-secondary p-3 rounded">
                <p className="text-xs text-muted-foreground">Selling Price</p>
                <p className="text-accent font-semibold">
                  Rp {menu.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Ingredients:
                </p>
                <div className="bg-secondary rounded p-2 max-h-24 overflow-y-auto">
                  <ul className="text-xs space-y-1">
                    {menu.ingredients.map((ing, idx) => (
                      <li key={idx} className="text-foreground">
                        • {getMaterialName(ing.materialId)} - {ing.amount}{" "}
                        {ing.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(menu)}
                  className="flex-1 text-xs flex items-center justify-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(menu.id)}
                  className="flex-1 text-xs flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {menus.length === 0 && (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <p>No menus created yet</p>
        </div>
      )}
    </div>
  );
};
