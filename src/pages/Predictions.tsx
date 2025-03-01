
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Thermometer, 
  Wind, 
  Droplets 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const forecastData = [
  { day: 'Mon', rainfall: 0.5, temperature: 86, windSpeed: 5, probability: 0.2 },
  { day: 'Tue', rainfall: 0.7, temperature: 88, windSpeed: 8, probability: 0.3 },
  { day: 'Wed', rainfall: 1.2, temperature: 90, windSpeed: 12, probability: 0.5 },
  { day: 'Thu', rainfall: 2.8, temperature: 93, windSpeed: 18, probability: 0.7 },
  { day: 'Fri', rainfall: 4.5, temperature: 95, windSpeed: 25, probability: 0.85 },
  { day: 'Sat', rainfall: 3.2, temperature: 91, windSpeed: 20, probability: 0.6 },
  { day: 'Sun', rainfall: 1.5, temperature: 87, windSpeed: 15, probability: 0.4 },
];

const historicalData = [
  { month: 'Jan', incidents: 5 },
  { month: 'Feb', incidents: 7 },
  { month: 'Mar', incidents: 10 },
  { month: 'Apr', incidents: 12 },
  { month: 'May', incidents: 15 },
  { month: 'Jun', incidents: 25 },
  { month: 'Jul', incidents: 30 },
  { month: 'Aug', incidents: 22 },
  { month: 'Sep', incidents: 18 },
  { month: 'Oct', incidents: 12 },
  { month: 'Nov', incidents: 8 },
  { month: 'Dec', incidents: 6 },
];

const disasterWarnings = [
  {
    id: 1,
    type: 'Hurricane',
    location: 'Coastal Regions',
    severity: 'high',
    probability: 85,
    timeframe: '3-5 days',
    details: 'Category 3 hurricane forming in the Atlantic with potential landfall.'
  },
  {
    id: 2,
    type: 'Flood',
    location: 'River Valley',
    severity: 'medium',
    probability: 65,
    timeframe: '24-48 hours',
    details: 'Heavy rainfall expected to cause river levels to rise significantly.'
  },
  {
    id: 3,
    type: 'Wildfire',
    location: 'Northern Woods',
    severity: 'medium',
    probability: 50,
    timeframe: '1-2 weeks',
    details: 'Dry conditions and increasing temperatures creating favorable conditions for wildfires.'
  }
];

const Predictions = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disaster Predictions</h1>
            <p className="text-gray-600 mt-2">AI-powered analysis and forecasting of potential disaster events</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Historical Data
            </Button>
            <Button className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
              Update Predictions
            </Button>
          </div>
        </div>

        {/* Active Warnings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Active Warnings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disasterWarnings.map((warning) => (
              <Card key={warning.id} className={`border-l-4 ${
                warning.severity === 'high' 
                  ? 'border-l-red-500' 
                  : warning.severity === 'medium'
                    ? 'border-l-amber-500'
                    : 'border-l-blue-500'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      {warning.type}
                      <Badge className={`ml-2 ${
                        warning.severity === 'high' 
                          ? 'bg-red-500' 
                          : warning.severity === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                      }`}>
                        {warning.severity.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <span className="text-sm font-bold">{warning.probability}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{warning.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Expected in {warning.timeframe}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{warning.details}</p>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prediction Charts */}
        <div className="mb-6">
          <Tabs defaultValue="forecast">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-crisisBlue-600" />
                Prediction Analytics
              </h2>
              <TabsList>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="historical">Historical</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="forecast">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">7-Day Hurricane Risk Forecast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="probability" stroke="#0c4a6e" fill="#0ea5e9" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                            <span className="text-sm font-medium">Temperature</span>
                          </div>
                          <span className="text-lg font-bold">95°F</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Peak in next 5 days</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Wind className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="text-sm font-medium">Wind Speed</span>
                          </div>
                          <span className="text-lg font-bold">25 mph</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Peak in next 5 days</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="text-sm font-medium">Rainfall</span>
                          </div>
                          <span className="text-lg font-bold">4.5 in</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Total in next 7 days</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="historical">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historical Disaster Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="incidents" stroke="#0c4a6e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Historical data shows increased disaster activity during summer months, with peak incidents in July.
                      AI prediction models show a 78% correlation between these patterns and current climate data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Predictions;
