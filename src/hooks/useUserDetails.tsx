import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGet } from '@/lib/api';
import { useAuth } from './useAuth';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface UserDetailsContextType {
  userDetails: UserDetails | null;
  loading: boolean;
  refreshUserDetails: () => Promise<void>;
}

const UserDetailsContext = createContext<UserDetailsContextType | null>(null);

export function UserDetailsProvider({ children }: { children: ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadUserDetails = async () => {
    if (!user) {
      setUserDetails(null);
      setLoading(false);
      return;
    }
    
    try {
      const response = await apiGet<{ success: boolean; data: UserDetails }>('/api/user/profile');
      if (response.success) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [user]);

  const refreshUserDetails = async () => {
    setLoading(true);
    await loadUserDetails();
  };

  return (
    <UserDetailsContext.Provider value={{ userDetails, loading, refreshUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
}

export function useUserDetails() {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error('useUserDetails must be used within a UserDetailsProvider');
  }
  return context;
} 