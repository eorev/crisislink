
import React, { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import ResourceCard from '@/components/resources/ResourceCard';
import ResourceAnalytics from '@/components/resources/ResourceAnalytics';
import { createResourceCategoryData } from '@/components/resources/ResourceData';
import { getResources, createResource } from '@/lib/supabase/resources';
import { Resource } from '@/lib/supabase/types';
import { toast } from 'sonner';

const Resources = () => {
  const analyticsRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState(createResourceCategoryData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      let dbResources = await getResources();
      
      // If no resources are found, create initial resources
      if (dbResources.length === 0) {
        toast.info('Initializing resource database...');
        
        // Create initial resources in database
        for (const resource of resources) {
          try {
            await createResource({
              name: resource.name,
              category: resource.name.toLowerCase(),
              total_amount: resource.totalAmount,
              unit: resource.unit,
              shelter_id: null,
              alert_threshold: Math.floor(resource.totalAmount * 0.2)
            });
          } catch (err) {
            console.error(`Error creating initial resource ${resource.name}:`, err);
          }
        }
        
        // Fetch again after creating
        dbResources = await getResources();
      }
      
      const updatedResources = resources.map(resource => {
        const dbResource = dbResources.find(r => 
          r.name.toLowerCase() === resource.name.toLowerCase() || 
          r.name.toLowerCase().includes(resource.name.toLowerCase().split(' ')[0]));
        
        if (dbResource) {
          return {
            ...resource,
            id: dbResource.id,
            totalAmount: dbResource.total_amount,
          };
        }
        return resource;
      });
      
      setResources(updatedResources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            <p className="text-gray-600 mt-2">Track and distribute critical resources across shelters</p>
          </div>
          <div>
            <Button variant="outline" onClick={scrollToAnalytics}>
              <BarChart2 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {resources.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onResourceUpdated={fetchResources}
            />
          ))}
        </div>

        <ResourceAnalytics analyticsRef={analyticsRef} />
      </div>
    </Layout>
  );
};

export default Resources;
