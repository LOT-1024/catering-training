import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-card border border-border rounded-xl p-4 shadow-sm transition-all ${hover ? 'hover:shadow-md hover:border-accent/50' : ''} ${className}`}>
      {children}
    </div>
  );
};