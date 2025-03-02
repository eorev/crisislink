
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin } from 'lucide-react';
import { formatLastUpdated, getUniqueLocations } from './PredictionUtils';
import { DisasterPrediction } from '@/lib/ai/gemini';

interface PredictionHeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  zipCode?: string;
  predictions?: DisasterPrediction[];
}

const PredictionHeader = ({ 
  lastUpdated, 
  isLoading, 
  onRefresh, 
  zipCode,
  predictions
}: PredictionHeaderProps) => {
  const locations = getUniqueLocations(predictions);
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Disaster Predictions</h2>
        <div className="flex flex-col">
          <p className="text-gray-600">
            AI-powered analysis of potential disaster risks
            {zipCode && (
              <span className="ml-1">for zip code <span className="font-medium">{zipCode}</span></span>
            )}
          </p>
          {locations.length > 0 && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{locations.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {formatLastUpdated(lastUpdated)}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
        </Button>
      </div>
    </div>
  );
};

export default PredictionHeader;
