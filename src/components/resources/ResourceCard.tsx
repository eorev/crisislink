
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
} from 'lucide-react';
import ResourceDetailDialog from './ResourceDetailDialog';
import ResourceActionDialog from './ResourceActionDialog';

interface ResourceCardProps {
  resource: {
    id: number;
    name: string;
    icon: React.ReactNode;
    totalAmount: number;
    unit: string;
    recentChange: string;
    positiveChange: boolean;
    shelters: number;
    alerts: number;
    status: string;
  };
  onResourceUpdated: () => void;
}

const ResourceCard = ({ resource, onResourceUpdated }: ResourceCardProps) => {
  return (
    <Card
      className={`border ${resource.status === 'warning'
        ? 'border-amber-300 bg-amber-50/50'
        : 'border-gray-200'
        }`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-white rounded-full shadow-sm">
            {resource.icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{resource.name}</CardTitle>
            <CardDescription>Distributed across {resource.shelters} shelters</CardDescription>
          </div>
        </div>
        {resource.alerts > 0 && (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{resource.alerts}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{resource.totalAmount.toLocaleString()}</h3>
              <div className={`flex items-center ${resource.positiveChange ? 'text-emerald-600' : 'text-red-600'
                }`}>
                <span className="text-sm font-medium">{resource.recentChange} {resource.unit}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Total {resource.unit} available</p>
          </div>

          <div className="pt-4 pb-2 flex justify-between items-center">
            <div className="space-x-2">
              <ResourceActionDialog 
                resourceId={resource.id}
                resourceName={resource.name}
                totalAmount={resource.totalAmount}
                unit={resource.unit}
                isAdding={true}
                onSuccess={onResourceUpdated}
              />
              
              <ResourceActionDialog 
                resourceId={resource.id}
                resourceName={resource.name}
                totalAmount={resource.totalAmount}
                unit={resource.unit}
                isAdding={false}
                onSuccess={onResourceUpdated}
              />
            </div>
            
            <ResourceDetailDialog 
              resource={resource}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
