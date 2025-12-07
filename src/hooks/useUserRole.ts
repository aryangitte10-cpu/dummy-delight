'use client';

import { useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useAuth } from './useAuth';

// Define the UserRole type with both roles
export type UserRole = 'coach' | 'user';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userAttributes = await fetchUserAttributes();
        // Get the custom_role attribute
        const userRole = userAttributes['custom:custom_role'] as UserRole;
        setRole(userRole || 'user'); // Default to 'user' if no role is set
        console.log('User role:', userRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  // Helper function to check if user is a coach
  const isCoach = (): boolean => role === 'coach';
  
  // Helper function to check if user is a regular user
  const isUser = (): boolean => role === 'user';

  return { role, loading, isCoach, isUser };
} 