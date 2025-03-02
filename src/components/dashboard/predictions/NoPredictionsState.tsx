
import React from 'react';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NoPredictionsState = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No predictions</AlertTitle>
      <AlertDescription>
        No disaster predictions are available at this time. Check back later for updates.
      </AlertDescription>
    </Alert>
  );
};

export default NoPredictionsState;
