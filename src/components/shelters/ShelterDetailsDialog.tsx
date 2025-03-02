
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getResourcesByShelter } from '@/lib/supabase/resources';
import { Package, Users, Phone, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Resource } from '@/lib/supabase/types';
import type { ShelterWithResources } from './ShelterTypes';

interface ShelterDetailsDialogProps {
  shelter: ShelterWithResources;
}

const ShelterDetailsDialog = ({ shelter }: ShelterDetailsDialogProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShelterResources = async () => {
      try {
        setIsLoading(true);
        if (shelter.id) {
          const shelterResources = await getResourcesByShelter(shelter.id);
          setResources(shelterResources);
        }
      } catch (error) {
        console.error('Error fetching shelter resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelterResources();
  }, [shelter.id]);

  const formatLastUpdated = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (err) {
      return 'Unknown';
    }
  };

  const groupResourcesByCategory = (resources: Resource[]) => {
    return resources.reduce((acc, resource) => {
      const { category } = resource;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  };

  const groupedResources = groupResourcesByCategory(resources);

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          {shelter.name}
          {shelter.status === 'limited' && (
            <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded">
              Limited Resources
            </span>
          )}
          {shelter.status === 'closed' && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              Closed
            </span>
          )}
        </DialogTitle>
        <DialogDescription>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {shelter.address}
          </div>
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Capacity</span>
              <span className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {shelter.current_occupancy} / {shelter.capacity}
              </span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Contact</span>
              <span className="font-medium flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {shelter.contact_phone}
              </span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`font-medium flex items-center ${
                shelter.status === 'operational' 
                  ? 'text-green-600' 
                  : shelter.status === 'limited' 
                    ? 'text-amber-600' 
                    : 'text-red-600'
              }`}>
                {shelter.status === 'operational' ? 'Operational' : 
                 shelter.status === 'limited' ? 'Limited Capacity' : 'Closed'}
              </span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Last Updated</span>
              <span className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatLastUpdated(shelter.last_updated)}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Occupancy</h3>
            <div className="relative pt-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${shelter.current_occupancy / shelter.capacity > 0.9
                    ? 'bg-red-500'
                    : shelter.current_occupancy / shelter.capacity > 0.7
                      ? 'bg-amber-500'
                      : 'bg-green-500'
                    }`}
                  style={{ width: `${(shelter.current_occupancy / shelter.capacity) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs font-medium text-gray-600">{shelter.current_occupancy} people</span>
                <span className="text-xs font-medium text-gray-600">
                  {Math.round((shelter.current_occupancy / shelter.capacity) * 100)}% full
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
              <p className="mt-1 text-sm text-gray-500">
                This shelter doesn't have any allocated resources yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedResources).map(([category, categoryResources]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {category} Resources
                  </h3>
                  <div className="bg-gray-50 rounded-md p-3 space-y-3">
                    {categoryResources.map((resource) => (
                      <div key={resource.id} className="flex justify-between items-center">
                        <span className="text-sm">{resource.name}</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            {resource.total_amount} {resource.unit}
                          </span>
                          {resource.total_amount <= resource.alert_threshold && (
                            <AlertTriangle className="h-4 w-4 text-amber-500 ml-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default ShelterDetailsDialog;
