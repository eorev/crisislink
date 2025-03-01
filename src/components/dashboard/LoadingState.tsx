
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-[600px]">
      <div className="text-center bg-gray-50 p-10 rounded-xl shadow-neumorphic">
        <div className="p-4 rounded-full bg-gray-50 shadow-neumorphic-inset mx-auto w-16 h-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-crisisBlue-600" />
        </div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
