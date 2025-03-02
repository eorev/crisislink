
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import RequestSuppliesDialog from './RequestSuppliesDialog';
import { useEffect, useState } from 'react';
import { getResources } from '@/lib/supabase/resources';

interface ResourceLevel {
  name: string;
  level: number;
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
          if (!acc[category]) {
            acc[category] = {
              total: 0,
              maxAmount: category === 'Food' ? 20000 : 
                         category === 'Water' ? 40000 : 
                         category === 'Medical' ? 6000 : 
                         category === 'Power' ? 100 : 3000
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
  
  return (
    <Card className="lg:col-span-1 animate-fade-in animation-delay-200 rounded-xl bg-gray-50 shadow-neumorphic border-0">
      <CardHeader>
        <CardTitle>Resource Levels</CardTitle>
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
          <div className="space-y-6">
            {resources.map((resource, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{resource.name}</span>
                  <span className="text-sm font-medium">
                    {resource.level}%
                    {resource.actualLevel > 100 && (
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
        )}
        <RequestSuppliesDialog 
          trigger={
            <Button variant="outline" className="w-full mt-6 bg-gray-50 shadow-neumorphic-sm hover:shadow-neumorphic-inset transition-shadow border-0">
              Request Supplies
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default ResourceLevelCard;
