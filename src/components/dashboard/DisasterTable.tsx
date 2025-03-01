
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const itemsPerPage = 5;
  
  // Filter and sort disasters
  const filteredAndSortedDisasters = useMemo(() => {
    return [...disasters]
      .filter(d => severityFilter ? d.severity === severityFilter : true)
      .filter(d => statusFilter ? d.status === statusFilter : true)
      .sort((a, b) => a.date > b.date ? -1 : 1);
  }, [disasters, severityFilter, statusFilter]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedDisasters.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisasters = filteredAndSortedDisasters.slice(indexOfFirstItem, indexOfLastItem);
  
  const goToNextPage = () => {
    setCurrentPage(current => Math.min(current + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage(current => Math.max(current - 1, 1));
  };

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <Card className="lg:col-span-2 animate-fade-in animation-delay-400 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-neumorphic dark:shadow-neumorphic-dark border-0">
      <CardHeader>
        <CardTitle>Active Disasters</CardTitle>
        <CardDescription>Recent disaster events being monitored</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select onValueChange={(value) => { setSeverityFilter(value || null); handleFilterChange(); }}>
              <SelectTrigger className="w-[120px] h-8 bg-gray-50 shadow-neumorphic-sm border-0">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => { setStatusFilter(value || null); handleFilterChange(); }}>
              <SelectTrigger className="w-[120px] h-8 bg-gray-50 shadow-neumorphic-sm border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="recovering">Recovering</SelectItem>
              </SelectContent>
            </Select>
            
            {(severityFilter || statusFilter) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 bg-gray-50 shadow-neumorphic-sm border-0"
                onClick={() => {
                  setSeverityFilter(null);
                  setStatusFilter(null);
                  handleFilterChange();
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
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
              {currentDisasters.length > 0 ? (
                currentDisasters.map((disaster, i) => (
                  <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 text-sm">{disaster.type}</td>
                    <td className="py-3 text-sm">{disaster.location}</td>
                    <td className="py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        disaster.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        disaster.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {disaster.severity}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        disaster.status === 'active'
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">No disasters match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredAndSortedDisasters.length > 0
              ? `Page ${currentPage} of ${totalPages} (${filteredAndSortedDisasters.length} total)`
              : "No results"}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || filteredAndSortedDisasters.length === 0}
              className="h-8 w-8 p-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 shadow-neumorphic-sm dark:shadow-neumorphic-sm-dark border-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || filteredAndSortedDisasters.length === 0}
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
