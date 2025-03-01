import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, getSession, signOut } from '@/lib/supabase';
import { UserProfile, getUserProfile, updateUserProfile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null; // profile.area_code is used as the user's zip code
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'area_code' | 'display_name'>>) => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => { },
  updateProfile: async () => null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = async (currentUser: User) => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await getSession();
        if (session) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);

          // Fetch user profile
          if (currentUser) {
            await fetchUserProfile(currentUser);
          }
        } else {
          // If no session and on a protected route, redirect to home
          const protectedRoutes = ['/dashboard', '/shelters', '/resources', '/predictions', '/settings'];
          if (protectedRoutes.includes(location.pathname)) {
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [location.pathname, navigate]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'area_code' | 'display_name'>>) => {
    try {
      const updatedProfile = await updateUserProfile(updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isAuthenticated: !!user,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
