
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

interface ShelterCoverageChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const ShelterCoverageChart = ({ data }: ShelterCoverageChartProps) => {
  return (
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
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => Number(value).toLocaleString()} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ShelterCoverageChart;
