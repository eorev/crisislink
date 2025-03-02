
import React from 'react';
import { Alert, AlertDescription, AlertTitle, AlertTriangle } from '@/components/ui/alert';

const NoZipCodeAlert = () => {
  return (
    <Alert className="bg-amber-50 border-amber-200">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">No zip code set</AlertTitle>
      <AlertDescription className="text-amber-700">
        Please set your zip code in the <a href="/settings" className="font-medium underline">Settings</a> page to get location-specific disaster predictions.
      </AlertDescription>
    </Alert>
  );
};

export default NoZipCodeAlert;
