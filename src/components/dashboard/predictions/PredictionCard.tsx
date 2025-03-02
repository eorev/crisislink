
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisasterPrediction } from '@/lib/ai/gemini';
import { getDisasterIcon, getSeverityColor } from './PredictionUtils';

interface PredictionCardProps {
  prediction: DisasterPrediction;
}

const PredictionCard = ({ prediction }: PredictionCardProps) => {
  return (
    <Card className="border border-gray-200 hover:border-crisisBlue-300 transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getDisasterIcon(prediction.disaster_type)}
            <CardTitle className="text-lg font-semibold text-gray-900">
              {prediction.disaster_type}
            </CardTitle>
          </div>
          <Badge className={getSeverityColor(prediction.severity)}>
            {prediction.severity} Risk
          </Badge>
        </div>
        <CardDescription className="text-gray-600">
          {prediction.location} • {prediction.timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{prediction.details}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-crisisBlue-600 h-1.5 rounded-full"
            style={{ width: `${prediction.probability * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Probability: {Math.round(prediction.probability * 100)}%
        </p>
      </CardFooter>
    </Card>
  );
};

export default PredictionCard;
