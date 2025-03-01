import { HistoricalDisasterData, WeatherForecastData } from '@/lib/ai/gemini';

// Mock historical disaster data
export const getHistoricalDisasterData = async (): Promise<HistoricalDisasterData[]> => {
  // In a real application, this would fetch data from an API or database
  return [
    // Add historical data for Brick, New Jersey (08724)
    {
      id: 1,
      type: 'Hurricane',
      location: 'Brick, New Jersey',
      severity: 'High',
      date: '2012-10-29', // Hurricane Sandy
      casualties: 2,
      damage_cost: 25000000,
      affected_area_size: 75
    },
    {
      id: 2,
      type: 'Flood',
      location: 'Brick, New Jersey',
      severity: 'High',
      date: '2012-10-30', // Flooding from Hurricane Sandy
      casualties: 0,
      damage_cost: 15000000,
      affected_area_size: 50
    },
    {
      id: 3,
      type: 'Severe Storm',
      location: 'Brick, New Jersey',
      severity: 'Medium',
      date: '2018-03-02', // Nor'easter
      casualties: 0,
      damage_cost: 5000000,
      affected_area_size: 30
    },
    {
      id: 4,
      type: 'Coastal Erosion',
      location: 'Brick, New Jersey',
      severity: 'Medium',
      date: '2020-02-10',
      casualties: 0,
      damage_cost: 2000000,
      affected_area_size: 15
    },
    {
      id: 5,
      type: 'Winter Storm',
      location: 'Brick, New Jersey',
      severity: 'Medium',
      date: '2022-01-29',
      casualties: 0,
      damage_cost: 1000000,
      affected_area_size: 40
    },
    // Keep a few other locations for context but with less emphasis
    {
      id: 6,
      type: 'Flood',
      location: 'Newark, Delaware',
      severity: 'Medium',
      date: '2023-09-30',
      casualties: 0,
      damage_cost: 1200000,
      affected_area_size: 20
    },
    {
      id: 7,
      type: 'Flood',
      location: 'Riverside County',
      severity: 'High',
      date: '2023-01-15',
      casualties: 3,
      damage_cost: 2500000,
      affected_area_size: 45
    }
  ];
};

// Mock weather forecast data
export const getWeatherForecastData = async (): Promise<WeatherForecastData[]> => {
  // In a real application, this would fetch data from a weather API
  const today = new Date();
  
  return [
    // Add weather forecast for Brick, New Jersey (08724)
    {
      location: 'Brick, New Jersey',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 12, // Celsius
      precipitation: 70, // Percentage chance
      wind_speed: 35, // km/h
      humidity: 80, // Percentage
      pressure: 1002, // hPa
      alerts: ['Coastal Flood Warning', 'High Wind Advisory', 'Storm Surge Watch']
    },
    {
      location: 'Brick, New Jersey',
      date: new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0],
      temperature: 10,
      precipitation: 80,
      wind_speed: 40,
      humidity: 85,
      pressure: 998,
      alerts: ['Coastal Flood Warning', 'High Wind Advisory', 'Storm Surge Watch']
    },
    // Keep a few other locations for context but with less emphasis
    {
      location: 'Newark, Delaware',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 15,
      precipitation: 40,
      wind_speed: 20,
      humidity: 65,
      pressure: 1008,
      alerts: ['Thunderstorm Watch']
    },
    {
      location: 'Riverside County',
      date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
      temperature: 28,
      precipitation: 10,
      wind_speed: 15,
      humidity: 30,
      pressure: 1015,
      alerts: []
    }
  ];
}; 