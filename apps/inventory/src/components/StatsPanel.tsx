import React from 'react';
import { AlertCircle, Package, DollarSign } from 'lucide-react';
import { type Stats } from '../types';
import { Card } from './ui/Card';

interface StatsPanelProps {
  stats: Stats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Items" 
            value={stats.totalItems.toString()} 
            icon={Package} 
            color="text-accent" 
          />
          <StatCard 
            title="Low Stock" 
            value={stats.lowStock.toString()} 
            icon={AlertCircle} 
            color="text-yellow-400" 
          />
          <StatCard 
            title="Critical Stock" 
            value={stats.criticalStock.toString()} 
            icon={AlertCircle} 
            color="text-red-400" 
          />
          <StatCard
            title="Total Value"
            value={`Rp ${(stats.totalValue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            color="text-accent"
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color} opacity-50`} />
      </div>
    </Card>
  );
};