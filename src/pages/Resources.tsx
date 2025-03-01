
import React, { useRef } from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// Chart data preparation
const resourceBarChartData = resourceCategoryData.map(resource => ({
  name: resource.name.split(' ')[0], // Just use the first word for cleaner labels
  amount: resource.totalAmount,
  shelters: resource.shelters,
  color: resource.name.includes('Food') ? '#10b981' : 
         resource.name.includes('Water') ? '#2563eb' :
         resource.name.includes('Medical') ? '#ef4444' :
         resource.name.includes('Power') ? '#f59e0b' : '#6366f1'
}));

const resourceDistributionData = resourceCategoryData.map(resource => ({
  name: resource.name.split(' ')[0],
  value: resource.shelters,
  color: resource.name.includes('Food') ? '#10b981' : 
         resource.name.includes('Water') ? '#2563eb' :
         resource.name.includes('Medical') ? '#ef4444' :
         resource.name.includes('Power') ? '#f59e0b' : '#6366f1'
}));

const COLORS = ['#10b981', '#2563eb', '#ef4444', '#f59e0b', '#6366f1'];

const Resources = () => {
  const analyticsRef = useRef<HTMLDivElement>(null);

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            <p className="text-gray-600 mt-2">Track and distribute critical resources across shelters</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={scrollToAnalytics}>
              <BarChart2 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
              Manage Distribution
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
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

        <div ref={analyticsRef} className="pt-10 pb-12">
          <div className="border-b border-gray-200 mb-12">
            <h2 className="text-2xl font-bold mb-6">Resource Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
                <CardDescription>
                  Overview of resources available across shelters
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={resourceBarChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                    <Legend />
                    <Bar dataKey="amount" name="Total Available" fill="#6366f1">
                      {resourceBarChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shelter Coverage</CardTitle>
                <CardDescription>
                  Number of shelters with each resource type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Resource Trend Analysis</CardTitle>
                <CardDescription>
                  Monthly change in resource levels across all shelters
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Jan', Food: 10050, Water: 25000, Medical: 2800, Power: 48, Shelter: 1200 },
                      { name: 'Feb', Food: 12300, Water: 27800, Medical: 3200, Power: 55, Shelter: 1450 },
                      { name: 'Mar', Food: 13750, Water: 30250, Medical: 3800, Power: 65, Shelter: 1650 },
                      { name: 'Apr', Food: 14500, Water: 29800, Medical: 4100, Power: 59, Shelter: 1750 },
                      { name: 'May', Food: 15250, Water: 28750, Medical: 4320, Power: 62, Shelter: 1875 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                    <Legend />
                    <Bar dataKey="Food" name="Food Supplies" fill="#10b981" />
                    <Bar dataKey="Water" name="Water Supplies" fill="#2563eb" />
                    <Bar dataKey="Medical" name="Medical Supplies" fill="#ef4444" />
                    <Bar dataKey="Power" name="Emergency Power" fill="#f59e0b" />
                    <Bar dataKey="Shelter" name="Shelter Kits" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
