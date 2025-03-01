
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart2, 
  ArrowUp, 
  ArrowDown, 
  LifeBuoy, 
  Users, 
  Package, 
  Activity,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// Sample data for the dashboard
const shelterStats = [
  { 
    name: 'Active Shelters', 
    value: 87, 
    change: 12, 
    changeType: 'increase',
    icon: <LifeBuoy className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" /> 
  },
  { 
    name: 'People Sheltered', 
    value: 4328, 
    change: 856, 
    changeType: 'increase',
    icon: <Users className="h-5 w-5 text-crisisGold-500" aria-hidden="true" /> 
  },
  { 
    name: 'Food Supplies', 
    value: 68, 
    change: 7, 
    changeType: 'decrease',
    icon: <Package className="h-5 w-5 text-emerald-600" aria-hidden="true" /> 
  },
  { 
    name: 'Medical Kits', 
    value: 82, 
    change: 14, 
    changeType: 'increase',
    icon: <Activity className="h-5 w-5 text-red-500" aria-hidden="true" /> 
  },
];

const recentDisasters = [
  { 
    type: 'Earthquake', 
    location: 'San Francisco, CA', 
    severity: 'High', 
    time: '2 hours ago',
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Flood', 
    location: 'New Orleans, LA', 
    severity: 'Medium', 
    time: '1 day ago',
    status: 'monitoring',
    severityClass: 'bg-yellow-100 text-yellow-800'
  },
  { 
    type: 'Wildfire', 
    location: 'Los Angeles, CA', 
    severity: 'High', 
    time: '6 hours ago',
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Hurricane', 
    location: 'Miami, FL', 
    severity: 'Medium', 
    time: '2 days ago',
    status: 'recovering',
    severityClass: 'bg-blue-100 text-blue-800'
  },
];

const resourceLevels = [
  { name: 'Water', level: 72, alert: false },
  { name: 'Food', level: 48, alert: true },
  { name: 'Medicine', level: 63, alert: false },
  { name: 'Shelter Space', level: 85, alert: false },
  { name: 'Volunteers', level: 37, alert: true },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard Updated",
        description: "Real-time data has been refreshed.",
        duration: 3000,
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disaster Management Dashboard</h1>
            <p className="mt-2 text-gray-600">Real-time monitoring of shelters and resources</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => {
                toast({
                  title: "Report Generated",
                  description: "The report has been downloaded to your device.",
                  duration: 3000,
                });
              }}
            >
              Generate Report
            </Button>
            <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
              <Link to="/shelters">View All Shelters</Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-crisisBlue-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {shelterStats.map((stat, i) => (
                <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        {stat.name}
                      </CardTitle>
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                    <div className="flex items-center mt-1">
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${stat.changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stat.change} {stat.changeType === 'increase' ? 'more' : 'less'}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">since last week</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Resource Levels */}
              <Card className="lg:col-span-1 animate-fade-in animation-delay-200">
                <CardHeader>
                  <CardTitle>Resource Levels</CardTitle>
                  <CardDescription>Current availability across all shelters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {resourceLevels.map((resource, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{resource.name}</span>
                          <span className="text-sm font-medium">
                            {resource.level}%
                            {resource.alert && (
                              <AlertTriangle className="h-4 w-4 text-red-500 ml-1 inline" />
                            )}
                          </span>
                        </div>
                        <Progress 
                          value={resource.level} 
                          className={`h-2 ${resource.alert ? 'bg-red-100' : 'bg-gray-100'}`} 
                          indicatorClassName={`${
                            resource.level > 70 ? 'bg-emerald-500' : 
                            resource.level > 40 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                        />
                        {resource.alert && (
                          <p className="text-xs text-red-500">Low levels detected - resupply needed</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6">
                    Request Supplies
                  </Button>
                </CardContent>
              </Card>

              {/* Active Disasters */}
              <Card className="lg:col-span-2 animate-fade-in animation-delay-400">
                <CardHeader>
                  <CardTitle>Active Disasters</CardTitle>
                  <CardDescription>Recent disaster events being monitored</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Type</th>
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Location</th>
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Severity</th>
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDisasters.map((disaster, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-3 text-sm">{disaster.type}</td>
                            <td className="py-3 text-sm">{disaster.location}</td>
                            <td className="py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${disaster.severityClass}`}>
                                {disaster.severity}
                              </span>
                            </td>
                            <td className="py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                disaster.status === 'active' 
                                  ? 'bg-red-100 text-red-800' 
                                  : disaster.status === 'monitoring' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-gray-500">{disaster.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button asChild variant="outline">
                      <Link to="/predictions">View AI Predictions</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
