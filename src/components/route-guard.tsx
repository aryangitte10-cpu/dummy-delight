'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { UserRole } from '@/hooks/useUserRole';
import { fetchAuthSession } from 'aws-amplify/auth';

interface RouteGuardProps extends PropsWithChildren {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export default function RouteGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login',
}: RouteGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    // Don't check authorization while still loading auth data
    if (authLoading || roleLoading) {
      console.log('Still loading auth or role data...', { authLoading, roleLoading });
      return;
    }
    
    const checkAuthorization = async () => {
      try {
        console.log('Checking authorization...', { user, role, requiredRole });
        
        // Double check session is valid
        const session = await fetchAuthSession();
        console.log('Current session:', session);
        
        // Not authenticated
        if (!user || !session.tokens) {
          console.log('User not authenticated, redirecting to login');
          const currentPath = window.location.pathname;
          router.push(`${redirectTo}?redirect=${currentPath}`);
          return;
        }
        
        // If role check is required
        if (requiredRole) {
          let hasRequiredRole = false;
          
          // Check if user has at least one of the required roles
          if (Array.isArray(requiredRole)) {
            hasRequiredRole = requiredRole.includes(role as UserRole);
          } else {
            hasRequiredRole = role === requiredRole;
          }
          
          console.log('Role check result:', { hasRequiredRole, userRole: role, requiredRole });
          
          if (!hasRequiredRole) {
            console.log('User does not have required role, redirecting to home');
            router.push('/');
            return;
          }
        }
        
        // If we get here, user is authorized
        console.log('User is authorized');
        setAuthorized(true);
      } catch (error) {
        console.error('Authorization check failed:', error);
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [user, role, authLoading, roleLoading, requiredRole, redirectTo, router]);
  
  // Show loading state while checking auth
  if (authLoading || roleLoading) {
    console.log('Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render children only when authorized
  console.log('Final render state:', { authorized });
  return authorized ? <>{children}</> : null;
} 