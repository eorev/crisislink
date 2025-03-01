import { HistoricalDisasterData, WeatherForecastData } from '@/lib/ai/gemini';

// Mock historical disaster data
export const getHistoricalDisasterData = async (): Promise<HistoricalDisasterData[]> => {
  // In a real application, this would fetch data from an API or database
  return [
    // Northeast region disasters
    {
      id: 1,
      type: 'Hurricane',
      location: 'New Jersey Coast',
      severity: 'High',
      date: '2012-10-29', // Hurricane Sandy
      casualties: 37,
      damage_cost: 30000000000,
      affected_area_size: 24000
    },
    {
      id: 2,
      type: 'Flood',
      location: 'Newark, Delaware',
      severity: 'Medium',
      date: '2021-09-01', // Hurricane Ida remnants
      casualties: 1,
      damage_cost: 100000000,
      affected_area_size: 500
    },
    {
      id: 3,
      type: 'Winter Storm',
      location: 'Boston, Massachusetts',
      severity: 'High',
      date: '2022-01-29',
      casualties: 3,
      damage_cost: 500000000,
      affected_area_size: 10000
    },
    {
      id: 4,
      type: 'Flood',
      location: 'Philadelphia, Pennsylvania',
      severity: 'Medium',
      date: '2023-07-15',
      casualties: 0,
      damage_cost: 75000000,
      affected_area_size: 300
    },
    
    // Southeast region disasters
    {
      id: 5,
      type: 'Hurricane',
      location: 'Miami, Florida',
      severity: 'High',
      date: '2022-09-28', // Hurricane Ian
      casualties: 149,
      damage_cost: 112000000000,
      affected_area_size: 20000
    },
    {
      id: 6,
      type: 'Tornado',
      location: 'Birmingham, Alabama',
      severity: 'High',
      date: '2023-03-25',
      casualties: 5,
      damage_cost: 250000000,
      affected_area_size: 150
    },
    
    // Midwest region disasters
    {
      id: 7,
      type: 'Tornado',
      location: 'Oklahoma City, Oklahoma',
      severity: 'High',
      date: '2023-05-20',
      casualties: 2,
      damage_cost: 150000000,
      affected_area_size: 75
    },
    {
      id: 8,
      type: 'Flood',
      location: 'St. Louis, Missouri',
      severity: 'Medium',
      date: '2022-07-26',
      casualties: 2,
      damage_cost: 200000000,
      affected_area_size: 500
    },
    
    // West region disasters
    {
      id: 9,
      type: 'Wildfire',
      location: 'Los Angeles County, California',
      severity: 'High',
      date: '2023-08-10',
      casualties: 0,
      damage_cost: 500000000,
      affected_area_size: 10000
    },
    {
      id: 10,
      type: 'Earthquake',
      location: 'San Francisco, California',
      severity: 'Medium',
      date: '2023-01-05',
      casualties: 0,
      damage_cost: 50000000,
      affected_area_size: 200
    },
    {
      id: 11,
      type: 'Drought',
      location: 'Phoenix, Arizona',
      severity: 'High',
      date: '2022-06-15',
      casualties: 0,
      damage_cost: 1000000000,
      affected_area_size: 50000
    },
    // Specific data for common test zip cod
    {
      id: 14,
      type: 'Severe Storm',
      location: 'Newark, Delaware',
      severity: 'Medium',
      date: '2023-09-30',
      casualties: 0,
      damage_cost: 1200000,
      affected_area_size: 20
    }
  ];
};

// Mock weather forecast data