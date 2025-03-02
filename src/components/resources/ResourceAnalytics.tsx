
import React from 'react';
import ResourceBarChart from './ResourceBarChart';
import ShelterCoverageChart from './ShelterCoverageChart';
import AllocationEfficiencyChart from './AllocationEfficiencyChart';
import ResourceTrendChart from './ResourceTrendChart';
import { getResourceBarChartData, getResourceDistributionData, resourceEfficiencyData } from './ResourceData';

interface ResourceAnalyticsProps {
  analyticsRef: React.RefObject<HTMLDivElement>;
}

const ResourceAnalytics = ({ analyticsRef }: ResourceAnalyticsProps) => {
  // Transform data to match expected props
  const barChartData = getResourceBarChartData().map(item => ({
    name: item.name,
    value: item.amount
  }));

  const allocationData = resourceEfficiencyData.map(item => ({
    name: item.name,
    allocated: item.efficiency,
    capacity: 100,
    needs: item.target
  }));

  return (
    <div ref={analyticsRef} className="pt-10 pb-12">
      <div className="border-b border-gray-200 mb-12">
        <h2 className="text-2xl font-bold mb-6">Resource Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResourceBarChart data={barChartData} />
        <ShelterCoverageChart data={getResourceDistributionData()} />
        <AllocationEfficiencyChart data={allocationData} />
        <ResourceTrendChart />
      </div>
    </div>
  );
};

export default ResourceAnalytics;
