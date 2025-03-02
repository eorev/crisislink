
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/lib/env';

import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

// Log the API key (masked for security)
console.log('Gemini API Key loaded:', env.GEMINI_API_KEY ? 'API key is set' : 'API key is missing');

// Create a custom Google Generative AI provider with explicit API key
const googleAI = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY || env.GEMINI_API_KEY,
});

const model = googleAI('gemini-1.5-pro-latest', {
  structuredOutputs: true,
  useSearchGrounding: true,
});

// Define types for historical and forecast data
export interface HistoricalDisasterData {
  id: number;
  type: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  date: string;
  casualties?: number;
  damage_cost?: number;
  affected_area_size?: number;
}

export interface WeatherForecastData {
  location: string;
  date: string;
  temperature: number;
  precipitation: number;
  wind_speed: number;
  humidity: number;
  pressure: number;
  alerts?: string[];
}

export interface DisasterPrediction {
  disaster_type: string;
  location: string;
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  timeframe: string;
  details: string;
}

export interface PredictionResponse {
  predictions: DisasterPrediction[];
  summary: string;
}

// Initialize the Google Generative AI with the API key
export const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// In-memory prediction cache with TTL
interface PredictionCache {
  data: PredictionResponse;
  timestamp: number;
  zipCode?: string;
}

const PREDICTION_CACHE: Record<string, PredictionCache> = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

// Function to analyze disaster data and generate predictions
export async function analyzePredictions(
  historicalData: HistoricalDisasterData[],
  userZipCode?: string
): Promise<PredictionResponse> {
  try {
    // Create cache key based on inputs
    const historyHash = JSON.stringify(historicalData).length.toString(); // Simple hash
    const cacheKey = `${historyHash}_${userZipCode || 'no_zip'}`;
    
    // Check if we have valid cached data
    const now = Date.now();
    const cachedPrediction = PREDICTION_CACHE[cacheKey];
    
    if (cachedPrediction && (now - cachedPrediction.timestamp < CACHE_TTL)) {
      console.log('Using cached prediction from Gemini API');
      return cachedPrediction.data;
    }
    
    // Check if API key is available
    if (!env.GEMINI_API_KEY) {
      console.warn('No Gemini API key found. Using alternative prediction method.');
      throw new Error('API key is missing');
    }

    // Create a more prominent zip code section in the prompt
    let zipCodeSection = '';
    if (userZipCode) {
      zipCodeSection = `
      USER LOCATION INFORMATION:
      The user is located in zip code ${userZipCode}.
      
      CRITICAL INSTRUCTIONS - READ CAREFULLY:
      1. You MUST ONLY generate predictions for the user's zip code location.
      2. DO NOT include predictions for any other locations that might be in the data.
      3. If the historical or forecast data doesn't contain the user's exact location, use your knowledge to determine what location corresponds to the zip code and generate predictions for that location only.
      4. The predictions should be specific to the types of disasters that are relevant to the user's location based on geography, climate, and historical patterns.
      5. In the summary, explain what location the zip code corresponds to and why the predictions are relevant to that specific area.
      6. If you're not certain about the exact location of the zip code, make your best determination and explain your reasoning.
      7. The response MUST ONLY contain predictions for the user's location, not for any other locations in the data.
      `;
    }

    const prompt = `
      ${zipCodeSection}
      
      Analyze the following historical disaster data and weather forecast data to predict potential disasters:
      
      Historical Disaster Data:
      ${JSON.stringify(historicalData, null, 2)}
      
      Based on this data, provide a structured analysis of potential disaster risks in the following JSON format:
      {
        "predictions": [
          {
            "disaster_type": "string", // e.g., "Flood", "Hurricane", "Wildfire", etc.
            "location": "string", // MUST be the user's location based on zip code
            "probability": number, // between 0 and 1
            "severity": "Low" | "Medium" | "High",
            "timeframe": "string", // e.g., "Next 24-48 hours", "3-5 days"
            "details": "string" // brief explanation of the prediction
          }
        ],
        "summary": "string" // brief overall summary of the predictions for the user's location only
      }
      
      Only respond with the JSON, no additional text.
    `;

    console.log('Sending prompt to Gemini with zip code:', userZipCode);
    
    const result = await generateObject({
      model,
      prompt,
      schema: z.object({
        predictions: z.array(z.object({
          disaster_type: z.string(),
          location: z.string(),
          probability: z.number(),
          severity: z.enum(['Low', 'Medium', 'High']),
          timeframe: z.string(),
          details: z.string(),
        })),
        summary: z.string(),
      })
    });

    const { object } = result;
    
    // Ensure all properties exist and are the correct type
    const predictions = object.predictions.map(p => ({
      disaster_type: p.disaster_type,
      location: p.location,
      probability: p.probability,
      severity: p.severity,
      timeframe: p.timeframe,
      details: p.details
    }));
    
    const parsedResponse: PredictionResponse = {
      predictions,
      summary: object.summary
    };
    
    // Cache the result
    PREDICTION_CACHE[cacheKey] = {
      data: parsedResponse,
      timestamp: now,
      zipCode: userZipCode
    };
    
    console.log('Successfully received predictions from Gemini', parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error('Error analyzing predictions with Gemini:', error);
    throw error; // Re-throw to handle error at call site
  }
}
