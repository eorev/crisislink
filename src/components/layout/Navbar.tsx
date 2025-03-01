
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggleSimple } from './ThemeToggleSimple';
import { NavProfile } from './navbar/NavProfile';
import { NavLinks } from './navbar/NavLinks';
import { MobileMenu } from './navbar/MobileMenu';
import { AuthLinks } from './navbar/AuthLinks';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm'
          : 'py-5 bg-transparent'
        }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <LifeBuoy className="h-7 w-7 text-crisisBlue-600" aria-hidden="true" />
          <span className="text-xl font-semibold bg-gradient-to-r from-crisisBlue-600 to-crisisBlue-800 dark:from-crisisBlue-400 dark:to-crisisBlue-600 bg-clip-text text-transparent">
            CrisisLink
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <NavLinks />
              <div className="flex items-center gap-2">
                <NavProfile />
                <ThemeToggleSimple />
              </div>
            </>
          ) : (
            <AuthLinks />
          )}
        </nav>

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

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
