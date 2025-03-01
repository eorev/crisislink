
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '@/components/dashboard/LoadingState';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ResourceLevelCard from '@/components/dashboard/ResourceLevelCard';
import DisasterTable from '@/components/dashboard/DisasterTable';
import { shelterStats, recentDisasters } from '@/components/dashboard/DashboardData';
import { resourceCategoryData } from '@/components/resources/ResourceData';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Transform resource data for ResourceLevelCard
  const resourceLevels = resourceCategoryData.map(resource => {
    // Calculate level as percentage based on some threshold
    const maxAmount = resource.name.includes('Food') ? 20000 : 
                     resource.name.includes('Water') ? 40000 : 
                     resource.name.includes('Medical') ? 6000 : 
                     resource.name.includes('Power') ? 100 : 3000;
    
    const level = Math.round((resource.totalAmount / maxAmount) * 100);
    
    return {
      name: resource.name.split(' ')[0], // Just use the first word (Food, Water, etc.)
      level: level,
      alert: level < 50, // Alert if below 50%
    };
  });
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard Updated",
        description: "Real-time data has been refreshed.",
        duration: 3000,
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-gray-100">
        <DashboardHeader 
          title="Disaster Management Dashboard" 
          subtitle="Real-time monitoring of shelters and resources" 
        />

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Stats Grid */}
            <StatsGrid stats={shelterStats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Resource Levels */}
              <ResourceLevelCard resources={resourceLevels} />

              {/* Active Disasters with chronological sorting and pagination */}
              <DisasterTable disasters={recentDisasters} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
