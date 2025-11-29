import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-2xl font-bold text-foreground cursor-pointer hover:text-accent transition-colors">
              CafeManager
            </h1>
          </Link>
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Inventory
            </Link>
            <Link 
              to="/menu" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Menus
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};