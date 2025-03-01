
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '@/components/dashboard/LoadingState';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ResourceLevelCard from '@/components/dashboard/ResourceLevelCard';
import DisasterTable from '@/components/dashboard/DisasterTable';
import { recentDisasters } from '@/components/dashboard/DashboardData';
import { resourceCategoryData } from '@/components/resources/ResourceData';
import { getShelters } from '@/lib/supabase/shelters';
import { getResources } from '@/lib/supabase/resources';
import { Shelter } from '@/lib/supabase/types';
import { LifeBuoy, Users, Package, Activity } from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [shelterStats, setShelterStats] = useState([
    { 
      name: 'Active Shelters', 
      value: 0, 
      change: 0, 
      changeType: 'increase' as const,
      icon: <LifeBuoy className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" /> 
    },
    { 
      name: 'People Sheltered', 
      value: 0, 
      change: 0, 
      changeType: 'increase' as const,
      icon: <Users className="h-5 w-5 text-crisisGold-500" aria-hidden="true" /> 
    },
    { 
      name: 'Food Supplies', 
      value: 0, 
      change: 7, 
      changeType: 'decrease' as const,
      icon: <Package className="h-5 w-5 text-emerald-600" aria-hidden="true" /> 
    },
    { 
      name: 'Medical Kits', 
      value: 0, 
      change: 14, 
      changeType: 'increase' as const,
      icon: <Activity className="h-5 w-5 text-red-500" aria-hidden="true" /> 
    },
  ]);
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
  
  const fetchDashboardData = async () => {
    try {
      // Fetch shelters from database
      const shelterData = await getShelters();
      setShelters(shelterData);
      
      // Calculate shelter stats
      const activeShelters = shelterData.filter(s => s.status !== 'closed').length;
      const totalOccupancy = shelterData.reduce((acc, s) => acc + s.current_occupancy, 0);
      
      // Fetch resources to get supply counts
      const resourceData = await getResources();
      const foodSupplies = resourceData.filter(r => r.category === 'Food')
        .reduce((acc, r) => acc + r.total_amount, 0);
      const medicalSupplies = resourceData.filter(r => r.category === 'Medical')
        .reduce((acc, r) => acc + r.total_amount, 0);
      
      // Update stats with real data
      setShelterStats([
        { 
          name: 'Active Shelters', 
          value: activeShelters, 
          change: 12, // Keeping static for now, could calculate from previous data
          changeType: 'increase' as const,
          icon: <LifeBuoy className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" /> 
        },
        { 
          name: 'People Sheltered', 
          value: totalOccupancy, 
          change: 856, // Keeping static for now, could calculate from previous data
          changeType: 'increase' as const,
          icon: <Users className="h-5 w-5 text-crisisGold-500" aria-hidden="true" /> 
        },
        { 
          name: 'Food Supplies', 
          value: Math.round(foodSupplies), 
          change: 7, 
          changeType: 'decrease' as const,
          icon: <Package className="h-5 w-5 text-emerald-600" aria-hidden="true" /> 
        },
        { 
          name: 'Medical Kits', 
          value: Math.round(medicalSupplies), 
          change: 14, 
          changeType: 'increase' as const,
          icon: <Activity className="h-5 w-5 text-red-500" aria-hidden="true" /> 
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    // Fetch and initialize data
    const initializeData = async () => {
      await fetchDashboardData();
      
      // Simulate loading delay for UX
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Dashboard Updated",
          description: "Real-time data has been refreshed.",
          duration: 3000,
        });
      }, 1000);
    };
    
    initializeData();
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
