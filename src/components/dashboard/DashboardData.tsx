
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
    date: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Wildfire', 
    location: 'Los Angeles, CA', 
    severity: 'Medium', 
    time: '6 hours ago',
    date: new Date(new Date().getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'monitoring',
    severityClass: 'bg-yellow-100 text-yellow-800'
  },
  { 
    type: 'Flood', 
    location: 'New Orleans, LA', 
    severity: 'Low', 
    time: '1 day ago',
    date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'recovering',
    severityClass: 'bg-blue-100 text-blue-800'
  },
  { 
    type: 'Hurricane', 
    location: 'Miami, FL', 
    severity: 'High', 
    time: '2 days ago',
    date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Tornado', 
    location: 'Oklahoma City, OK', 
    severity: 'Medium', 
    time: '4 hours ago',
    date: new Date(new Date().getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'active',
    severityClass: 'bg-yellow-100 text-yellow-800'
  },
  { 
    type: 'Flash Flood', 
    location: 'Austin, TX', 
    severity: 'Low', 
    time: '12 hours ago',
    date: new Date(new Date().getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: 'monitoring',
    severityClass: 'bg-green-100 text-green-800'
  },
  { 
    type: 'Winter Storm', 
    location: 'Chicago, IL', 
    severity: 'High', 
    time: '18 hours ago',
    date: new Date(new Date().getTime() - 18 * 60 * 60 * 1000), // 18 hours ago
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Landslide', 
    location: 'Portland, OR', 
    severity: 'Medium', 
    time: '3 days ago',
    date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'recovering',
    severityClass: 'bg-blue-100 text-blue-800'
  },
  { 
    type: 'Tsunami Warning', 
    location: 'Seattle, WA', 
    severity: 'High', 
    time: '1 hour ago',
    date: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Heatwave', 
    location: 'Phoenix, AZ', 
    severity: 'Low', 
    time: '5 hours ago',
    date: new Date(new Date().getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'monitoring',
    severityClass: 'bg-green-100 text-green-800'
  },
  { 
    type: 'Volcanic Activity', 
    location: 'Honolulu, HI', 
    severity: 'High', 
    time: '3 hours ago',
    date: new Date(new Date().getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  },
  { 
    type: 'Chemical Spill', 
    location: 'Detroit, MI', 
    severity: 'Medium', 
    time: '8 hours ago',
    date: new Date(new Date().getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: 'monitoring',
    severityClass: 'bg-yellow-100 text-yellow-800'
  },
  { 
    type: 'Power Outage', 
    location: 'Dallas, TX', 
    severity: 'Low', 
    time: '10 hours ago',
    date: new Date(new Date().getTime() - 10 * 60 * 60 * 1000), // 10 hours ago
    status: 'recovering',
    severityClass: 'bg-blue-100 text-blue-800'
  },
  { 
    type: 'Gas Leak', 
    location: 'Denver, CO', 
    severity: 'Medium', 
    time: '7 hours ago',
    date: new Date(new Date().getTime() - 7 * 60 * 60 * 1000), // 7 hours ago
    status: 'active',
    severityClass: 'bg-yellow-100 text-yellow-800'
  },
  { 
    type: 'Industrial Fire', 
    location: 'Pittsburgh, PA', 
    severity: 'High', 
    time: '5 hours ago',
    date: new Date(new Date().getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'active',
    severityClass: 'bg-red-100 text-red-800'
  }
];

export const resourceLevels = [
  { name: 'Water', level: 72, alert: false },
  { name: 'Food', level: 48, alert: true },
  { name: 'Medicine', level: 63, alert: false },
  { name: 'Shelter Space', level: 85, alert: false },
  { name: 'Volunteers', level: 37, alert: true },
];
