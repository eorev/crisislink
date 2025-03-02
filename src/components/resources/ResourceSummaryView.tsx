
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Resource } from '@/lib/supabase/types';
import ResourceBarChart from './ResourceBarChart';
import ShelterCoverageChart from './ShelterCoverageChart';
import AllocationEfficiencyChart from './AllocationEfficiencyChart';

interface ResourceCategory {
  category: string;
  totalAmount: number;
  unit: string;
  shelterCount: number;
  resources: Resource[];
}

interface ResourceSummaryViewProps {
  resources: Resource[];
  isLoading: boolean;
}

const ResourceSummaryView = ({ resources, isLoading }: ResourceSummaryViewProps) => {
  const [resourceDetailOpen, setResourceDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);

  // Group resources by category
  const resourcesByCategory = resources.reduce((acc, resource) => {
    const category = resource.category;
    if (!acc[category]) {
      acc[category] = {
        category: category,
        totalAmount: 0,
        unit: resource.unit,
        shelterCount: 0,
        resources: []
      };
    }
    
    acc[category].totalAmount += resource.total_amount;
    // Count unique shelters
    if (resource.shelter_id) {
      acc[category].shelterCount++;
    }
    acc[category].resources.push(resource);
    
    // Use the most common unit for this category
    const unitCounts = acc[category].resources.reduce((units, res) => {
      units[res.unit] = (units[res.unit] || 0) + 1;
      return units;
    }, {} as Record<string, number>);
    
    const mostCommonUnit = Object.entries(unitCounts).sort((a, b) => b[1] - a[1])[0][0];
    acc[category].unit = mostCommonUnit;
    
    return acc;
  }, {} as Record<string, ResourceCategory>);

  const resourceCategories = Object.values(resourcesByCategory);

  // Prepare data for ResourceBarChart
  const chartData = resourceCategories.map(category => ({
    name: category.category,
    value: category.totalAmount
  }));

  // Prepare data for ShelterCoverageChart
  const shelterCoverageData = resourceCategories.map(category => ({
    name: category.category,
    value: category.shelterCount,
    color: getColorForCategory(category.category)
  }));

  function getColorForCategory(category: string) {
    switch (category) {
      case 'Food': return '#FF6B6B';
      case 'Water': return '#4ECDC4';
      case 'Medical': return '#1A535C';
      case 'Beds': return '#FFE66D';
      case 'Power': return '#F7B801';
      default: return '#6B5CA5';
    }
  }

  const openResourceDetail = (category: ResourceCategory) => {
    setSelectedCategory(category);
    setResourceDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourceCategories.map((category) => (
          <Card key={category.category} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>{category.category} Resources</span>
                <Package className="h-5 w-5 text-gray-500" />
              </CardTitle>
              <CardDescription>
                Distributed across {category.shelterCount} shelters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold">
                  {category.totalAmount.toLocaleString()} <span className="text-lg font-normal text-gray-500">{category.unit}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => openResourceDetail(category)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
            <CardDescription>Total resources by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResourceBarChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Shelter Coverage</CardTitle>
            <CardDescription>Resource distribution across shelters</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ShelterCoverageChart data={shelterCoverageData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Resource Allocation Efficiency</CardTitle>
            <CardDescription>Comparing allocated resources to capacity and needs</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AllocationEfficiencyChart 
              data={resourceCategories.map(category => ({
                name: category.category,
                allocated: category.totalAmount,
                capacity: category.totalAmount * 1.5, // Example data
                needs: category.totalAmount * 0.8    // Example data
              }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Resource Details Dialog */}
      <Dialog open={resourceDetailOpen} onOpenChange={setResourceDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCategory?.category} Resources</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">Total: {selectedCategory.totalAmount.toLocaleString()} {selectedCategory.unit}</h3>
              
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Shelter</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCategory.resources.map((resource) => (
                      <tr key={resource.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{resource.name}</td>
                        <td className="px-4 py-3">{resource.total_amount} {resource.unit}</td>
                        <td className="px-4 py-3">{resource.shelter_id ? 'Shelter #' + resource.shelter_id : 'Central Storage'}</td>
                        <td className="px-4 py-3">{new Date(resource.last_updated).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceSummaryView;
