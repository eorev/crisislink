
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-[600px]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-crisisBlue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
