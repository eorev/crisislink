import { HistoricalDisasterData, WeatherForecastData } from '@/lib/ai/gemini';

// Mock historical disaster data
export const getHistoricalDisasterData = async (): Promise<HistoricalDisasterData[]> => {
  // In a real application, this would fetch data from an API or database
  return [
    {
      id: 1,
      type: 'Flood',
      location: 'Riverside County',
      severity: 'High',
      date: '2023-01-15',
      casualties: 3,
      damage_cost: 2500000,
      affected_area_size: 45
    },
    {
      id: 2,
      type: 'Wildfire',
      location: 'Mountain Ridge',
      severity: 'Medium',
      date: '2023-06-22',
      casualties: 0,
      damage_cost: 1200000,
      affected_area_size: 30
    },
    {
      id: 3,
      type: 'Hurricane',
      location: 'Coastal City',
      severity: 'High',
      date: '2023-09-10',
      casualties: 7,
      damage_cost: 5000000,
      affected_area_size: 120
    },
    {
      id: 4,
      type: 'Earthquake',
      location: 'Valley Region',
      severity: 'Medium',
      date: '2023-11-05',
      casualties: 2,
      damage_cost: 3500000,
      affected_area_size: 25
    },
    {
      id: 5,
      type: 'Flood',
      location: 'Riverside County',
      severity: 'Medium',
      date: '2024-01-20',
      casualties: 1,
      damage_cost: 1800000,
      affected_area_size: 35
    }
  ];
};

// Mock weather forecast data
export const getWeatherForecastData = async (): Promise<WeatherForecastData[]> => {
  // In a real application, this would fetch data from a weather API
  const today = new Date();
  
  return [
    {
      location: 'Riverside County',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 28,
      precipitation: 80,
      wind_speed: 15,
      humidity: 85,
      pressure: 1005,
      alerts: ['Heavy Rain Warning', 'Potential Flash Flood']
    },
    {
      location: 'Mountain Ridge',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 35,
      precipitation: 0,
      wind_speed: 25,
      humidity: 15,
      pressure: 1010,
      alerts: ['Extreme Heat Warning', 'High Fire Danger']
    },
    {
      location: 'Coastal City',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 30,
      precipitation: 60,
      wind_speed: 45,
      humidity: 75,
      pressure: 995,
      alerts: ['Tropical Storm Watch', 'High Wind Warning']
    },
    {
      location: 'Valley Region',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 25,
      precipitation: 10,
      wind_speed: 10,
      humidity: 50,
      pressure: 1015,
      alerts: []
    }
  ];
}; 