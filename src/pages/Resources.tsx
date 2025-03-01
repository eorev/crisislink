
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart2,
  Package,
  Droplet,
  Heart,
  Battery,
  Utensils,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const resourceCategoryData = [
  {
    id: 1,
    name: 'Food Supplies',
    icon: <Utensils className="h-5 w-5 text-emerald-600" />,
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
    icon: <Droplet className="h-5 w-5 text-blue-600" />,
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
    icon: <Heart className="h-5 w-5 text-red-600" />,
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
    icon: <Battery className="h-5 w-5 text-amber-600" />,
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
    icon: <Package className="h-5 w-5 text-indigo-600" />,
    totalAmount: 1875,
    unit: 'kits',
    recentChange: '+125',
    positiveChange: true,
    shelters: 11,
    alerts: 0,
    status: 'normal'
  }
];

const Resources = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            <p className="text-gray-600 mt-2">Track and distribute critical resources across shelters</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <BarChart2 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
              Manage Distribution
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resourceCategoryData.map((resource) => (
            <Card 
              key={resource.id} 
              className={`border ${
                resource.status === 'warning' 
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
                      <div className={`flex items-center ${
                        resource.positiveChange ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {resource.positiveChange 
                          ? <PlusCircle className="h-3 w-3 mr-1" /> 
                          : <MinusCircle className="h-3 w-3 mr-1" />
                        }
                        <span className="text-sm font-medium">{resource.recentChange} {resource.unit}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Total {resource.unit} available</p>
                  </div>
                  
                  <div className="pt-4 pb-2 flex justify-between items-center">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button variant="outline" size="sm">
                        <MinusCircle className="h-4 w-4 mr-1" />
                        Use
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-crisisBlue-600">
                      Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
