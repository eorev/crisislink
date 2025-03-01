import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  LifeBuoy,
  AlertTriangle,
  BarChart2,
  LogIn,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return 'U';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
        }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <LifeBuoy className="h-7 w-7 text-crisisBlue-600" aria-hidden="true" />
          <span className="text-xl font-semibold bg-gradient-to-r from-crisisBlue-600 to-crisisBlue-800 bg-clip-text text-transparent">
            CrisisLink
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/shelters"
                className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
              >
                Shelters
              </Link>
              <Link
                to="/resources"
                className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
              >
                Resources
              </Link>
              <Link
                to="/predictions"
                className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
              >
                Predictions
              </Link>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarFallback className="bg-crisisBlue-100 text-crisisBlue-700">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.display_name || 'User'}</p>
                      <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="font-medium">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden py-4 px-4 bg-white/95 backdrop-blur-md border-t animate-fade-in">
          <div className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BarChart2 className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/shelters"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LifeBuoy className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" />
                  <span>Shelters</span>
                </Link>
                <Link
                  to="/resources"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <AlertTriangle className="h-5 w-5 text-crisisGold-500" aria-hidden="true" />
                  <span>Resources</span>
                </Link>
                <Link
                  to="/predictions"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BarChart2 className="h-5 w-5 text-crisisBlue-600" aria-hidden="true" />
                  <span>Predictions</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  <span>Settings</span>
                </Link>
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
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
                  <Link to="/login" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className="bg-crisisBlue-600 hover:bg-crisisBlue-700 justify-start">
                  <Link to="/register" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
