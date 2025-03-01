
import { 
  LifeBuoy, 
  Users, 
  Package, 
  Activity
} from 'lucide-react';

// Sample data for the dashboard
export const shelterStats = [
  { 
    name: 'Active Shelters', 
    value: 87, 
    change: 12, 
    changeType: 'increase' as const,
    icon: <LifeBuoy className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" /> 
  },
  { 
    name: 'People Sheltered', 
    value: 4328, 
    change: 856, 
    changeType: 'increase' as const,
    icon: <Users className="h-5 w-5 text-crisisGold-500" aria-hidden="true" /> 
  },
  { 
    name: 'Food Supplies', 
    value: 68, 
    change: 7, 
    changeType: 'decrease' as const,
    icon: <Package className="h-5 w-5 text-emerald-600" aria-hidden="true" /> 
  },
  { 
    name: 'Medical Kits', 
    value: 82, 
    change: 14, 
    changeType: 'increase' as const,
    icon: <Activity className="h-5 w-5 text-red-500" aria-hidden="true" /> 
  },
];

export const recentDisasters = [
  { 
    type: 'Earthquake', 
    location: 'San Francisco, CA', 
    severity: 'High', 
    time: '2 hours ago',
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Flood', 
    location: 'New Orleans, LA', 
    severity: 'Medium', 
    time: '1 day ago',
    status: 'monitoring',
    severityClass: 'bg-yellow-100 text-yellow-800'
  },
  { 
    type: 'Wildfire', 
    location: 'Los Angeles, CA', 
    severity: 'High', 
    time: '6 hours ago',
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Hurricane', 
    location: 'Miami, FL', 
    severity: 'Medium', 
    time: '2 days ago',
    status: 'recovering',
    severityClass: 'bg-blue-100 text-blue-800'
  },
];

export const resourceLevels = [
  { name: 'Water', level: 72, alert: false },
  { name: 'Food', level: 48, alert: true },
  { name: 'Medicine', level: 63, alert: false },
  { name: 'Shelter Space', level: 85, alert: false },
  { name: 'Volunteers', level: 37, alert: true },
];
