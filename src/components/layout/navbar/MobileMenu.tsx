
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  LogIn,
  LogOut,
  LifeBuoy,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <nav className="md:hidden py-4 px-4 bg-white/95 backdrop-blur-md border-t animate-fade-in">
      <div className="flex flex-col space-y-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={onClose}
            >
              <BarChart2 className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/shelters"
              className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={onClose}
            >
              <LifeBuoy className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" />
              <span>Shelters</span>
            </Link>
            <Link
              to="/resources"
              className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={onClose}
            >
              <AlertTriangle className="h-5 w-5 text-crisisGold-500" aria-hidden="true" />
              <span>Resources</span>
            </Link>
            <Link
              to="/predictions"
              className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={onClose}
            >
              <BarChart2 className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" />
              <span>Predictions</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={onClose}
            >
              <Settings className="h-5 w-5 text-gray-600" aria-hidden="true" />
              <span>Settings</span>
            </Link>
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  logout();
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <div className="pt-3 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link to="/login" className="flex items-center gap-2" onClick={onClose}>
                <LogIn className="h-5 w-5" aria-hidden="true" />
                <span>Sign In</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700 justify-start">
              <Link to="/register" className="flex items-center gap-2" onClick={onClose}>
                <LogIn className="h-5 w-5" aria-hidden="true" />
                <span>Sign Up</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
