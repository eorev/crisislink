
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PredictionSummaryProps {
  summary: string | undefined;
}

const PredictionSummary = ({ summary }: PredictionSummaryProps) => {
  if (!summary) return null;
  
  return (
    <Alert className="bg-crisisBlue-50 border-crisisBlue-200">
      <AlertCircle className="h-4 w-4 text-crisisBlue-600" />
      <AlertTitle className="text-crisisBlue-800">Summary</AlertTitle>
      <AlertDescription className="text-crisisBlue-700">
        {summary}
      </AlertDescription>
    </Alert>
  );
};

export default PredictionSummary;
