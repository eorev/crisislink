
import StatCard from './StatCard';
import { ReactNode } from 'react';

interface StatItem {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: ReactNode;
}

interface StatsGridProps {
  stats: StatItem[];
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <StatCard 
          key={i}
          name={stat.name}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
          delay={i * 100}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
