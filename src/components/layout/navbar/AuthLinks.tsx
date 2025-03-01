
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggleSimple } from '../ThemeToggleSimple';

export const AuthLinks = () => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggleSimple />
      <Button asChild variant="outline" size="sm" className="font-medium border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700 dark:bg-crisisBlue-500 dark:hover:bg-crisisBlue-600 dark:text-white">
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
};
