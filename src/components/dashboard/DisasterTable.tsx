
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
    <Card className="lg:col-span-2 animate-fade-in animation-delay-400">
      <CardHeader>
        <CardTitle>Active Disasters</CardTitle>
        <CardDescription>Recent disaster events being monitored</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">Location</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">Severity</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {disasters.map((disaster, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 text-sm">{disaster.type}</td>
                  <td className="py-3 text-sm">{disaster.location}</td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${disaster.severityClass}`}>
                      {disaster.severity}
                    </span>
                  </td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      disaster.status === 'active' 
                        ? 'bg-red-100 text-red-800' 
                        : disaster.status === 'monitoring' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{disaster.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6">
          <Button asChild variant="outline">
            <Link to="/predictions">View AI Predictions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterTable;
