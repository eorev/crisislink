
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

  // Fixed the shelterDistribution data to match the expected type for ShelterCoverageChart
  const shelterCoverageData = [
    { name: 'Shelter A', value: 80, color: '#0088FE' },
    { name: 'Shelter B', value: 65, color: '#00C49F' },
    { name: 'Shelter C', value: 90, color: '#FFBB28' },
    { name: 'Shelter D', value: 50, color: '#FF8042' },
    { name: 'Shelter E', value: 75, color: '#8884d8' }
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
        <ShelterCoverageChart data={shelterCoverageData} />
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
