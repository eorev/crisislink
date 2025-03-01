
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '@/components/dashboard/LoadingState';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ResourceLevelCard from '@/components/dashboard/ResourceLevelCard';
import DisasterTable from '@/components/dashboard/DisasterTable';
import { shelterStats, recentDisasters, resourceLevels } from '@/components/dashboard/DashboardData';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
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

              {/* Active Disasters */}
              <DisasterTable disasters={recentDisasters} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
