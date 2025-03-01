
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import RequestSuppliesDialog from './RequestSuppliesDialog';

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
    <Card className="lg:col-span-1 animate-fade-in animation-delay-200 rounded-xl bg-gray-50 shadow-neumorphic border-0">
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
