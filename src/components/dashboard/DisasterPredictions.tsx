import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, AlertCircle, ThermometerSun, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';
import { DisasterPrediction, PredictionResponse } from '@/lib/ai/gemini';
import { getHistoricalDisasterData } from '@/lib/services/disasterDataService';
import { analyzePredictions } from '@/lib/ai/gemini';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DisasterPredictions = () => {
    const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { profile } = useAuth();
    const { toast } = useToast();
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchPredictions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch historical and forecast data
            const historicalData = await getHistoricalDisasterData();
            // const forecastData = await getWeatherForecastData();

            // Use area_code as zip code
            const userZipCode = profile?.area_code;
            console.log('Fetching predictions with zip code:', userZipCode);

            // Analyze data with Gemini, passing the user's zip code if available
            const predictionResults = await analyzePredictions(
                historicalData,
                userZipCode
            );

            console.log('Prediction results:', predictionResults);

            setPredictions(predictionResults);
            setLastUpdated(new Date());

            // Show success toast
            toast({
                title: "Predictions updated",
                description: `Successfully fetched disaster predictions${userZipCode ? ` for zip code ${userZipCode}` : ''}.`,
                variant: "default",
            });
        } catch (err) {
            console.error('Error fetching predictions:', err);

            // Provide a more specific error message based on the error
            if (err instanceof Error) {
                if (err.message.includes('404')) {
                    setError('The AI model is currently unavailable. This could be due to an API version mismatch or model unavailability.');
                } else if (err.message.includes('API key')) {
                    setError('There was an issue with the API key. Please check your environment configuration.');
                } else {
                    setError(`Failed to generate disaster predictions: ${err.message}`);
                }
            } else {
                setError('Failed to generate disaster predictions. Please try again later.');
            }

            // Show error toast
            toast({
                title: "Error updating predictions",
                description: "There was a problem fetching the latest predictions. Showing fallback data.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [profile?.area_code, toast]); // Add dependencies that the function uses

    useEffect(() => {
        fetchPredictions();
    }, [fetchPredictions]); // Now fetchPredictions is a dependency

    const handleRefresh = () => {
        fetchPredictions();
    };

    // Format the last updated time
    const formatLastUpdated = () => {
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

    // Helper function to get the appropriate icon for a disaster type
    const getDisasterIcon = (disasterType: string) => {
        const type = disasterType.toLowerCase();
        if (type.includes('flood') || type.includes('water')) return <Droplets className="h-5 w-5 text-blue-500" />;
        if (type.includes('fire') || type.includes('wildfire') || type.includes('heat')) return <ThermometerSun className="h-5 w-5 text-red-500" />;
        if (type.includes('hurricane') || type.includes('storm') || type.includes('wind') || type.includes('surge')) return <Wind className="h-5 w-5 text-indigo-500" />;
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    };

    // Helper function to get the appropriate color for severity
    const getSeverityColor = (severity: string) => {
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

    // Get unique locations from predictions
    const getUniqueLocations = () => {
        if (!predictions?.predictions) return [];

        const locations = predictions.predictions.map(p => p.location);
        return [...new Set(locations)];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Disaster Predictions</h2>
                    <div className="flex flex-col">
                        <p className="text-gray-600">
                            AI-powered analysis of potential disaster risks
                            {profile?.area_code && (
                                <span className="ml-1">for zip code <span className="font-medium">{profile.area_code}</span></span>
                            )}
                        </p>
                        {getUniqueLocations().length > 0 && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{getUniqueLocations().join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {lastUpdated && (
                        <span className="text-xs text-gray-500">
                            Updated {formatLastUpdated()}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </Button>
                </div>
            </div>

            {!profile?.area_code && (
                <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">No zip code set</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        Please set your zip code in the <a href="/settings" className="font-medium underline">Settings</a> page to get location-specific disaster predictions.
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p>{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchPredictions}
                            className="mt-2"
                        >
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            ) : predictions && predictions.predictions.length > 0 ? (
                <>
                    {predictions.summary && (
                        <Alert className="bg-crisisBlue-50 border-crisisBlue-200">
                            <AlertCircle className="h-4 w-4 text-crisisBlue-600" />
                            <AlertTitle className="text-crisisBlue-800">Summary</AlertTitle>
                            <AlertDescription className="text-crisisBlue-700">
                                {predictions.summary}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictions.predictions.map((prediction, index) => (
                            <Card key={index} className="border border-gray-200 hover:border-crisisBlue-300 transition-all hover:shadow-md">
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
                        ))}
                    </div>
                </>
            ) : (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No predictions</AlertTitle>
                    <AlertDescription>
                        No disaster predictions are available at this time. Check back later for updates.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default DisasterPredictions; 