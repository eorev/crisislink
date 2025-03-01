
import React, { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import ResourceCard from '@/components/resources/ResourceCard';
import ResourceAnalytics from '@/components/resources/ResourceAnalytics';
import { createResourceCategoryData } from '@/components/resources/ResourceData';
import { getResources, createResource } from '@/lib/supabase/resources';
import { getShelters } from '@/lib/supabase/shelters';
import { Resource, Shelter } from '@/lib/supabase/types';
import { toast } from 'sonner';

const Resources = () => {
  const analyticsRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState(createResourceCategoryData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      // First fetch shelters to get context
      const shelterData = await getShelters();
      setShelters(shelterData);
      
      // Then fetch resources
      let dbResources = await getResources();
      
      // Group resources by category and sum up totals across all shelters
      const resourcesByCategory = dbResources.reduce((acc, resource) => {
        const category = resource.category;
        if (!acc[category]) {
          acc[category] = {
            total: 0,
            shelterCount: new Set(),
            alerts: 0,
            unit: resource.unit
          };
        }
        
        acc[category].total += resource.total_amount;
        if (resource.shelter_id) {
          acc[category].shelterCount.add(resource.shelter_id);
        }
        
        // Track alerts (when resource amount is below threshold)
        if (resource.total_amount <= resource.alert_threshold) {
          acc[category].alerts += 1;
        }
        
        return acc;
      }, {} as Record<string, { total: number, shelterCount: Set<number>, alerts: number, unit: string }>);
      
      // Map resource data to UI format
      const updatedResources = resources.map(resource => {
        // Map UI resource names to database categories
        const categoryMap: Record<string, string> = {
          'Food Supplies': 'Food',
          'Water Supplies': 'Water',
          'Medical Supplies': 'Medical',
          'Emergency Power': 'Power',
          'Shelter Kits': 'Beds'
        };
        
        const dbCategory = categoryMap[resource.name] || 'Other';
        const categoryData = resourcesByCategory[dbCategory];
        
        if (categoryData) {
          return {
            ...resource,
            totalAmount: categoryData.total,
            shelters: categoryData.shelterCount.size,
            alerts: categoryData.alerts,
            unit: categoryData.unit,
            status: categoryData.alerts > 0 ? 'warning' : 'normal'
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
            <p className="text-gray-600 mt-2">Track and distribute critical resources across {shelters.length} shelters</p>
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
