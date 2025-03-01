import { 
  Utensils, 
  Droplet, 
  Heart, 
  Battery, 
  Package 
} from 'lucide-react';
import React from 'react';

export interface ResourceCategory {
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
}

export const createResourceCategoryData = (): ResourceCategory[] => [
  {
    id: 1,
    name: 'Food Supplies',
    icon: React.createElement(Utensils, { className: "h-5 w-5 text-emerald-600" }),
    totalAmount: 15250,
    unit: 'meals',
    recentChange: '+1200',
    positiveChange: true,
    shelters: 12,
    alerts: 0,
    status: 'normal'
  },
  {
    id: 2,
    name: 'Water Supplies',
    icon: React.createElement(Droplet, { className: "h-5 w-5 text-blue-600" }),
    totalAmount: 28750,
    unit: 'gallons',
    recentChange: '-2450',
    positiveChange: false,
    shelters: 15,
    alerts: 2,
    status: 'warning'
  },
  {
    id: 3,
    name: 'Medical Supplies',
    icon: React.createElement(Heart, { className: "h-5 w-5 text-red-600" }),
    totalAmount: 4320,
    unit: 'kits',
    recentChange: '+350',
    positiveChange: true,
    shelters: 8,
    alerts: 0,
    status: 'normal'
  },
  {
    id: 4,
    name: 'Emergency Power',
    icon: React.createElement(Battery, { className: "h-5 w-5 text-amber-600" }),
    totalAmount: 62,
    unit: 'generators',
    recentChange: '-5',
    positiveChange: false,
    shelters: 9,
    alerts: 1,
    status: 'warning'
  },
  {
    id: 5,
    name: 'Shelter Kits',
    icon: React.createElement(Package, { className: "h-5 w-5 text-indigo-600" }),
    totalAmount: 1875,
    unit: 'kits',
    recentChange: '+125',
    positiveChange: true,
    shelters: 11,
    alerts: 0,
    status: 'normal'
  }
];

export const resourceCategoryData = createResourceCategoryData();

export const getResourceBarChartData = () => resourceCategoryData.map(resource => ({
  name: resource.name.split(' ')[0],
  amount: resource.totalAmount,
  shelters: resource.shelters,
  color: resource.name.includes('Food') ? '#10b981' :
    resource.name.includes('Water') ? '#2563eb' :
      resource.name.includes('Medical') ? '#ef4444' :
        resource.name.includes('Power') ? '#f59e0b' : '#6366f1'
}));

export const getResourceDistributionData = () => resourceCategoryData.map(resource => ({
  name: resource.name.split(' ')[0],
  value: resource.shelters,
  color: resource.name.includes('Food') ? '#10b981' :
    resource.name.includes('Water') ? '#2563eb' :
      resource.name.includes('Medical') ? '#ef4444' :
        resource.name.includes('Power') ? '#f59e0b' : '#6366f1'
}));

export const resourceEfficiencyData = [
  { name: 'North', efficiency: 92, target: 95 },
  { name: 'South', efficiency: 88, target: 95 },
  { name: 'East', efficiency: 96, target: 95 },
  { name: 'West', efficiency: 85, target: 95 },
  { name: 'Central', efficiency: 91, target: 95 },
];
