
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
  return (
    <div ref={analyticsRef} className="pt-10 pb-12">
      <div className="border-b border-gray-200 mb-12">
        <h2 className="text-2xl font-bold mb-6">Resource Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResourceBarChart data={getResourceBarChartData()} />
        <ShelterCoverageChart data={getResourceDistributionData()} />
        <AllocationEfficiencyChart data={resourceEfficiencyData} />
        <ResourceTrendChart />
      </div>
    </div>
  );
};

export default ResourceAnalytics;
