
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const { toast } = useToast();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl shadow-neumorphic">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{subtitle}</p>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center bg-gray-50 shadow-neumorphic-sm hover:shadow-neumorphic-inset transition-shadow border-0"
          onClick={() => {
            toast({
              title: "Report Generated",
              description: "The report has been downloaded to your device.",
              duration: 3000,
            });
          }}
        >
          Generate Report
        </Button>
        <Button 
          asChild 
          size="sm" 
          className="bg-gray-50 text-crisisBlue-600 hover:text-crisisBlue-700 shadow-neumorphic-sm hover:shadow-neumorphic-inset transition-shadow border-0"
        >
          <Link to="/shelters">View All Shelters</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
