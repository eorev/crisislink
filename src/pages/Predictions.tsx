import React from 'react';
import Layout from '@/components/layout/Layout';
import DisasterPredictions from '@/components/dashboard/DisasterPredictions';

const Predictions = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Disaster Predictions</h1>
          <p className="text-gray-600 mt-2">AI-powered analysis of potential disaster risks based on historical data and weather forecasts</p>
        </div>

        <DisasterPredictions />
      </div>
    </Layout>
  );
};

export default Predictions;
