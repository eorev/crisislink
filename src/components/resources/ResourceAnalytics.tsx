
import React from 'react';
import ResourceBarChart from './ResourceBarChart';
import ResourceTrendChart from './ResourceTrendChart';
import ShelterCoverageChart from './ShelterCoverageChart';
// Remove the import for AllocationEfficiencyChart since it doesn't exist

const ResourceAnalytics = () => {
  // Sample data for charts
  const resourceDistribution = [
    { name: 'Food', value: 35 },
    { name: 'Water', value: 25 },
    { name: 'Medical', value: 20 },
    { name: 'Shelter', value: 15 },
    { name: 'Power', value: 5 }
  ];

  const shelterDistribution = [
    { name: 'Shelter A', allocated: 80, capacity: 100, needs: 90 },
    { name: 'Shelter B', allocated: 65, capacity: 90, needs: 75 },
    { name: 'Shelter C', allocated: 90, capacity: 95, needs: 85 },
    { name: 'Shelter D', allocated: 50, capacity: 70, needs: 65 },
    { name: 'Shelter E', allocated: 75, capacity: 85, needs: 80 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
        <ResourceBarChart data={resourceDistribution} />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Resource Trends (Last 30 Days)</h3>
        <ResourceTrendChart />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Shelter Resource Coverage</h3>
        <ShelterCoverageChart data={shelterDistribution} />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Resource Requests by Shelter</h3>
        <p className="text-gray-500 text-sm">Showing resource requests from shelters in the last 7 days</p>
        {/* We could add another chart component here in the future */}
        <div className="flex items-center justify-center h-64 text-gray-400">
          No requests data available
        </div>
      </div>
    </div>
  );
};

export default ResourceAnalytics;
