import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/lib/env';

// Log the API key (masked for security)
console.log('Gemini API Key loaded:', env.GEMINI_API_KEY ? 'API key is set' : 'API key is missing');

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

// Get the generative model - using the latest model name
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Mock prediction data to use as fallback
const mockPredictions: PredictionResponse = {
  predictions: [
    {
      disaster_type: "Flood",
      location: "Riverside County",
      probability: 0.85,
      severity: "High",
      timeframe: "Next 24-48 hours",
      details: "Historical flood patterns combined with current heavy rainfall forecasts indicate high probability of flooding in low-lying areas."
    },
    {
      disaster_type: "Wildfire",
      location: "Mountain Ridge",
      probability: 0.7,
      severity: "Medium",
      timeframe: "3-5 days",
      details: "High temperatures, low humidity, and strong winds create favorable conditions for wildfires. Previous incidents in similar conditions suggest medium risk."
    },
    {
      disaster_type: "Hurricane",
      location: "Coastal City",
      probability: 0.6,
      severity: "High",
      timeframe: "5-7 days",
      details: "Weather patterns indicate potential hurricane formation. Historical data suggests high severity if it makes landfall."
    }
  ],
  summary: "Multiple disaster risks detected across the region. Riverside County faces imminent flooding risk, while Mountain Ridge and Coastal City face medium-term threats from wildfires and hurricanes respectively."
};

// Function to analyze disaster data and generate predictions
export async function analyzePredictions(
  historicalData: HistoricalDisasterData[],
  forecastData: WeatherForecastData[]
): Promise<PredictionResponse> {
  try {
    // Check if API key is available
    if (!env.GEMINI_API_KEY) {
      console.warn('No Gemini API key found. Using mock prediction data.');
      return mockPredictions;
    }

    const prompt = `
      Analyze the following historical disaster data and weather forecast data to predict potential disasters:
      
      Historical Disaster Data:
      ${JSON.stringify(historicalData, null, 2)}
      
      Weather Forecast Data:
      ${JSON.stringify(forecastData, null, 2)}
      
      Based on this data, provide a structured analysis of potential disaster risks in the following JSON format:
      {
        "predictions": [
          {
            "disaster_type": "string", // e.g., "Flood", "Hurricane", "Wildfire", etc.
            "location": "string", // affected area
            "probability": number, // between 0 and 1
            "severity": "Low" | "Medium" | "High",
            "timeframe": "string", // e.g., "Next 24-48 hours", "3-5 days"
            "details": "string" // brief explanation of the prediction
          }
        ],
        "summary": "string" // brief overall summary of the predictions
      }
      
      Only respond with the JSON, no additional text.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Gemini response');
    }
    
    return JSON.parse(jsonMatch[0]) as PredictionResponse;
  } catch (error) {
    console.error('Error analyzing predictions with Gemini:', error);
    
    // Use mock data as fallback
    console.warn('Using mock prediction data due to API error.');
    return mockPredictions;
  }
} 