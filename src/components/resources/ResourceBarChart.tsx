
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';

interface ResourceBarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const ResourceBarChart = ({ data }: ResourceBarChartProps) => {
  // Generate colors based on the category name
  const getColorForCategory = (name: string) => {
    switch (name) {
      case 'Food': return '#FF6B6B';
      case 'Water': return '#4ECDC4';
      case 'Medical': return '#1A535C';
      case 'Beds': return '#FFE66D';
      case 'Power': return '#F7B801';
      default: return '#6B5CA5';
    }
  };

  return (
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
        <Bar dataKey="value" name="Total Available">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorForCategory(entry.name)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResourceBarChart;
