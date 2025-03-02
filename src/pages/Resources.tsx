
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign, Home, Package, AlertTriangle } from 'lucide-react';
import { getResources, getShelterById } from '@/lib/supabase/resources';
import { initializeResources } from '@/lib/supabase/initialData';
import type { Resource } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { toast } from "sonner";

// Define a type that extends Resource with optional shelter information
type ResourceWithShelter = Resource & {
  shelter?: {
    id: number;
    name: string;
    address: string;
  } | null;
};

// Fallback data in case the database fetch fails
const sampleResourceData: ResourceWithShelter[] = [
  {
    id: 1,
    name: 'Food Supplies',
    category: 'Food',
    total_amount: 1500,
    unit: 'meals',
    shelter_id: 1,
    created_at: '2023-01-01T00:00:00Z',
    last_updated: '2023-01-01T00:00:00Z',
    alert_threshold: 300,
    user_id: '00000000-0000-0000-0000-000000000000',
    shelter: {
      id: 1,
      name: 'Central Community Center',
      address: '123 Main St, Cityville'
    }
  },
  {
    id: 2,
    name: 'Water Bottles',
    category: 'Water',
    total_amount: 3000,
    unit: 'bottles',
    shelter_id: 2,
    created_at: '2023-01-01T00:00:00Z',
    last_updated: '2023-01-01T00:00:00Z',
    alert_threshold: 600,
    user_id: '00000000-0000-0000-0000-000000000000',
    shelter: {
      id: 2,
      name: 'Riverside Emergency Shelter',
      address: '456 River Rd, Townsburg'
    }
  },
  {
    id: 3,
    name: 'Medical Kits',
    category: 'Medical',
    total_amount: 200,
    unit: 'kits',
    shelter_id: 3,
    created_at: '2023-01-01T00:00:00Z',
    last_updated: '2023-01-01T00:00:00Z',
    alert_threshold: 40,
    user_id: '00000000-0000-0000-0000-000000000000',
    shelter: {
      id: 3,
      name: 'Eastside High School',
      address: '789 East Ave, Villageton'
    }
  },
  {
    id: 4,
    name: 'Beds',
    category: 'Beds',
    total_amount: 100,
    unit: 'units',
    shelter_id: 4,
    created_at: '2023-01-01T00:00:00Z',
    last_updated: '2023-01-01T00:00:00Z',
    alert_threshold: 20,
    user_id: '00000000-0000-0000-0000-000000000000',
    shelter: {
      id: 4,
      name: 'North District Armory',
      address: '321 North Blvd, Hamletville'
    }
  }
];

const ResourcesPage = () => {
  const [resources, setResources] = useState<ResourceWithShelter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const fetchedResources = await getResources();
      
      // If no resources exist and we haven't initialized yet
      if (fetchedResources.length === 0 && !isInitialized) {
        setIsInitialized(true);
        toast.info("Initializing resource database with sample data...");
        await initializeResources();
        // Fetch again after initialization
        const initializedResources = await getResources();
        
        // Transform to match ResourceWithShelter type
        const initialResourcesWithShelter: ResourceWithShelter[] = initializedResources.map(resource => ({
          ...resource,
          shelter: resource.shelter_id ? { 
            id: resource.shelter_id,
            name: "Loading...", 
            address: "Loading..." 
          } : null
        }));
        
        setResources(initialResourcesWithShelter);
      } else {
        // Transform to match ResourceWithShelter type
        const resourcesWithShelter: ResourceWithShelter[] = fetchedResources.map(resource => ({
          ...resource,
          shelter: resource.shelter_id ? { 
            id: resource.shelter_id,
            name: "Loading...", 
            address: "Loading..." 
          } : null
        }));
        
        setResources(resourcesWithShelter);
      }
      
      // Get shelter information for each resource
      const resourcesWithShelterId = resources
        .filter(r => r.shelter_id !== undefined && r.shelter_id !== null);
      
      if (resourcesWithShelterId.length > 0) {
        const uniqueShelterIds = [...new Set(resourcesWithShelterId.map(r => r.shelter_id))];
        
        // Fetch shelter details for each unique shelter ID
        const shelterDetailsPromises = uniqueShelterIds
          .filter((id): id is number => id !== undefined)
          .map(id => getShelterById(id));
        
        const shelters = await Promise.all(shelterDetailsPromises);
        
        const shelterMap = new Map(
          shelters.map(shelter => [shelter.id, shelter])
        );
        
        // Update resources with shelter information
        const updatedResources = resources.map(resource => {
          if (resource.shelter_id && shelterMap.has(resource.shelter_id)) {
            const shelterInfo = shelterMap.get(resource.shelter_id);
            return {
              ...resource,
              shelter: {
                id: shelterInfo.id,
                name: shelterInfo.name,
                address: shelterInfo.address
              }
            };
          }
          return resource;
        });
        
        setResources(updatedResources);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Using fallback data.');
      setResources(sampleResourceData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);  // fetchResources is defined inside the component so it should not be in the dependency array

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Unknown';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resource Inventory</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {resource.name}
                  </CardTitle>
                  {resource.category && (
                    <Badge variant="secondary">
                      {resource.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Amount: {resource.total_amount} {resource.unit}</span>
                    </div>
                    {resource.shelter && (
                      <>
                        <div className="flex items-center text-sm text-gray-500">
                          <Home className="h-4 w-4 mr-2" />
                          <span>Shelter: {resource.shelter.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CircleDollarSign className="h-4 w-4 mr-2" />
                          <span>Address: {resource.shelter.address}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Alert Threshold: {resource.alert_threshold} {resource.unit}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Last Updated: {formatDate(resource.last_updated)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResourcesPage;
