
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

const trendData = [
  { name: 'Jan', Food: 10050, Water: 25000, Medical: 2800, Power: 48, Shelter: 1200 },
  { name: 'Feb', Food: 12300, Water: 27800, Medical: 3200, Power: 55, Shelter: 1450 },
  { name: 'Mar', Food: 13750, Water: 30250, Medical: 3800, Power: 65, Shelter: 1650 },
  { name: 'Apr', Food: 14500, Water: 29800, Medical: 4100, Power: 59, Shelter: 1750 },
  { name: 'May', Food: 15250, Water: 28750, Medical: 4320, Power: 62, Shelter: 1875 },
];

const ResourceTrendChart = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resource Trend Analysis</CardTitle>
            <CardDescription>
              Monthly change in resource levels across all shelters
            </CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trendData}
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
  );
};

export default ResourceTrendChart;
