
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Disaster {
  type: string;
  location: string;
  severity: string;
  time: string;
  date: Date;
  status: string;
  severityClass: string;
}

interface DisasterTableProps {
  disasters: Disaster[];
}

const DisasterTable = ({ disasters }: DisasterTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Sort disasters chronologically by date (most recent first)
  const sortedDisasters = useMemo(() => {
    return [...disasters].sort((a, b) => a.date > b.date ? -1 : 1);
  }, [disasters]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedDisasters.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisasters = sortedDisasters.slice(indexOfFirstItem, indexOfLastItem);
  
  const goToNextPage = () => {
    setCurrentPage(current => Math.min(current + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage(current => Math.max(current - 1, 1));
  };

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
              {currentDisasters.map((disaster, i) => (
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
        
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 shadow-neumorphic-sm dark:shadow-neumorphic-sm-dark border-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 shadow-neumorphic-sm dark:shadow-neumorphic-sm-dark border-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
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
