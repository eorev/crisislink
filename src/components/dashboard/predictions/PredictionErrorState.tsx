
import React from 'react';
import { Alert, AlertCircle, AlertDescription, AlertTitle, AlertTriangle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface PredictionErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

const PredictionErrorState = ({ error, onRetry }: PredictionErrorStateProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default PredictionErrorState;
