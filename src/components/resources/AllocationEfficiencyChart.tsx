
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from 'recharts';

interface AllocationEfficiencyChartProps {
  data: Array<{
    name: string;
    efficiency: number;
    target: number;
  }>;
}

const AllocationEfficiencyChart = ({ data }: AllocationEfficiencyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation Efficiency</CardTitle>
        <CardDescription>
          Distribution efficiency by region compared to target
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="efficiency" name="Current Efficiency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            <Area type="monotone" dataKey="target" name="Target Efficiency" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AllocationEfficiencyChart;
