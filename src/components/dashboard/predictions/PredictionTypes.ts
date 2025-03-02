
import { DisasterPrediction, PredictionResponse } from '@/lib/ai/gemini';

export interface CachedPredictions {
    data: PredictionResponse;
    timestamp: number;
    zipCode: string | undefined;
}

export const PREDICTIONS_CACHE: Record<string, CachedPredictions> = {};
export const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache TTL
