
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Disaster {
  type: string;
  location: string;
  severity: string;
  time: string;
  status: string;
  severityClass: string;
}

interface DisasterTableProps {
  disasters: Disaster[];
}

const DisasterTable = ({ disasters }: DisasterTableProps) => {
  return (
    <Card className="lg:col-span-2 animate-fade-in animation-delay-400 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-neumorphic dark:shadow-neumorphic-dark border-0">
      <CardHeader>
        <CardTitle>Active Disasters</CardTitle>
        <CardDescription>Recent disaster events being monitored</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-neumorphic-inset dark:shadow-neumorphic-inset-dark">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Severity</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {disasters.map((disaster, i) => (
                <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-3 text-sm">{disaster.type}</td>
                  <td className="py-3 text-sm">{disaster.location}</td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${disaster.severityClass}`}>
                      {disaster.severity}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${disaster.status === 'active'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : disaster.status === 'monitoring'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                      {disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{disaster.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <Button 
            asChild 
            variant="outline" 
            className="px-6 py-2 bg-gray-50 dark:bg-gray-800 shadow-neumorphic-sm dark:shadow-neumorphic-sm-dark hover:shadow-neumorphic-inset dark:hover:shadow-neumorphic-inset-dark transition-shadow border-0 font-medium"
          >
            <Link to="/predictions">View AI Predictions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterTable;
