
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: ReactNode;
  delay?: number;
}

const StatCard = ({ name, value, change, changeType, icon, delay = 0 }: StatCardProps) => {
  return (
    <Card 
      className="animate-fade-in rounded-xl bg-gray-50 shadow-neumorphic-md border-0" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">
            {name}
          </CardTitle>
          <div className="p-2 rounded-full bg-gray-50 shadow-neumorphic-sm">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center mt-1">
          <span className={`flex items-center ${changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {change} {changeType === 'increase' ? 'more' : 'less'}
            </span>
          </span>
          <span className="text-sm text-gray-500 ml-1">since last week</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
