
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ResourceLevel {
  name: string;
  level: number;
  alert: boolean;
}

interface ResourceLevelCardProps {
  resources: ResourceLevel[];
}

const ResourceLevelCard = ({ resources }: ResourceLevelCardProps) => {
  return (
    <Card className="lg:col-span-1 animate-fade-in animation-delay-200">
      <CardHeader>
        <CardTitle>Resource Levels</CardTitle>
        <CardDescription>Current availability across all shelters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resources.map((resource, i) => (
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
  );
};

export default ResourceLevelCard;
