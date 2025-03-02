
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Plus,
  Minus,
  Package,
  TrendingUp,
  TrendingDown,
  Building2,
  Bell
} from 'lucide-react';
import ResourceDetailDialog from './ResourceDetailDialog';
import ResourceActionDialog from './ResourceActionDialog';
import { Resource } from '@/lib/supabase/types';

// This is now a properly typed component prop
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
  // State for managing the resource detail dialog
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Create a properly typed Resource object for passing to ResourceDetailDialog
  const resourceForDetailDialog: Resource = {
    id: resourceData.id,
    name: resourceData.name,
    category: 'Other', // Default category, should be overridden in actual data
    total_amount: resourceData.totalAmount,
    unit: resourceData.unit,
    alert_threshold: 0, // Default value
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    user_id: '' // This will be set by the backend
  };

  return (
    <Card className="overflow-hidden bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {resourceData.icon}
            {resourceData.name}
          </CardTitle>
          {resourceData.status === 'critical' && (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <CardDescription>
          Resource inventory tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold">
              {resourceData.totalAmount.toLocaleString()} <span className="text-sm font-normal text-gray-500">{resourceData.unit}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className={`flex items-center ${resourceData.positiveChange ? 'text-green-600' : 'text-red-600'}`}>
                {resourceData.positiveChange ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {resourceData.recentChange}
              </span>
              <span className="text-gray-500 ml-2">last 30 days</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{resourceData.shelters} shelters</span>
            </div>
            {resourceData.alerts > 0 && (
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-1 text-amber-500" />
                <span>{resourceData.alerts} alerts</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResourceActionDialog
              title="Add Inventory"
              description="Add more inventory to this resource"
              triggerText="Add"
              triggerIcon={<Plus className="h-4 w-4 mr-2" />}
              resourceId={resourceData.id}
              resourceName={resourceData.name}
              resourceUnit={resourceData.unit}
              actionType="add"
              onActionComplete={onResourceUpdated}
            >
              <div className="p-4">
                <p>Form to add inventory would go here</p>
              </div>
            </ResourceActionDialog>

            <ResourceActionDialog
              title="Remove Inventory"
              description="Remove inventory from this resource"
              triggerText="Remove"
              triggerIcon={<Minus className="h-4 w-4 mr-2" />}
              resourceId={resourceData.id}
              resourceName={resourceData.name}
              resourceUnit={resourceData.unit}
              actionType="remove"
              onActionComplete={onResourceUpdated}
            >
              <div className="p-4">
                <p>Form to remove inventory would go here</p>
              </div>
            </ResourceActionDialog>
            
            {/* Update the ResourceDetailDialog with the required props */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDetailDialogOpen(true)}
            >
              Edit
            </Button>
            
            <ResourceDetailDialog 
              resource={resourceForDetailDialog}
              open={isDetailDialogOpen}
              onOpenChange={setIsDetailDialogOpen}
              onResourceSaved={onResourceUpdated}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
