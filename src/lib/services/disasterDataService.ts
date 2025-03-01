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
    
    // Specific data for common test zip codes
    {
      id: 12,
      type: 'Hurricane',
      location: 'Brick, New Jersey',
      severity: 'High',
      date: '2012-10-29', // Hurricane Sandy
      casualties: 2,
      damage_cost: 25000000,
      affected_area_size: 75
    },
    {
      id: 13,
      type: 'Flood',
      location: 'Brick, New Jersey',
      severity: 'High',
      date: '2012-10-30', // Flooding from Hurricane Sandy
      casualties: 0,
      damage_cost: 15000000,
      affected_area_size: 50
    },
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
export const getWeatherForecastData = async (): Promise<WeatherForecastData[]> => {
  // In a real application, this would fetch data from a weather API
  const today = new Date();
  const forecasts: WeatherForecastData[] = [];
  
  // Helper function to add days to a date
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Northeast region forecasts
  ['New York City', 'Boston', 'Philadelphia', 'Newark, Delaware', 'Brick, New Jersey'].forEach(location => {
    // Generate forecasts for the next 3 days
    for (let i = 1; i <= 3; i++) {
      const forecastDate = addDays(today, i);
      
      // Determine if there should be alerts based on location and random chance
      const hasAlerts = Math.random() > 0.6;
      let alerts: string[] = [];
      
      if (hasAlerts) {
        if (location === 'Brick, New Jersey') {
          alerts = ['Coastal Flood Warning', 'High Wind Advisory'];
        } else if (location === 'Newark, Delaware') {
          alerts = ['Thunderstorm Watch', 'Flash Flood Warning'];
        } else if (location.includes('New York') || location.includes('Boston')) {
          alerts = i === 1 ? ['Winter Storm Watch'] : [];
        } else {
          const possibleAlerts = ['Thunderstorm Watch', 'Flood Watch', 'Wind Advisory'];
          alerts = [possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)]];
        }
      }
      
      forecasts.push({
        location,
        date: formatDate(forecastDate),
        temperature: 5 + Math.floor(Math.random() * 15), // 5-20°C
        precipitation: location.includes('New Jersey') || location.includes('Delaware') ? 70 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 40),
        wind_speed: 15 + Math.floor(Math.random() * 25),
        humidity: 60 + Math.floor(Math.random() * 30),
        pressure: 995 + Math.floor(Math.random() * 20),
        alerts: alerts.length > 0 ? alerts : undefined
      });
    }
  });
  
  // Southeast region forecasts
  ['Miami', 'Atlanta', 'New Orleans'].forEach(location => {
    for (let i = 1; i <= 3; i++) {
      const forecastDate = addDays(today, i);
      const hasAlerts = Math.random() > 0.7;
      let alerts: string[] = [];
      
      if (hasAlerts) {
        if (location === 'Miami') {
          alerts = ['Hurricane Watch', 'Storm Surge Warning'];
        } else if (location === 'New Orleans') {
          alerts = ['Flood Watch'];
        } else {
          alerts = ['Severe Thunderstorm Watch'];
        }
      }
      
      forecasts.push({
        location,
        date: formatDate(forecastDate),
        temperature: 20 + Math.floor(Math.random() * 10), // 20-30°C
        precipitation: 30 + Math.floor(Math.random() * 40),
        wind_speed: 10 + Math.floor(Math.random() * 30),
        humidity: 70 + Math.floor(Math.random() * 20),
        pressure: 1000 + Math.floor(Math.random() * 15),
        alerts: alerts.length > 0 ? alerts : undefined
      });
    }
  });
  
  // Midwest region forecasts
  ['Chicago', 'St. Louis', 'Oklahoma City'].forEach(location => {
    for (let i = 1; i <= 3; i++) {
      const forecastDate = addDays(today, i);
      const hasAlerts = Math.random() > 0.7;
      let alerts: string[] = [];
      
      if (hasAlerts) {
        if (location === 'Oklahoma City') {
          alerts = ['Tornado Watch'];
        } else {
          alerts = ['Severe Thunderstorm Watch', 'Flash Flood Warning'];
        }
      }
      
      forecasts.push({
        location,
        date: formatDate(forecastDate),
        temperature: 10 + Math.floor(Math.random() * 15), // 10-25°C
        precipitation: 20 + Math.floor(Math.random() * 50),
        wind_speed: 15 + Math.floor(Math.random() * 25),
        humidity: 50 + Math.floor(Math.random() * 30),
        pressure: 1005 + Math.floor(Math.random() * 10),
        alerts: alerts.length > 0 ? alerts : undefined
      });
    }
  });
  
  // West region forecasts
  ['Los Angeles', 'San Francisco', 'Phoenix', 'Seattle'].forEach(location => {
    for (let i = 1; i <= 3; i++) {
      const forecastDate = addDays(today, i);
      const hasAlerts = Math.random() > 0.7;
      let alerts: string[] = [];
      
      if (hasAlerts) {
        if (location === 'Los Angeles') {
          alerts = ['Excessive Heat Warning', 'Fire Weather Watch'];
        } else if (location === 'Phoenix') {
          alerts = ['Excessive Heat Warning', 'Dust Storm Warning'];
        } else if (location === 'Seattle') {
          alerts = ['Air Quality Alert'];
        } else {
          alerts = ['High Surf Advisory'];
        }
      }
      
      forecasts.push({
        location,
        date: formatDate(forecastDate),
        temperature: location === 'Phoenix' ? 35 + Math.floor(Math.random() * 10) : 15 + Math.floor(Math.random() * 15),
        precipitation: location === 'Seattle' ? 60 + Math.floor(Math.random() * 30) : 10 + Math.floor(Math.random() * 20),
        wind_speed: 5 + Math.floor(Math.random() * 20),
        humidity: location === 'Phoenix' ? 20 + Math.floor(Math.random() * 20) : 50 + Math.floor(Math.random() * 30),
        pressure: 1010 + Math.floor(Math.random() * 10),
        alerts: alerts.length > 0 ? alerts : undefined
      });
    }
  });
  
  return forecasts;
}; 