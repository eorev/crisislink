
import React, { useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import ResourceCard from '@/components/resources/ResourceCard';
import ResourceAnalytics from '@/components/resources/ResourceAnalytics';
import { resourceCategoryData } from '@/components/resources/ResourceData';

const Resources = () => {
  const analyticsRef = useRef<HTMLDivElement>(null);

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            <p className="text-gray-600 mt-2">Track and distribute critical resources across shelters</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={scrollToAnalytics}>
              <BarChart2 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
              Manage Distribution
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {resourceCategoryData.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        <ResourceAnalytics analyticsRef={analyticsRef} />
      </div>
    </Layout>
  );
};

export default Resources;
