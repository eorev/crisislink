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

// Function to analyze disaster data and generate predictions
export async function analyzePredictions(
  historicalData: HistoricalDisasterData[],
  forecastData: WeatherForecastData[],
  userZipCode?: string
): Promise<PredictionResponse> {
  try {
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
      
      Weather Forecast Data:
      ${JSON.stringify(forecastData, null, 2)}
      
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
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to parse JSON from Gemini response:', text);
      throw new Error('Failed to parse JSON from Gemini response');
    }
    
    try {
      const parsedResponse = JSON.parse(jsonMatch[0]) as PredictionResponse;
      console.log('Successfully received predictions from Gemini');
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError, 'Raw text:', jsonMatch[0]);
      throw new Error('Failed to parse JSON from Gemini response');
    }
  } catch (error) {
    console.error('Error analyzing predictions with Gemini:', error);
    
    // Create a dynamic fallback response based on the actual data
    return generateFallbackPredictions(historicalData, forecastData, userZipCode);
  }
}

// Function to generate fallback predictions based on actual data
function generateFallbackPredictions(
  historicalData: HistoricalDisasterData[],
  forecastData: WeatherForecastData[],
  userZipCode?: string
): PredictionResponse {
  // If no zip code is provided, return a generic message
  if (!userZipCode) {
    return {
      predictions: [
        {
          disaster_type: "Unknown",
          location: "Your area",
          probability: 0.50,
          severity: "Medium",
          timeframe: "Unknown",
          details: "Unable to generate specific predictions without location information. Please provide a zip code for more accurate predictions."
        }
      ],
      summary: "Error connecting to AI service. Unable to generate location-specific predictions without a zip code. Please provide your zip code in the settings page."
    };
  }

  // Try to find the location based on the zip code
  let locationName = `Area with zip code ${userZipCode}`;
  const predictions: DisasterPrediction[] = [];
  
  // Analyze the data to find relevant information for the user's location
  // First, try to find the location in the forecast data
  const relevantForecasts = forecastData.filter(forecast => {
    // This is a simplified approach - in a real app, you would use a zip code API
    // to determine the city/location name from the zip code
    return forecast.location.toLowerCase().includes(getLocationFromZip(userZipCode).toLowerCase());
  });
  
  // If we found relevant forecasts, use them to generate predictions
  if (relevantForecasts.length > 0) {
    locationName = relevantForecasts[0].location;
    
    // Check for weather alerts in the forecasts
    const alerts = relevantForecasts.flatMap(forecast => forecast.alerts || []);
    const uniqueAlerts = [...new Set(alerts)];
    
    // Generate predictions based on alerts
    if (uniqueAlerts.length > 0) {
      uniqueAlerts.forEach((alert, index) => {
        const alertLower = alert.toLowerCase();
        let disasterType = "Severe Weather";
        let severity: "Low" | "Medium" | "High" = "Medium";
        let probability = 0.6;
        
        // Determine disaster type and severity based on the alert
        if (alertLower.includes("flood")) {
          disasterType = "Flooding";
          severity = "Medium";
          probability = 0.7;
        } else if (alertLower.includes("hurricane") || alertLower.includes("tropical")) {
          disasterType = "Hurricane";
          severity = "High";
          probability = 0.8;
        } else if (alertLower.includes("storm")) {
          disasterType = "Severe Storm";
          severity = "Medium";
          probability = 0.75;
        } else if (alertLower.includes("wind")) {
          disasterType = "High Winds";
          severity = "Medium";
          probability = 0.65;
        } else if (alertLower.includes("heat")) {
          disasterType = "Heat Wave";
          severity = "Medium";
          probability = 0.7;
        } else if (alertLower.includes("snow") || alertLower.includes("winter")) {
          disasterType = "Winter Storm";
          severity = "Medium";
          probability = 0.7;
        } else if (alertLower.includes("thunder")) {
          disasterType = "Thunderstorms";
          severity = "Low";
          probability = 0.6;
        } else if (alertLower.includes("tornado")) {
          disasterType = "Tornado";
          severity = "High";
          probability = 0.7;
        }
        
        predictions.push({
          disaster_type: disasterType,
          location: locationName,
          probability: probability,
          severity: severity,
          timeframe: "Next 24-72 hours",
          details: `${alert} is in effect for ${locationName}. Take necessary precautions.`
        });
      });
    }
    
    // If no alerts but high precipitation, add a general weather warning
    if (predictions.length === 0) {
      const highPrecipForecasts = relevantForecasts.filter(f => f.precipitation > 50);
      if (highPrecipForecasts.length > 0) {
        predictions.push({
          disaster_type: "Heavy Rain",
          location: locationName,
          probability: 0.6,
          severity: "Low",
          timeframe: "Next 24-48 hours",
          details: `High precipitation forecast for ${locationName}. Be prepared for potential localized flooding.`
        });
      }
    }
  }
  
  // If we still don't have predictions, look at historical data
  if (predictions.length === 0) {
    // Find historical disasters in the same area
    const relevantHistory = historicalData.filter(disaster => {
      return disaster.location.toLowerCase().includes(getLocationFromZip(userZipCode).toLowerCase());
    });
    
    if (relevantHistory.length > 0) {
      locationName = relevantHistory[0].location;
      
      // Group by disaster type and count occurrences
      const disasterTypes = relevantHistory.reduce((acc, disaster) => {
        acc[disaster.type] = (acc[disaster.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Create predictions for the most common disaster types
      Object.entries(disasterTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .forEach(([type, count]) => {
          const probability = Math.min(0.5 + (count / relevantHistory.length) * 0.3, 0.9);
          predictions.push({
            disaster_type: type,
            location: locationName,
            probability: probability,
            severity: "Medium",
            timeframe: "Next 1-2 weeks",
            details: `Based on historical patterns, ${locationName} has experienced ${count} ${type.toLowerCase()} events in the past. Monitor local conditions.`
          });
        });
    }
  }
  
  // If we still don't have predictions, generate generic ones based on the zip code
  if (predictions.length === 0) {
    // Use the first 3 digits of the zip code to determine the general region
    const zipRegion = userZipCode.substring(0, 3);
    
    // Northeast (000-299)
    if (parseInt(zipRegion) <= 299) {
      predictions.push({
        disaster_type: "Winter Storm",
        location: locationName,
        probability: 0.5,
        severity: "Medium",
        timeframe: "Next 1-2 weeks",
        details: `Northeast regions are prone to winter storms and nor'easters. Stay prepared for changing weather conditions.`
      });
    } 
    // Southeast/Gulf Coast (300-399)
    else if (parseInt(zipRegion) <= 399) {
      predictions.push({
        disaster_type: "Hurricane",
        location: locationName,
        probability: 0.4,
        severity: "Medium",
        timeframe: "Hurricane season",
        details: `Southeast coastal areas are vulnerable to hurricanes during hurricane season. Monitor weather updates.`
      });
    }
    // South (400-499)
    else if (parseInt(zipRegion) <= 499) {
      predictions.push({
        disaster_type: "Severe Thunderstorm",
        location: locationName,
        probability: 0.5,
        severity: "Medium",
        timeframe: "Next 1-2 weeks",
        details: `Southern regions often experience severe thunderstorms. Be aware of potential flash flooding and lightning.`
      });
    }
    // Midwest (500-599)
    else if (parseInt(zipRegion) <= 599) {
      predictions.push({
        disaster_type: "Tornado",
        location: locationName,
        probability: 0.3,
        severity: "High",
        timeframe: "Tornado season",
        details: `Midwest regions are part of tornado alley. Stay alert during tornado season and have an emergency plan.`
      });
    }
    // Southwest (600-799)
    else if (parseInt(zipRegion) <= 799) {
      predictions.push({
        disaster_type: "Wildfire",
        location: locationName,
        probability: 0.4,
        severity: "High",
        timeframe: "Fire season",
        details: `Southwest regions are prone to wildfires during dry seasons. Monitor local fire danger levels.`
      });
    }
    // West (800-999)
    else {
      predictions.push({
        disaster_type: "Earthquake",
        location: locationName,
        probability: 0.2,
        severity: "High",
        timeframe: "Unpredictable",
        details: `Western regions are in seismically active zones. Be prepared for earthquakes at any time.`
      });
    }
    
    // Add a second generic prediction based on climate change trends
    predictions.push({
      disaster_type: "Extreme Weather",
      location: locationName,
      probability: 0.3,
      severity: "Medium",
      timeframe: "Ongoing",
      details: `Climate change is increasing the frequency of extreme weather events across all regions. Stay informed about changing weather patterns.`
    });
  }
  
  return {
    predictions: predictions,
    summary: `These predictions for ${locationName} (zip code ${userZipCode}) are based on analysis of available weather forecasts and historical disaster data. This is a fallback analysis due to AI service limitations. For the most accurate information, please check local emergency management sources.`
  };
}

// Helper function to get a location name from a zip code
// This is a simplified version - in a real app, you would use a zip code API
function getLocationFromZip(zipCode: string): string {
  // This is just a very basic mapping for demonstration purposes
  const zipMappings: Record<string, string> = {
    "08724": "Brick, New Jersey",
    "19711": "Newark, Delaware",
    "90210": "Beverly Hills",
    "10001": "New York City",
    "60601": "Chicago",
    "77001": "Houston",
    "94101": "San Francisco",
    "33101": "Miami",
    "98101": "Seattle",
    "20001": "Washington DC"
  };
  
  return zipMappings[zipCode] || "";
} 