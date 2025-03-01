
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggleSimple } from '../ThemeToggleSimple';

export const AuthLinks = () => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggleSimple />
      <Button asChild variant="outline" size="sm" className="font-medium">
        <Link to="/login">Sign In</Link>
      </Button>
      <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700 dark:bg-crisisBlue-700 dark:hover:bg-crisisBlue-800">
        <Link to="/register">Sign Up</Link>
      </Button>
    </div>
  );
};
