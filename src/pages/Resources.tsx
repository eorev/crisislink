
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CircleDollarSign, Home } from 'lucide-react';
import { getResources } from '@/lib/supabase/resources';
import { toast } from "sonner";
import type { Resource } from '@/lib/supabase/types';
import ResourceSummaryView from '@/components/resources/ResourceSummaryView';
import ResourceDetailDialog from '@/components/resources/ResourceDetailDialog';

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const fetchedResources = await getResources();
      setResources(fetchedResources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources.');
      setResources([]);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Inventory</h1>
            <p className="text-gray-600">Overview of all disaster relief resources</p>
          </div>
          {/* Add Resources button removed as requested */}
        </div>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <ResourceSummaryView resources={resources} isLoading={isLoading} />
        )}

        <ResourceDetailDialog 
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onResourceSaved={() => {
            fetchResources();
            toast.success("Resource saved successfully");
          }}
        />
      </div>
    </Layout>
  );
};

export default ResourcesPage;
