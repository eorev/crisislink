import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, AlertCircle, ThermometerSun, Wind, Droplets } from 'lucide-react';
import { DisasterPrediction, PredictionResponse } from '@/lib/ai/gemini';
import { getHistoricalDisasterData, getWeatherForecastData } from '@/lib/services/disasterDataService';
import { analyzePredictions } from '@/lib/ai/gemini';
import { Button } from '@/components/ui/button';

const DisasterPredictions = () => {
    const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPredictions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch historical and forecast data
            const historicalData = await getHistoricalDisasterData();
            const forecastData = await getWeatherForecastData();

            // Analyze data with Gemini
            const predictionResults = await analyzePredictions(historicalData, forecastData);
            setPredictions(predictionResults);
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPredictions();
    }, []);

    // Helper function to get the appropriate icon for a disaster type
    const getDisasterIcon = (disasterType: string) => {
        const type = disasterType.toLowerCase();
        if (type.includes('flood')) return <Droplets className="h-5 w-5 text-blue-500" />;
        if (type.includes('fire') || type.includes('wildfire')) return <ThermometerSun className="h-5 w-5 text-red-500" />;
        if (type.includes('hurricane') || type.includes('storm')) return <Wind className="h-5 w-5 text-indigo-500" />;
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900">Disaster Predictions</h2>
                <p className="text-gray-600">AI-powered analysis of potential disaster risks</p>
            </div>

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