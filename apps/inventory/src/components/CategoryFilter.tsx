import React from 'react';
import { Button } from './ui/Button';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selected, 
  onSelect 
}) => {
  return (
    <div className="border-b border-border bg-card px-6 py-4 flex gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "primary" : "secondary"}
          onClick={() => onSelect(category)}
          className="px-4 py-2"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};