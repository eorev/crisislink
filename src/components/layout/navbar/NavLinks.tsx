
import { Link } from 'react-router-dom';

export const NavLinks = ({ closeMenu }: { closeMenu?: () => void }) => {
  return (
    <>
      <Link
        to="/dashboard"
        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-crisisBlue-600 dark:hover:text-crisisBlue-400 transition-colors"
        onClick={closeMenu}
      >
        Dashboard
      </Link>
      <Link
        to="/shelters"
        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-crisisBlue-600 dark:hover:text-crisisBlue-400 transition-colors"
        onClick={closeMenu}
      >
        Shelters
      </Link>
      <Link
        to="/resources"
        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-crisisBlue-600 dark:hover:text-crisisBlue-400 transition-colors"
        onClick={closeMenu}
      >
        Resources
      </Link>
      <Link
        to="/predictions"
        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-crisisBlue-600 dark:hover:text-crisisBlue-400 transition-colors"
        onClick={closeMenu}
      >
        Predictions
      </Link>
    </>
  );
};
