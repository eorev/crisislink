
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';
import ResourceDetailDialog from './ResourceDetailDialog';
import ResourceActionDialog from './ResourceActionDialog';
import { Resource } from '@/lib/supabase/types';

interface ResourceCardProps {
  resourceData: {
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

const ResourceCard = ({ resourceData, onResourceUpdated }: ResourceCardProps) => {
  // Create a properly typed Resource object for passing to ResourceDetailDialog
  const resourceForDetailDialog: Resource = {
    id: resourceData.id,
    name: resourceData.name,
    category: resourceData.name.includes('Food') ? 'Food' : 
             resourceData.name.includes('Water') ? 'Water' : 
             resourceData.name.includes('Medical') ? 'Medical' :
             resourceData.name.includes('Beds') ? 'Beds' :
             resourceData.name.includes('Power') ? 'Power' : 'Other',
    total_amount: resourceData.totalAmount,
    unit: resourceData.unit,
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    alert_threshold: Math.floor(resourceData.totalAmount * 0.2),
    user_id: 'system'
  };

  return (
    <Card
      className={`border ${resourceData.status === 'warning'
        ? 'border-amber-300 bg-amber-50/50'
        : 'border-gray-200'
        }`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-white rounded-full shadow-sm">
            {resourceData.icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{resourceData.name}</CardTitle>
            <CardDescription>Distributed across {resourceData.shelters} shelters</CardDescription>
          </div>
        </div>
        {resourceData.alerts > 0 && (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{resourceData.alerts}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{resourceData.totalAmount.toLocaleString()}</h3>
              <div className={`flex items-center ${resourceData.positiveChange ? 'text-emerald-600' : 'text-red-600'
                }`}>
                <span className="text-sm font-medium">{resourceData.recentChange} {resourceData.unit}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Total {resourceData.unit} available</p>
          </div>

          <div className="pt-4 pb-2 flex justify-between items-center">
            <div className="space-x-2">
              <ResourceActionDialog 
                resourceId={resourceData.id}
                resourceName={resourceData.name}
                totalAmount={resourceData.totalAmount}
                unit={resourceData.unit}
                isAdding={true}
                onSuccess={onResourceUpdated}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </ResourceActionDialog>
              
              <ResourceActionDialog 
                resourceId={resourceData.id}
                resourceName={resourceData.name}
                totalAmount={resourceData.totalAmount}
                unit={resourceData.unit}
                isAdding={false}
                onSuccess={onResourceUpdated}
              >
                <Minus className="h-4 w-4 mr-1" />
                Use
              </ResourceActionDialog>
            </div>
            
            <ResourceDetailDialog 
              resource={resourceForDetailDialog}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
