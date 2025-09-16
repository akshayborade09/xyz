'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInForm } from './sign-in-form';

type AuthStep = 'signin' | 'complete';

export function SignInFlow() {
  const router = useRouter();
  const [authStep, setAuthStep] = useState<AuthStep>('signin');
  const [email, setEmail] = useState('');

  // Authentication helper functions
  const setUserAuthData = (email: string) => {
    try {
      const userInfo = {
        name: email.split('@')[0],
        email: email,
        mobile: '',
        accountType: 'organization', // Default for existing users signing in
        signinCompletedAt: new Date().toISOString(),
      };
      document.cookie = `user_data=${JSON.stringify(userInfo)}; path=/; max-age=86400`;
      console.log('User auth data set successfully for sign-in flow');
    } catch (error) {
      console.error('Error setting user auth data:', error);
    }
  };

  const setAccessLevel = (level: 'full' = 'full') => {
    try {
      console.log('Setting access level for sign-in flow:', level);
      localStorage.setItem('accessLevel', level);

      const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      document.cookie = `auth-token=${authToken}; path=/; max-age=86400`;

      const profileStatus = {
        basicInfoComplete: true,
        identityVerified: true,
        paymentSetupComplete: true,
      };
      document.cookie = `user_profile_status=${JSON.stringify(profileStatus)}; path=/; max-age=86400`;

      console.log('Access level set successfully for sign-in flow');
    } catch (error) {
      console.error('Error setting access level:', error);
    }
  };

  // Handle completion of the sign-in step
  const handleSignInComplete = (userEmail: string) => {
    try {
      // Set authentication data before navigation
      console.log('Sign-in successful, setting auth data');
      setUserAuthData(userEmail);
      setAccessLevel('full');

      // Navigate to dashboard
      console.log('Navigating to dashboard...');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error in sign-in completion:', error);
      // Fallback navigation
      window.location.href = '/dashboard';
    }
  };

  return (
    <div>
      {authStep === 'signin' && (
        <SignInForm onComplete={handleSignInComplete} />
      )}
    </div>
  );
}
