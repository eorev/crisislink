
import React, { memo } from 'react';
import Layout from '@/components/layout/Layout';
import DisasterPredictions from '@/components/dashboard/DisasterPredictions';

// Memoize the DisasterPredictions component to avoid unnecessary re-renders
const MemoizedDisasterPredictions = memo(DisasterPredictions);

const Predictions = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <MemoizedDisasterPredictions />
      </div>
    </Layout>
  );
};

export default Predictions;
