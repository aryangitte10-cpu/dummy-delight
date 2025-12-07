"use client";

import { ReactNode, useEffect, useState } from "react";
import { configureAmplify } from "@/lib/amplify-config";
import { AuthProvider } from "@/components/auth-provider";
import { UserDetailsProvider } from "@/hooks/useUserDetails";

interface AmplifyProviderProps {
  children: ReactNode;
}

export function AmplifyProvider({ children }: AmplifyProviderProps) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const initializeAmplify = async () => {
      try {
        await configureAmplify();
        setIsConfigured(true);
      } catch (error) {
        console.error('Failed to configure Amplify:', error);
      }
    };

    initializeAmplify();
  }, []);

  if (!isConfigured) {
    return null; // or a loading spinner
  }

  return (
    <AuthProvider>
      <UserDetailsProvider>
        {children}
      </UserDetailsProvider>
    </AuthProvider>
  );
} 