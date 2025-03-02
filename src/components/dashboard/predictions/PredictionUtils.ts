
import { DisasterPrediction } from '@/lib/ai/gemini';
import { ReactNode } from 'react';
import { AlertCircle, Droplets, ThermometerSun, Wind } from 'lucide-react';

/**
 * Formats the last updated timestamp into a human-readable string
 */
export const formatLastUpdated = (lastUpdated: Date | null): string => {
  if (!lastUpdated) return '';

  const now = new Date();
  const diffMs = now.getTime() - lastUpdated.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

/**
 * Returns the appropriate icon for a disaster type
 */
export const getDisasterIcon = (disasterType: string): ReactNode => {
  const type = disasterType.toLowerCase();
  if (type.includes('flood') || type.includes('water')) return <Droplets className="h-5 w-5 text-blue-500" />;
  if (type.includes('fire') || type.includes('wildfire') || type.includes('heat')) return <ThermometerSun className="h-5 w-5 text-red-500" />;
  if (type.includes('hurricane') || type.includes('storm') || type.includes('wind') || type.includes('surge')) return <Wind className="h-5 w-5 text-indigo-500" />;
  return <AlertCircle className="h-5 w-5 text-gray-500" />;
};

/**
 * Returns the appropriate CSS color class for a severity level
 */
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-amber-100 text-amber-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Extract unique locations from predictions
 */
export const getUniqueLocations = (predictions: DisasterPrediction[] | undefined): string[] => {
  if (!predictions) return [];
  const locations = predictions.map(p => p.location);
  return [...new Set(locations)];
};
