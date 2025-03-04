
import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getResources } from '@/lib/supabase/resources';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ResourceRequestDialog from './ResourceRequestDialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ResourceLevel {
  name: string;
  level: number;
  actualLevel?: number;
  alert: boolean;
}

interface ResourceLevelCardProps {
  resources: ResourceLevel[];
}

const ResourceLevelCard = ({ resources: initialResources }: ResourceLevelCardProps) => {
  const [resources, setResources] = useState<ResourceLevel[]>(initialResources);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live resource data
  useEffect(() => {
    const fetchResourceLevels = async () => {
      setIsLoading(true);
      try {
        // Fetch resources from database
        const dbResources = await getResources();
        
        // Group by category
        const resourcesByCategory = dbResources.reduce((acc, resource) => {
          const category = resource.category;
          // Skip the "Other" category
          if (category === 'Other') return acc;
          
          if (!acc[category]) {
            acc[category] = {
              total: 0,
              maxAmount: category === 'Food' ? 20000 : 
                         category === 'Water' ? 40000 : 
                         category === 'Medical' ? 6000 : 
                         category === 'Power' ? 100 : 
                         category === 'Beds' ? 3000 : 3000
            };
          }
          acc[category].total += resource.total_amount;
          return acc;
        }, {} as Record<string, { total: number, maxAmount: number }>);
        
        // Calculate levels as percentages and cap at 100%
        const updatedResources = Object.entries(resourcesByCategory).map(([category, data]) => {
          // Cap the level at 100% maximum
          const level = Math.min(100, Math.round((data.total / data.maxAmount) * 100));
          const actualLevel = Math.round((data.total / data.maxAmount) * 100);
          
          return {
            name: category,
            level: level, // This is capped at 100%
            actualLevel: actualLevel, // This is the true percentage (may be > 100%)
            alert: level < 50
          };
        });
        
        if (updatedResources.length > 0) {
          setResources(updatedResources);
        }
      } catch (error) {
        console.error('Error fetching resource levels:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResourceLevels();
  }, []);
  
  // Function to get the threshold description for tooltips
  const getThresholdDescription = (resourceName: string) => {
    const thresholds: Record<string, { max: number, unit: string }> = {
      'Food': { max: 20000, unit: 'meals' },
      'Water': { max: 40000, unit: 'gallons' },
      'Medical': { max: 6000, unit: 'supplies' },
      'Power': { max: 100, unit: 'generators' },
      'Beds': { max: 3000, unit: 'beds' },
      'Volunteers': { max: 3000, unit: 'volunteers' }
    };
    
    const info = thresholds[resourceName] || { max: 3000, unit: 'units' };
    return `${resourceName}: ${info.max} ${info.unit} at 100%`;
  };
  
  return (
    <Card className="lg:col-span-1 animate-fade-in animation-delay-200 rounded-xl bg-gray-50 shadow-neumorphic border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Resource Levels</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <p className="font-semibold">Resource Level Thresholds</p>
                  <p className="text-sm text-gray-600">
                    Percentages show current inventory relative to maximum capacity:
                  </p>
                  <ul className="text-xs space-y-1 text-gray-600">
                    {resources.map((resource) => (
                      <li key={resource.name}>{getThresholdDescription(resource.name)}</li>
                    ))}
                  </ul>
                  <div className="pt-1 text-xs">
                    <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-1"></span> 
                    <span className="mr-2">Above 70%</span>
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> 
                    <span className="mr-2">40-70%</span>
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span> 
                    <span>Below 40%</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Current availability across all shelters</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="bg-gray-100 rounded-full h-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {resources.map((resource, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium cursor-help">{resource.name}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-white p-2 shadow-md rounded border border-gray-200">
                          <p className="text-xs">{getThresholdDescription(resource.name)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-sm font-medium">
                      {resource.level}%
                      {resource.actualLevel && resource.actualLevel > 100 && (
                        <span className="text-xs text-green-600 ml-1">(Full)</span>
                      )}
                      {resource.alert && (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-1 inline" />
                      )}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-full h-4 shadow-neumorphic-inset overflow-hidden">
                    <Progress 
                      value={resource.level} 
                      className="h-4 border-0 bg-gray-200 shadow-inner" 
                      indicatorClassName={`${
                        resource.level > 70 ? 'bg-emerald-500' : 
                        resource.level > 40 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      } shadow-neumorphic-inset rounded-full`}
                    />
                  </div>
                  {resource.alert && (
                    <p className="text-xs text-red-500">Low levels detected - resupply needed</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full bg-gray-50 hover:bg-gray-100 shadow-neumorphic border-0 text-crisisBlue-600 font-medium transition-all hover:shadow-neumorphic-sm"
                  >
                    Request Resources
                  </Button>
                </DialogTrigger>
                <ResourceRequestDialog />
              </Dialog>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceLevelCard;
