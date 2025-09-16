'use client';

import type React from 'react';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessLevel, getAccessLevelFromProfile } from '@/lib/access-control';

// Extended user interface with access control
interface User {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  accountType?: 'individual' | 'organization';
  companyName?: string;
  website?: string;
  linkedinProfile?: string;
  address?: string;
  organizationType?: string;
  natureOfBusiness?: string;
  typeOfWorkload?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  userType?: 'new' | 'existing';
  profileStatus: {
    basicInfoComplete: boolean;
    identityVerified: boolean;
    paymentSetupComplete: boolean;
  };
}

// Update the AuthContextType to include access control
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessLevel: AccessLevel;
  login: (
    email: string,
    password: string,
    userType?: 'new' | 'existing'
  ) => Promise<boolean>;
  logout: () => void;
  setUserData: (data: Partial<User>) => void;
  updateProfileStatus: (status: Partial<User['profileStatus']>) => void;
  refreshAccessLevel: () => void;
  getUserType: () => 'new' | 'existing' | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('none');

  // Calculate access level based on profile completion
  const calculateAccessLevel = (
    profileStatus: User['profileStatus']
  ): AccessLevel => {
    return getAccessLevelFromProfile(profileStatus);
  };

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthProvider: Checking authentication...');

      // Check multiple sources for authentication
      const hasTokenCookie = document.cookie.includes('auth-token');
      const hasTokenLocalStorage = !!localStorage.getItem('auth-token');
      const isAuthenticatedFlag =
        localStorage.getItem('isAuthenticated') === 'true';
      const hasFreshAuth = sessionStorage.getItem('freshAuth') === 'true';

      const hasToken =
        hasTokenCookie ||
        hasTokenLocalStorage ||
        isAuthenticatedFlag ||
        hasFreshAuth;

      console.log('AuthProvider: Authentication check results:', {
        hasTokenCookie,
        hasTokenLocalStorage,
        isAuthenticatedFlag,
        hasFreshAuth,
        finalResult: hasToken,
      });

      setIsAuthenticated(hasToken);

      // Try to get user data from localStorage
      if (hasToken) {
        try {
          const userData = localStorage.getItem('user_data');
          console.log('AuthProvider: User data from localStorage:', userData);

          if (userData) {
            const parsedUser = JSON.parse(userData);

            // Ensure profile status exists with defaults
            const userWithDefaults: User = {
              name: parsedUser.name || '',
              email: parsedUser.email || '',
              mobile: parsedUser.mobile || '',
              // Set accountType based on userType: new users are individual, existing users are organization
              accountType:
                parsedUser.accountType ||
                (parsedUser.userType === 'new' ? 'individual' : 'organization'),
              companyName: parsedUser.companyName,
              userType: parsedUser.userType || 'existing', // Default to existing
              profileStatus: {
                basicInfoComplete:
                  parsedUser.profileStatus?.basicInfoComplete ?? true, // From signup
                identityVerified:
                  parsedUser.profileStatus?.identityVerified ?? false,
                paymentSetupComplete:
                  parsedUser.profileStatus?.paymentSetupComplete ?? false,
                ...parsedUser.profileStatus,
              },
            };

            setUser(userWithDefaults);
            const calculatedAccessLevel = calculateAccessLevel(
              userWithDefaults.profileStatus
            );
            setAccessLevel(calculatedAccessLevel);

            // Set auth cookie for middleware
            const authToken = localStorage.getItem('auth-token');
            if (authToken) {
              document.cookie = `auth-token=${authToken}; path=/; max-age=86400`;
            }

            console.log(
              'AuthProvider: User set successfully:',
              userWithDefaults
            );
            console.log(
              'AuthProvider: Access level calculated:',
              calculatedAccessLevel
            );
          }
        } catch (e) {
          console.error('AuthProvider: Failed to parse user data', e);
          // Set default limited access for authenticated users without valid data
          const defaultUser: User = {
            name: 'User',
            userType: 'existing',
            profileStatus: {
              basicInfoComplete: true,
              identityVerified: false,
              paymentSetupComplete: false,
            },
          };
          setUser(defaultUser);
          setAccessLevel('limited');
          console.log('AuthProvider: Set default user with limited access');
        }
      } else {
        setAccessLevel('none');
        console.log(
          'AuthProvider: No authentication found, setting access level to none'
        );
      }

      // Clear fresh auth flag after first check
      if (hasFreshAuth) {
        sessionStorage.removeItem('freshAuth');
      }

      setIsLoading(false);
      console.log('AuthProvider: Authentication check completed');
    };

    // Initial check
    checkAuth();

    // Listen for custom auth update events
    const handleAuthUpdate = () => {
      console.log('AuthProvider: Received auth update event, re-checking...');
      checkAuth();
    };

    window.addEventListener('authUpdate', handleAuthUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('authUpdate', handleAuthUpdate);
    };
  }, []);

  const setUserData = (data: Partial<User>) => {
    const updatedUser = user
      ? { ...user, ...data }
      : ({
          name: data.name || 'User',
          userType: data.userType || 'existing',
          // Set accountType based on userType if not provided
          accountType:
            data.accountType ||
            (data.userType === 'new' ? 'individual' : 'organization'),
          profileStatus: {
            basicInfoComplete: true,
            identityVerified: false,
            paymentSetupComplete: false,
          },
          ...data,
        } as User);

    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));

    // Recalculate access level
    const newAccessLevel = calculateAccessLevel(updatedUser.profileStatus);
    setAccessLevel(newAccessLevel);
  };

  const updateProfileStatus = (status: Partial<User['profileStatus']>) => {
    if (!user) {
      return;
    }

    const updatedUser: User = {
      ...user,
      profileStatus: {
        ...user.profileStatus,
        ...status,
      },
    };

    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));

    // Recalculate access level
    const newAccessLevel = calculateAccessLevel(updatedUser.profileStatus);
    setAccessLevel(newAccessLevel);

    // Update middleware cookies for immediate access control
    document.cookie = `user_profile_status=${JSON.stringify(updatedUser.profileStatus)}; path=/; max-age=86400`;
  };

  const refreshAccessLevel = () => {
    if (user) {
      const newAccessLevel = calculateAccessLevel(user.profileStatus);
      setAccessLevel(newAccessLevel);
    }
  };

  const login = async (
    email: string,
    password: string,
    userType: 'new' | 'existing' = 'existing'
  ) => {
    // Simulate API call
    setIsLoading(true);

    // In a real app, this would be an API call to your auth endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Set a cookie to simulate authentication
    document.cookie = 'auth-token=authenticated; path=/; max-age=3600';

    // Set user based on type
    let defaultUser: User;

    if (userType === 'new') {
      // New user - just signed up, needs identity verification
      defaultUser = {
        name: 'New User',
        email: email,
        accountType: 'individual', // New users are individual
        userType: 'new',
        profileStatus: {
          basicInfoComplete: true, // Login implies basic info is complete
          identityVerified: false,
          paymentSetupComplete: false,
        },
      };
    } else {
      // Existing user - has basic profile but needs to complete it
      defaultUser = {
        name: 'Existing User',
        email: email,
        accountType: 'organization', // Existing users are organization
        userType: 'existing',
        profileStatus: {
          basicInfoComplete: true,
          identityVerified: false,
          paymentSetupComplete: false,
        },
      };
    }

    setUser(defaultUser);
    setAccessLevel('limited');
    localStorage.setItem('user_data', JSON.stringify(defaultUser));

    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  };

  // Update the logout function to properly clear auth state and redirect
  const logout = () => {
    // Clear the auth cookie
    document.cookie = 'auth-token=; path=/; max-age=0';
    setIsAuthenticated(false);
    setUser(null);
    setAccessLevel('none');
    localStorage.removeItem('user_data');

    // Add a small delay before redirecting to ensure state is updated
    setTimeout(() => {
      router.push('/auth/signin');
    }, 100);
  };

  const getUserType = () => {
    return user?.userType || null;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        accessLevel,
        login,
        logout,
        setUserData,
        updateProfileStatus,
        refreshAccessLevel,
        getUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
