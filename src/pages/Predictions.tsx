
import React from 'react';
import Layout from '@/components/layout/Layout';
import DisasterPredictions from '@/components/dashboard/DisasterPredictions';

const Predictions = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <DisasterPredictions />
      </div>
    </Layout>
  );
};

export default Predictions;
