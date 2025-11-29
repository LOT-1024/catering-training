import React from 'react';
import { Header } from '../components/Header';
import { ThemeProvider } from '../hooks/useTheme';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
};