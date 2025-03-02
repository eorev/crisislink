
import React, { useState, useEffect, useCallback, memo } from 'react';
import { PredictionResponse } from '@/lib/ai/gemini';
import { getHistoricalDisasterData } from '@/lib/services/disasterDataService';
import { analyzePredictions } from '@/lib/ai/gemini';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Import the smaller components we created
import PredictionHeader from './predictions/PredictionHeader';
import PredictionCard from './predictions/PredictionCard';
import PredictionSummary from './predictions/PredictionSummary';
import PredictionErrorState from './predictions/PredictionErrorState';
import NoZipCodeAlert from './predictions/NoZipCodeAlert';
import PredictionLoadingState from './predictions/PredictionLoadingState';
import NoPredictionsState from './predictions/NoPredictionsState';
import { PREDICTIONS_CACHE, CACHE_TTL_MS } from './predictions/PredictionTypes';

const DisasterPredictions = () => {
    const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { profile } = useAuth();
    const { toast } = useToast();
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    
    const cacheKey = `predictions_${profile?.area_code || 'default'}`;

    const fetchPredictions = useCallback(async (forceRefresh = false) => {
        try {
            const now = Date.now();
            const cachedData = PREDICTIONS_CACHE[cacheKey];
            
            if (!forceRefresh && 
                cachedData && 
                (now - cachedData.timestamp < CACHE_TTL_MS) &&
                cachedData.zipCode === profile?.area_code) {
                console.log('Using cached predictions data');
                setPredictions(cachedData.data);
                setLastUpdated(new Date(cachedData.timestamp));
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            setError(null);

            const historicalData = await getHistoricalDisasterData();
            
            const userZipCode = profile?.area_code;
            console.log('Fetching predictions with zip code:', userZipCode);

            const predictionResults = await analyzePredictions(
                historicalData,
                userZipCode
            );

            console.log('Prediction results:', predictionResults);

            PREDICTIONS_CACHE[cacheKey] = {
                data: predictionResults,
                timestamp: now,
                zipCode: userZipCode
            };

            setPredictions(predictionResults);
            setLastUpdated(new Date());

            if (forceRefresh) {
                toast({
                    title: "Predictions updated",
                    description: `Successfully fetched disaster predictions${userZipCode ? ` for zip code ${userZipCode}` : ''}.`,
                    variant: "default",
                });
            }
        } catch (err) {
            console.error('Error fetching predictions:', err);

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

            if (forceRefresh) {
                toast({
                    title: "Error updating predictions",
                    description: "There was a problem fetching the latest predictions.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [profile?.area_code, toast, cacheKey]);

    useEffect(() => {
        fetchPredictions(false);
    }, [profile?.area_code]);

    const handleRefresh = () => {
        fetchPredictions(true);
    };

    return (
        <div className="space-y-6">
            <PredictionHeader 
                lastUpdated={lastUpdated}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                zipCode={profile?.area_code}
                predictions={predictions?.predictions}
            />

            {!profile?.area_code && <NoZipCodeAlert />}

            {isLoading ? (
                <PredictionLoadingState />
            ) : error ? (
                <PredictionErrorState error={error} onRetry={() => fetchPredictions(false)} />
            ) : predictions && predictions.predictions.length > 0 ? (
                <>
                    <PredictionSummary summary={predictions.summary} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictions.predictions.map((prediction, index) => (
                            <PredictionCard key={index} prediction={prediction} />
                        ))}
                    </div>
                </>
            ) : (
                <NoPredictionsState />
            )}
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(DisasterPredictions);
