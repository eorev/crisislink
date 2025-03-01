
import { Link } from 'react-router-dom';

export const NavLinks = ({ closeMenu }: { closeMenu?: () => void }) => {
  return (
    <>
      <Link
        to="/dashboard"
        className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
        onClick={closeMenu}
      >
        Dashboard
      </Link>
      <Link
        to="/shelters"
        className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
        onClick={closeMenu}
      >
        Shelters
      </Link>
      <Link
        to="/resources"
        className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
        onClick={closeMenu}
      >
        Resources
      </Link>
      <Link
        to="/predictions"
        className="text-sm font-medium text-gray-700 hover:text-crisisBlue-600 transition-colors"
        onClick={closeMenu}
      >
        Predictions
      </Link>
    </>
  );
};
