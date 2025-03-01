
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';

interface ResourceBarChartProps {
  data: Array<{
    name: string;
    amount: number;
    shelters: number;
    color: string;
  }>;
}

const ResourceBarChart = ({ data }: ResourceBarChartProps) => {
  return (
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
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => Number(value).toLocaleString()} />
            <Legend />
            <Bar dataKey="amount" name="Total Available" fill="#6366f1">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResourceBarChart;
