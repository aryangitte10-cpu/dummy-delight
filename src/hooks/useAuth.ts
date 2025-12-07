'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getCurrentUser, signIn as amplifySignIn, signOut as amplifySignOut, signUp as amplifySignUp, type SignInOutput, fetchAuthSession, resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { AuthUser } from 'aws-amplify/auth';

interface SignUpData {
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<SignInOutput>;
  signUp: (data: SignUpData) => Promise<{ userId: string | undefined; nextStep: any }>;
  signOut: () => Promise<void>;
  forgotPassword: (username: string) => Promise<void>;
  confirmForgotPassword: (username: string, code: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthState(): AuthContextType {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Checking auth session...');
      const session = await fetchAuthSession();
      console.log('Auth session:', session);
      
      if (!session.tokens) {
        console.log('No tokens in session, setting user to null');
        setUser(null);
        return;
      }

      console.log('Getting current user...');
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      
      // Store tokens in cookies for middleware
      document.cookie = `idToken=${session.tokens.idToken?.toString()}; path=/; max-age=3600; secure; samesite=strict`;
      document.cookie = `accessToken=${session.tokens.accessToken?.toString()}; path=/; max-age=3600; secure; samesite=strict`;
      
      setUser(currentUser);
    } catch (error) {
      console.log('Error checking auth state:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const signIn = async (username: string, password: string): Promise<SignInOutput> => {
    try {
      setLoading(true);
      console.log('Signing in...');
      const result = await amplifySignIn({ username, password });
      console.log('Sign in result:', result);
      
      if (result.isSignedIn) {
        await checkUser();
      }
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      const { userId, nextStep } = await amplifySignUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName,
            name: `${data.firstName} ${data.lastName}`,
            'custom:custom_role': data.role
          },
          autoSignIn: true
        }
      });

      if (nextStep.signUpStep === 'DONE') {
        await checkUser();
      }

      return { userId, nextStep };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await amplifySignOut();
      // Clear auth cookies
      document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      setLoading(true);
      await resetPassword({ username });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmForgotPassword = async (username: string, code: string, newPassword: string) => {
    try {
      setLoading(true);
      await confirmResetPassword({ username, confirmationCode: code, newPassword });
    } catch (error) {
      console.error('Confirm forgot password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    confirmForgotPassword,
  };
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 