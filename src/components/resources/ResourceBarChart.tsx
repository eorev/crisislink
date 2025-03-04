
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarChartData {
  name: string;
  value: number;
}

interface ResourceBarChartProps {
  data: BarChartData[];
}

// Custom colors for the bars
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#6B5CA5'];

const ResourceBarChart: React.FC<ResourceBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          // Remove defaultProps usage
          tick={{ fontSize: 12 }}
          tickLine={true}
          axisLine={true}
        />
        <YAxis 
          // Remove defaultProps usage
          tick={{ fontSize: 12 }}
          tickLine={true}
          axisLine={true}
        />
        <Tooltip 
          formatter={(value) => [`${value} units`, 'Amount']}
          labelFormatter={(label) => `Resource: ${label}`}
        />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Amount">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResourceBarChart;
