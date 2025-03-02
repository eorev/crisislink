
import React from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from 'recharts';

interface AllocationEfficiencyChartProps {
  data: Array<{
    name: string;
    allocated: number;
    capacity: number;
    needs: number;
  }>;
}

const AllocationEfficiencyChart = ({ data }: AllocationEfficiencyChartProps) => {
  // Convert the data format for display
  const chartData = data.map(item => ({
    name: item.name,
    efficiency: Math.round((item.allocated / item.capacity) * 100),
    target: Math.round((item.needs / item.capacity) * 100)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="efficiency" name="Current Efficiency %" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
        <Area type="monotone" dataKey="target" name="Target Efficiency %" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AllocationEfficiencyChart;
