import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Resource } from '@/lib/supabase/types';
import ResourceBarChart from './ResourceBarChart';
import ShelterCoverageChart from './ShelterCoverageChart';
import { getShelters } from '@/lib/supabase/shelters';
import { Shelter } from '@/lib/supabase/types';

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
  onResourceUpdated?: () => void;
}

const ResourceSummaryView = ({ resources, isLoading, onResourceUpdated }: ResourceSummaryViewProps) => {
  const [resourceDetailOpen, setResourceDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const shelterData = await getShelters();
        setShelters(shelterData);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      }
    };
    
    fetchShelters();
  }, []);

  function getColorForCategory(category: string) {
    switch (category) {
      case 'Food': return '#FF6B6B';
      case 'Water': return '#4ECDC4';
      case 'Medical': return '#1A535C';
      case 'Beds': return '#FFE66D';
      case 'Power': return '#F7B801';
      case 'Other': return '#6B5CA5';
      default: return '#6B5CA5';
    }
  }

  const getResourceDistribution = () => {
    const shelterResourceMap = new Map<number, Set<string>>();
    
    resources.forEach(resource => {
      if (resource.shelter_id) {
        if (!shelterResourceMap.has(resource.shelter_id)) {
          shelterResourceMap.set(resource.shelter_id, new Set());
        }
        shelterResourceMap.get(resource.shelter_id)?.add(resource.category);
      }
    });
    
    const categoryToShelterCount = {
      'Food': 0,
      'Water': 0,
      'Medical': 0,
      'Beds': 0,
      'Power': 0,
      'Other': 0
    };
    
    shelterResourceMap.forEach((categories) => {
      categories.forEach(category => {
        if (category in categoryToShelterCount) {
          categoryToShelterCount[category as keyof typeof categoryToShelterCount]++;
        }
      });
    });
    
    return categoryToShelterCount;
  };

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
    acc[category].resources.push(resource);
    
    const unitCounts = acc[category].resources.reduce((units, res) => {
      units[res.unit] = (units[res.unit] || 0) + 1;
      return units;
    }, {} as Record<string, number>);
    
    const mostCommonUnit = Object.entries(unitCounts).sort((a, b) => b[1] - a[1])[0][0];
    acc[category].unit = mostCommonUnit;
    
    return acc;
  }, {} as Record<string, ResourceCategory>);

  const filteredResourceCategories = Object.values(resourcesByCategory).filter(
    category => category.category !== 'Other'
  );
  
  const shelterResourceDistribution = getResourceDistribution();

  filteredResourceCategories.forEach(category => {
    const categoryName = category.category as keyof typeof shelterResourceDistribution;
    category.shelterCount = shelterResourceDistribution[categoryName] || 0;
  });

  const chartData = filteredResourceCategories.map(category => ({
    name: category.category,
    value: category.totalAmount
  }));

  const shelterCoverageData = Object.entries(shelterResourceDistribution)
    .filter(([category]) => category !== 'Other')
    .map(([category, count]) => ({
      name: category,
      value: count,
      color: getColorForCategory(category)
    }));

  const calculateBarWidth = (amount: number, maxAmount: number) => {
    return `${Math.min(100, (amount / maxAmount) * 100)}%`;
  };

  const resourceDistributionData = shelters
    .map(shelter => {
      const shelterResources = resources.filter(r => r.shelter_id === shelter.id);
      const totalResourcesCount = shelterResources.reduce((sum, r) => sum + r.total_amount, 0);
      const categoryCount = new Set(shelterResources.map(r => r.category)).size;
      
      return {
        name: shelter.name.length > 15 ? shelter.name.substring(0, 15) + '...' : shelter.name,
        resourceCount: totalResourcesCount,
        categoryCount: categoryCount,
        occupancyRate: Math.round((shelter.current_occupancy / (shelter.capacity || 1)) * 100)
      };
    })
    .sort((a, b) => b.resourceCount - a.resourceCount)
    .slice(0, 5);

  const maxResourceCount = resourceDistributionData.length > 0 
    ? resourceDistributionData[0].resourceCount 
    : 1;

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
        {filteredResourceCategories.map((category) => (
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
            <CardDescription>Number of shelters with each resource type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ShelterCoverageChart data={shelterCoverageData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Resource Distribution by Shelter</CardTitle>
            <CardDescription>Top 5 shelters by resource count and diversity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              {resourceDistributionData.length > 0 ? (
                <div className="space-y-6">
                  {resourceDistributionData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm">{item.resourceCount.toLocaleString()} resources</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: calculateBarWidth(item.resourceCount, maxResourceCount) }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{item.categoryCount} categories</span>
                        <span>{item.occupancyRate}% occupancy</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-gray-500">No shelter data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
                    {selectedCategory.resources.map((resource) => {
                      const shelterName = shelters.find(s => s.id === resource.shelter_id)?.name || 'Central Storage';
                      return (
                        <tr key={resource.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{resource.name}</td>
                          <td className="px-4 py-3">{resource.total_amount} {resource.unit}</td>
                          <td className="px-4 py-3">{shelterName}</td>
                          <td className="px-4 py-3">{new Date(resource.last_updated).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
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
