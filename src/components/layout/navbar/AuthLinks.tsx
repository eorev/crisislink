
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AuthLinks = () => {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm" className="font-medium border-gray-200 hover:bg-gray-50">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
};
