
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { ResourceCategory } from './ResourceData';

interface ResourceDetailDialogProps {
  resource: ResourceCategory;
  trigger?: React.ReactNode;
}

const ResourceDetailDialog = ({ resource, trigger }: ResourceDetailDialogProps) => {
  const getStatusColor = () => {
    if (resource.status === 'warning') return 'text-amber-600';
    if (resource.positiveChange) return 'text-emerald-600';
    return 'text-red-600';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-crisisBlue-600">
            Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="p-2 bg-white rounded-full shadow-sm">
              {resource.icon}
            </span>
            {resource.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information about current supplies and distribution
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-bold">{resource.totalAmount.toLocaleString()} {resource.unit}</h3>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {resource.positiveChange ? '+' : '-'}{resource.recentChange} {resource.unit}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Distribution Status</span>
              <span className={resource.status === 'warning' ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
                {resource.status === 'warning' ? 'Needs Attention' : 'Normal'}
              </span>
            </div>
            <Progress value={resource.status === 'warning' ? 65 : 85} 
              className={`h-2 ${resource.status === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'}`}
              indicatorClassName={resource.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Active Shelters</p>
              <p className="font-semibold">{resource.shelters}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Alert Conditions</p>
              <p className="font-semibold">{resource.alerts}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg mt-4">
            <p className="text-xs text-gray-500 mb-1">Supply Distribution</p>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between">
                <span>Northern Region</span>
                <span className="font-medium">{Math.round(resource.totalAmount * 0.3).toLocaleString()} {resource.unit}</span>
              </li>
              <li className="flex justify-between">
                <span>Southern Region</span>
                <span className="font-medium">{Math.round(resource.totalAmount * 0.25).toLocaleString()} {resource.unit}</span>
              </li>
              <li className="flex justify-between">
                <span>Eastern Region</span>
                <span className="font-medium">{Math.round(resource.totalAmount * 0.2).toLocaleString()} {resource.unit}</span>
              </li>
              <li className="flex justify-between">
                <span>Western Region</span>
                <span className="font-medium">{Math.round(resource.totalAmount * 0.25).toLocaleString()} {resource.unit}</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDetailDialog;
