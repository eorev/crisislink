
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LifeBuoy, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <LifeBuoy className="h-16 w-16 text-crisisBlue-600" aria-hidden="true" />
        </div>
        <h1 className="text-7xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Button asChild size="lg" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
